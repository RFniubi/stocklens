from __future__ import annotations

import json
import math
import os
import re
import hashlib
import hmac
import secrets
import sqlite3
import ssl
import time
import http.cookiejar
from http.cookies import SimpleCookie
import urllib.parse
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from errno import EADDRINUSE
from email.utils import parsedate_to_datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SYMBOL_RE = re.compile(r"^[A-Za-z0-9.^=_-]{1,32}$")
VALID_RANGES = {"1mo", "3mo", "6mo", "1y", "2y", "5y"}
VALID_INTERVALS = {"1d", "1wk", "1mo"}
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"
OPENAI_DEFAULT_MODEL = "gpt-5.5"
DB_PATH = Path(os.environ.get("STOCKLENS_DB_PATH") or Path.home() / ".stocklens" / "stocklens.sqlite3")
SESSION_COOKIE = "stocklens_session"
SESSION_TTL_SECONDS = 60 * 60 * 24 * 30
PASSWORD_ITERATIONS = 260_000
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
CERT_PATHS = (
    "/etc/ssl/cert.pem",
    "/opt/homebrew/etc/openssl@3/cert.pem",
    "/usr/local/etc/openssl@3/cert.pem",
)
YAHOO_HEADERS = {
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": "Mozilla/5.0 StockLens/1.0",
}
YAHOO_CRUMB_HEADERS = {
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": "Mozilla/5.0 StockLens/1.0",
}
FUNDAMENTAL_TYPES = (
    "annualFreeCashFlow",
    "annualOperatingIncome",
    "annualTaxProvision",
    "annualPretaxIncome",
    "annualTotalDebt",
    "annualStockholdersEquity",
    "annualCashCashEquivalentsAndShortTermInvestments",
    "trailingFreeCashFlow",
)
_YAHOO_COOKIE_JAR = http.cookiejar.CookieJar()
_YAHOO_OPENER: urllib.request.OpenerDirector | None = None
_YAHOO_CRUMB: str | None = None


def _clean_symbol(raw: str) -> str:
    symbol = raw.strip().upper()
    if not symbol or not SYMBOL_RE.match(symbol):
        raise ValueError("Use a valid ticker symbol, for example AAPL, NVDA, SPY, or BRK-B.")
    return symbol


def _get_index(values: list | None, index: int):
    if not values or index >= len(values):
        return None
    value = values[index]
    return value if isinstance(value, (int, float)) else None


def market_ssl_context() -> ssl.SSLContext:
    if os.environ.get("SSL_CERT_FILE") or os.environ.get("SSL_CERT_DIR"):
        return ssl.create_default_context()

    try:
        import certifi  # type: ignore

        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass

    for cert_path in CERT_PATHS:
        if Path(cert_path).exists():
            return ssl.create_default_context(cafile=cert_path)

    return ssl.create_default_context()


def yahoo_opener() -> urllib.request.OpenerDirector:
    global _YAHOO_OPENER
    if _YAHOO_OPENER is None:
        _YAHOO_OPENER = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(_YAHOO_COOKIE_JAR),
            urllib.request.HTTPSHandler(context=market_ssl_context()),
        )
    return _YAHOO_OPENER


def is_certificate_error(error: Exception) -> bool:
    reason = getattr(error, "reason", error)
    return isinstance(reason, ssl.SSLCertVerificationError) or isinstance(
        getattr(reason, "__cause__", None),
        ssl.SSLCertVerificationError,
    )


def fetch_json_url(
    url: str,
    *,
    headers: dict[str, str] | None = None,
    opener: urllib.request.OpenerDirector | None = None,
    timeout: int = 14,
) -> dict:
    request = urllib.request.Request(url, headers=headers or YAHOO_HEADERS)
    if opener:
        with opener.open(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))

    with urllib.request.urlopen(
        request,
        timeout=timeout,
        context=market_ssl_context(),
    ) as response:
        return json.loads(response.read().decode("utf-8"))


def yahoo_crumb() -> str:
    global _YAHOO_CRUMB
    if _YAHOO_CRUMB:
        return _YAHOO_CRUMB

    opener = yahoo_opener()
    try:
        opener.open(
            urllib.request.Request("https://fc.yahoo.com", headers=YAHOO_CRUMB_HEADERS),
            timeout=8,
        ).read()
    except Exception:
        pass

    request = urllib.request.Request(
        "https://query1.finance.yahoo.com/v1/test/getcrumb",
        headers=YAHOO_CRUMB_HEADERS,
    )
    with opener.open(request, timeout=8) as response:
        _YAHOO_CRUMB = response.read().decode("utf-8").strip()

    return _YAHOO_CRUMB


def yahoo_json(path: str, params: dict[str, str] | None = None, *, crumb: bool = False) -> dict:
    global _YAHOO_CRUMB
    query = dict(params or {})
    opener = None
    if crumb:
        query["crumb"] = yahoo_crumb()
        opener = yahoo_opener()

    url = f"https://query1.finance.yahoo.com/{path}"
    if query:
        url = f"{url}?{urllib.parse.urlencode(query)}"

    try:
        return fetch_json_url(url, opener=opener)
    except urllib.error.HTTPError as error:
        if crumb and error.code in {401, 403}:
            _YAHOO_CRUMB = None
            query["crumb"] = yahoo_crumb()
            retry_url = f"https://query1.finance.yahoo.com/{path}?{urllib.parse.urlencode(query)}"
            return fetch_json_url(retry_url, opener=yahoo_opener())
        raise


def raw_value(value) -> float | None:
    if isinstance(value, dict):
        raw = value.get("raw")
        return raw if isinstance(raw, (int, float)) else None
    return value if isinstance(value, (int, float)) else None


def read_text_config(filename: str) -> str | None:
    for path in (
        ROOT / ".stocklens" / filename,
        Path.home() / ".stocklens" / filename,
    ):
        try:
            if path.exists():
                value = path.read_text(encoding="utf-8").strip()
                if value:
                    return value
        except OSError:
            continue
    return None


def user_config_path(filename: str) -> Path:
    return Path.home() / ".stocklens" / filename


def db_connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db() -> None:
    with db_connect() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                display_name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL UNIQUE,
                created_at INTEGER NOT NULL,
                expires_at INTEGER NOT NULL,
                user_agent TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_settings (
                user_id INTEGER NOT NULL,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (user_id, key),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS transcripts (
                user_id INTEGER NOT NULL,
                symbol TEXT NOT NULL,
                content TEXT NOT NULL,
                updated_at INTEGER NOT NULL,
                PRIMARY KEY (user_id, symbol),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            """
        )
        connection.execute("CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)")


def normalize_email(raw: str) -> str:
    email = raw.strip().lower()
    if not EMAIL_RE.match(email):
        raise ValueError("Use a valid email address.")
    return email


def validate_password(password: str) -> None:
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters.")


def password_hash(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS)
    return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, iterations_text, salt_hex, digest_hex = stored_hash.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt_hex),
            int(iterations_text),
        )
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, TypeError):
        return False


def session_token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def user_payload(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "email": row["email"],
        "displayName": row["display_name"],
    }


def create_user(email: str, password: str, display_name: str | None = None) -> dict:
    clean_email = normalize_email(email)
    validate_password(password)
    clean_name = (display_name or clean_email.split("@")[0]).strip()[:80] or clean_email
    now = int(time.time())
    try:
        with db_connect() as connection:
            cursor = connection.execute(
                """
                INSERT INTO users (email, display_name, password_hash, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (clean_email, clean_name, password_hash(password), now),
            )
            user_id = cursor.lastrowid
            row = connection.execute(
                "SELECT id, email, display_name FROM users WHERE id = ?",
                (user_id,),
            ).fetchone()
            return user_payload(row)
    except sqlite3.IntegrityError as error:
        raise ValueError("An account with this email already exists.") from error


def authenticate_user(email: str, password: str) -> dict:
    clean_email = normalize_email(email)
    with db_connect() as connection:
        row = connection.execute(
            "SELECT id, email, display_name, password_hash FROM users WHERE email = ?",
            (clean_email,),
        ).fetchone()
    if not row or not verify_password(password, row["password_hash"]):
        raise ValueError("Email or password is incorrect.")
    return user_payload(row)


def create_session(user_id: int, user_agent: str | None = None) -> str:
    token = secrets.token_urlsafe(32)
    now = int(time.time())
    with db_connect() as connection:
        connection.execute(
            """
            INSERT INTO sessions (user_id, token_hash, created_at, expires_at, user_agent)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, session_token_hash(token), now, now + SESSION_TTL_SECONDS, (user_agent or "")[:240]),
        )
    return token


def delete_session(token: str | None) -> None:
    if not token:
        return
    with db_connect() as connection:
        connection.execute("DELETE FROM sessions WHERE token_hash = ?", (session_token_hash(token),))


def get_session_user(token: str | None) -> dict | None:
    if not token:
        return None
    now = int(time.time())
    with db_connect() as connection:
        connection.execute("DELETE FROM sessions WHERE expires_at <= ?", (now,))
        row = connection.execute(
            """
            SELECT users.id, users.email, users.display_name
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token_hash = ? AND sessions.expires_at > ?
            """,
            (session_token_hash(token), now),
        ).fetchone()
    return user_payload(row) if row else None


SETTING_DEFAULTS = {
    "symbol": "NVDA",
    "range": "1y",
    "searchHistory": [],
    "alertEmail": "",
    "autoEmailDraft": False,
}


def get_user_setting(user_id: int, key: str):
    with db_connect() as connection:
        row = connection.execute(
            "SELECT value FROM user_settings WHERE user_id = ? AND key = ?",
            (user_id, key),
        ).fetchone()
    if not row:
        return None
    try:
        return json.loads(row["value"])
    except json.JSONDecodeError:
        return None


def set_user_setting(user_id: int, key: str, value) -> None:
    with db_connect() as connection:
        connection.execute(
            """
            INSERT INTO user_settings (user_id, key, value, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id, key)
            DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
            """,
            (user_id, key, json.dumps(value), int(time.time())),
        )


def delete_user_setting(user_id: int, key: str) -> None:
    with db_connect() as connection:
        connection.execute(
            "DELETE FROM user_settings WHERE user_id = ? AND key = ?",
            (user_id, key),
        )


def normalize_settings_patch(payload: dict) -> dict:
    patch = {}
    if "symbol" in payload:
        patch["symbol"] = _clean_symbol(str(payload["symbol"]))
    if "range" in payload:
        range_name = str(payload["range"])
        if range_name not in VALID_RANGES:
            raise ValueError("Unsupported range.")
        patch["range"] = range_name
    if "searchHistory" in payload:
        raw_history = payload["searchHistory"]
        if not isinstance(raw_history, list):
            raise ValueError("Search history must be a list.")
        history = []
        for item in raw_history[:10]:
            try:
                symbol = _clean_symbol(str(item))
            except ValueError:
                continue
            if symbol not in history:
                history.append(symbol)
        patch["searchHistory"] = history
    if "alertEmail" in payload:
        alert_email = str(payload["alertEmail"]).strip()[:180]
        if alert_email:
            normalize_email(alert_email)
        patch["alertEmail"] = alert_email
    if "autoEmailDraft" in payload:
        patch["autoEmailDraft"] = bool(payload["autoEmailDraft"])
    return patch


def get_user_settings(user_id: int) -> dict:
    settings = dict(SETTING_DEFAULTS)
    with db_connect() as connection:
        rows = connection.execute(
            "SELECT key, value FROM user_settings WHERE user_id = ?",
            (user_id,),
        ).fetchall()
    for row in rows:
        if row["key"] in settings:
            try:
                settings[row["key"]] = json.loads(row["value"])
            except json.JSONDecodeError:
                continue
    return settings


def update_user_settings(user_id: int, payload: dict) -> dict:
    patch = normalize_settings_patch(payload)
    for key, value in patch.items():
        set_user_setting(user_id, key, value)
    return get_user_settings(user_id)


def get_user_transcript(user_id: int, symbol: str) -> str:
    with db_connect() as connection:
        row = connection.execute(
            "SELECT content FROM transcripts WHERE user_id = ? AND symbol = ?",
            (user_id, symbol),
        ).fetchone()
    return row["content"] if row else ""


def save_user_transcript(user_id: int, symbol: str, content: str) -> None:
    if len(content) > 120_000:
        raise ValueError("Transcript is too long.")
    with db_connect() as connection:
        connection.execute(
            """
            INSERT INTO transcripts (user_id, symbol, content, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id, symbol)
            DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at
            """,
            (user_id, symbol, content, int(time.time())),
        )


def openai_api_key(user_id: int | None = None) -> str | None:
    if os.environ.get("OPENAI_API_KEY"):
        return os.environ["OPENAI_API_KEY"]
    if user_id is not None:
        user_key = get_user_setting(user_id, "openai_api_key")
        if isinstance(user_key, str) and user_key.strip():
            return user_key.strip()
    return read_text_config("openai_api_key")


def openai_model() -> str:
    return os.environ.get("STOCKLENS_OPENAI_MODEL") or read_text_config("openai_model") or OPENAI_DEFAULT_MODEL


def openai_key_status(user_id: int | None = None) -> dict:
    env_configured = bool(os.environ.get("OPENAI_API_KEY"))
    user_key = get_user_setting(user_id, "openai_api_key") if user_id is not None else None
    user_configured = isinstance(user_key, str) and bool(user_key.strip()) and not env_configured
    file_configured = bool(read_text_config("openai_api_key")) and not env_configured and not user_configured
    return {
        "configured": env_configured or user_configured or file_configured,
        "source": (
            "environment"
            if env_configured
            else "user database"
            if user_configured
            else "local file"
            if file_configured
            else "none"
        ),
        "model": openai_model(),
    }


def save_openai_api_key(api_key: str, user_id: int | None = None) -> dict:
    clean_key = api_key.strip()
    if len(clean_key) < 20:
        raise ValueError("Paste a valid OpenAI API key.")
    if user_id is not None:
        set_user_setting(user_id, "openai_api_key", clean_key)
        return openai_key_status(user_id)
    key_path = user_config_path("openai_api_key")
    key_path.parent.mkdir(parents=True, exist_ok=True)
    key_path.write_text(clean_key, encoding="utf-8")
    os.chmod(key_path, 0o600)
    return openai_key_status(user_id)


def clear_openai_api_key(user_id: int | None = None) -> dict:
    if user_id is not None:
        delete_user_setting(user_id, "openai_api_key")
        return openai_key_status(user_id)
    key_path = user_config_path("openai_api_key")
    try:
        key_path.unlink()
    except FileNotFoundError:
        pass
    return openai_key_status(user_id)


def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def score_threshold(value: float | None, bands: tuple[tuple[float, int], ...], fallback: int = 50) -> int:
    if value is None:
        return fallback
    for threshold, score in bands:
        if value >= threshold:
            return score
    return 20


def fetch_history(symbol: str, range_name: str, interval: str) -> dict:
    params = urllib.parse.urlencode(
        {
            "range": range_name,
            "interval": interval,
            "includePrePost": "false",
            "events": "div,splits",
        }
    )
    encoded_symbol = urllib.parse.quote(symbol, safe="")
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{encoded_symbol}?{params}"
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "StockLens/1.0 (+local analysis app)",
        },
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=14,
            context=market_ssl_context(),
        ) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as error:
        if is_certificate_error(error):
            raise RuntimeError(
                "Python cannot verify the market data HTTPS certificate. "
                "Run `.venv/bin/python -m pip install certifi` or set "
                "`SSL_CERT_FILE=/etc/ssl/cert.pem`."
            ) from error
        raise

    chart = payload.get("chart", {})
    if chart.get("error"):
        message = chart["error"].get("description") or "Market data request failed."
        raise RuntimeError(message)

    results = chart.get("result") or []
    if not results:
        raise RuntimeError("No price history was returned for that symbol.")

    result = results[0]
    meta = result.get("meta", {})
    timestamps = result.get("timestamp") or []
    quote = ((result.get("indicators") or {}).get("quote") or [{}])[0]
    adjclose = (((result.get("indicators") or {}).get("adjclose") or [{}])[0]).get("adjclose")

    points = []
    for index, timestamp in enumerate(timestamps):
        close = _get_index(adjclose, index) or _get_index(quote.get("close"), index)
        if close is None:
            continue
        points.append(
            {
                "timestamp": timestamp,
                "open": _get_index(quote.get("open"), index),
                "high": _get_index(quote.get("high"), index),
                "low": _get_index(quote.get("low"), index),
                "close": close,
                "volume": _get_index(quote.get("volume"), index),
            }
        )

    if len(points) < 2:
        raise RuntimeError("Not enough price history was returned for analysis.")

    return {
        "symbol": meta.get("symbol") or symbol,
        "currency": meta.get("currency"),
        "exchange": meta.get("fullExchangeName") or meta.get("exchangeName"),
        "regularMarketPrice": meta.get("regularMarketPrice"),
        "previousClose": meta.get("chartPreviousClose") or meta.get("previousClose"),
        "range": range_name,
        "interval": interval,
        "timezone": meta.get("timezone"),
        "points": points,
        "source": "Yahoo Finance chart API",
    }


def fetch_news(symbol: str) -> dict:
    search_text = f"{symbol} stock latest news when:7d"
    query = urllib.parse.quote(search_text)
    url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/rss+xml, application/xml, text/xml",
            "User-Agent": "Mozilla/5.0 StockLens/1.0",
        },
    )

    with urllib.request.urlopen(
        request,
        timeout=14,
        context=market_ssl_context(),
    ) as response:
        payload = response.read()

    root = ET.fromstring(payload)
    news = []

    for item in root.findall("./channel/item")[:8]:
        published = None
        published_text = item.findtext("pubDate")
        if published_text:
            try:
                published = int(parsedate_to_datetime(published_text).timestamp())
            except (TypeError, ValueError, OverflowError):
                published = None

        source = item.find("source")
        news.append(
            {
                "title": item.findtext("title"),
                "publisher": source.text if source is not None else "Google News",
                "link": item.findtext("link"),
                "published": published,
            }
        )
    news.sort(key=lambda row: row.get("published") or 0, reverse=True)
    return {
        "available": bool(news),
        "items": news,
        "source": "Google News RSS",
        "query": search_text,
        "fetchedAt": int(time.time()),
    }


NEWS_ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "available": {"type": "boolean"},
        "direction": {"type": "string", "enum": ["Bullish", "Bearish", "Neutral", "Mixed"]},
        "impactScore": {"type": "number", "minimum": 0, "maximum": 100},
        "confidence": {"type": "number", "minimum": 0, "maximum": 100},
        "summary": {"type": "string"},
        "whyMove": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 2,
            "maxItems": 5,
        },
        "catalysts": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
            "maxItems": 5,
        },
        "risks": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
            "maxItems": 5,
        },
        "horizons": {
            "type": "object",
            "properties": {
                "oneDay": {"type": "string"},
                "oneWeek": {"type": "string"},
                "oneMonth": {"type": "string"},
            },
            "required": ["oneDay", "oneWeek", "oneMonth"],
            "additionalProperties": False,
        },
        "priceVolumeRead": {"type": "string"},
        "optionsRead": {"type": "string"},
        "sourcesUsed": {
            "type": "array",
            "items": {"type": "integer"},
            "minItems": 1,
            "maxItems": 8,
        },
    },
    "required": [
        "available",
        "direction",
        "impactScore",
        "confidence",
        "summary",
        "whyMove",
        "catalysts",
        "risks",
        "horizons",
        "priceVolumeRead",
        "optionsRead",
        "sourcesUsed",
    ],
    "additionalProperties": False,
}


def compact_news_items(news: dict) -> list[dict]:
    items = []
    for index, item in enumerate((news.get("items") or [])[:8], start=1):
        items.append(
            {
                "id": index,
                "title": item.get("title"),
                "publisher": item.get("publisher"),
                "published": item.get("published"),
                "link": item.get("link"),
            }
        )
    return items


def latest_price_context(symbol: str) -> dict:
    try:
        history = fetch_history(symbol, "3mo", "1d")
        points = history["points"]
        last = points[-1]
        previous = points[-2] if len(points) > 1 else last
        volume_window = [point.get("volume") for point in points[-20:] if isinstance(point.get("volume"), (int, float))]
        avg_volume = sum(volume_window) / len(volume_window) if volume_window else None
        return {
            "lastClose": last.get("close"),
            "lastDate": last.get("timestamp"),
            "dayMovePercent": (last["close"] / previous["close"] - 1) * 100 if previous.get("close") else None,
            "rangeReturnPercent": (last["close"] / points[0]["close"] - 1) * 100 if points[0].get("close") else None,
            "volume": last.get("volume"),
            "volumeRatio20d": (last.get("volume") / avg_volume) if last.get("volume") and avg_volume else None,
            "source": history.get("source"),
        }
    except Exception as error:
        return {"error": str(error)}


def latest_options_context(symbol: str) -> dict:
    try:
        options = fetch_options(symbol)
        return {
            "available": options.get("available"),
            "putCallVolume": options.get("putCallVolume"),
            "putCallOpenInterest": options.get("putCallOpenInterest"),
            "callVolume": options.get("callVolume"),
            "putVolume": options.get("putVolume"),
            "totalOptionVolume": options.get("totalOptionVolume"),
            "atmIv": options.get("atmIv"),
            "gammaTilt": options.get("gammaTilt"),
            "daysToExpiration": options.get("daysToExpiration"),
        }
    except Exception as error:
        return {"available": False, "error": str(error)}


def fallback_news_analysis(symbol: str, news: dict, price_context: dict, options_context: dict, reason: str) -> dict:
    items = news.get("items", [])
    titles = " ".join((item.get("title") or "") for item in news.get("items", []))
    lower_titles = titles.lower()
    positive_hits = sum(
        lower_titles.count(word)
        for word in ("beat", "upgrade", "upside", "growth", "strong", "rally", "momentum", "buy")
    )
    negative_hits = sum(
        lower_titles.count(word)
        for word in ("miss", "downgrade", "risk", "weak", "lawsuit", "probe", "cut", "selloff")
    )
    day_move = price_context.get("dayMovePercent")
    volume_ratio = price_context.get("volumeRatio20d")
    put_call = options_context.get("putCallVolume")
    has_price_volume = number_is_finite(day_move) and number_is_finite(volume_ratio)
    score = 50 + (positive_hits - negative_hits) * 7
    if has_price_volume and volume_ratio >= 1.2:
        score += 5 if day_move > 0 else -5
    if number_is_finite(put_call):
        score += 4 if put_call < 0.75 else -4 if put_call > 1.25 else 0
    score = clamp(score, 0, 100)
    direction = "Bullish" if score >= 60 else "Bearish" if score <= 42 else "Mixed"
    confidence = 24 + min(len(items), 6) * 5
    if has_price_volume:
        confidence += 10
    if number_is_finite(put_call):
        confidence += 8
    confidence = round(clamp(confidence, 20, 72))
    conclusion = {
        "Bullish": "positive",
        "Bearish": "negative",
        "Mixed": "mixed",
    }[direction]
    source_note = (
        "OpenAI API available on server; local model used because the provider call failed."
        if reason and "OPENAI_API_KEY" not in reason
        else "Local model used automatically; no user-entered API key is required."
    )

    return {
        "available": bool(items),
        "model": "StockLens local news model",
        "source": "Local news + market context model",
        "error": None,
        "direction": direction,
        "impactScore": round(score),
        "confidence": confidence if items else 20,
        "summary": f"Conclusion: {symbol} news impact is {conclusion}. The local model scores current headlines, price/volume confirmation, and options tone at {round(score)}/100.",
        "whyMove": [
            f"Reviewed {len(items)} recent headline(s) from {news.get('source') or 'news feeds'} plus latest price/volume and options context.",
            f"Headline catalyst score is {round(score)} after positive/negative keywords and market-confirmation adjustments.",
            source_note,
        ],
        "catalysts": [
            (items or [{}])[0].get("title") or "No fresh headline available.",
        ],
        "risks": [
            "Local analysis reads headlines, publishers, price/volume, and options context; it may miss full article nuance and valuation impact.",
        ],
        "horizons": {
            "oneDay": "Use price/volume confirmation before reacting to the headline.",
            "oneWeek": "Watch whether follow-up coverage keeps the same tone.",
            "oneMonth": "Confirm whether the catalyst changes estimates, demand, margins, or guidance.",
        },
        "priceVolumeRead": (
            f"Latest day move {day_move:.1f}% with volume {volume_ratio:.1f}x 20D average."
            if has_price_volume
            else "Price and volume context is incomplete."
        ),
        "optionsRead": (
            f"Put/call volume is {put_call:.2f}."
            if isinstance(put_call, (int, float))
            else "Options context is unavailable."
        ),
        "sourcesUsed": [item.get("id") for item in items[:3] if item.get("id")],
    }


def number_is_finite(value) -> bool:
    return isinstance(value, (int, float)) and math.isfinite(value)


def extract_response_text(payload: dict) -> str:
    if isinstance(payload.get("output_text"), str):
        return payload["output_text"]
    for item in payload.get("output") or []:
        for content in item.get("content") or []:
            if isinstance(content.get("text"), str):
                return content["text"]
    raise RuntimeError("OpenAI response did not include output text.")


def call_openai_news_analysis(
    symbol: str,
    news: dict,
    price_context: dict,
    options_context: dict,
    user_id: int | None = None,
) -> dict:
    api_key = openai_api_key(user_id)
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set. You can also save it in ~/.stocklens/openai_api_key.")

    model = openai_model()
    news_items = compact_news_items(news)
    if not news_items:
        raise RuntimeError("No news headlines available for AI analysis.")

    context = {
        "symbol": symbol,
        "currentDate": time.strftime("%Y-%m-%d"),
        "news": news_items,
        "newsSource": news.get("source"),
        "newsQuery": news.get("query"),
        "newsFetchedAt": news.get("fetchedAt"),
        "priceContext": price_context,
        "optionsContext": options_context,
    }
    prompt = (
        "Analyze these company news headlines for an investor. "
        "Do not claim you read full articles. Use only the provided headlines, publishers, dates, price context, and options context. "
        "Explain plausible bullish/bearish drivers, how price/volume/options confirm or contradict the news, and concise time-horizon impact. "
        "This is scenario analysis, not financial advice."
    )
    body = {
        "model": model,
        "input": [
            {
                "role": "system",
                "content": "You are a careful equity-news analyst. Be specific, concise, evidence-bound, and avoid certainty.",
            },
            {
                "role": "user",
                "content": f"{prompt}\n\nContext JSON:\n{json.dumps(context, ensure_ascii=False)}",
            },
        ],
        "reasoning": {"effort": os.environ.get("STOCKLENS_OPENAI_REASONING", "low")},
        "text": {
            "verbosity": "low",
            "format": {
                "type": "json_schema",
                "name": "stocklens_news_analysis",
                "strict": True,
                "schema": NEWS_ANALYSIS_SCHEMA,
            },
        },
        "max_output_tokens": 1400,
    }
    request = urllib.request.Request(
        OPENAI_RESPONSES_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "StockLens/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=30,
            context=market_ssl_context(),
        ) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI request failed: HTTP {error.code} {detail[:240]}") from error

    parsed = json.loads(extract_response_text(payload))
    parsed["available"] = True
    parsed["model"] = model
    parsed["source"] = "OpenAI Responses API"
    return parsed


def fetch_ai_news_analysis(symbol: str, user_id: int | None = None) -> dict:
    try:
        news = fetch_news(symbol)
    except Exception as error:
        news = {"available": False, "items": [], "error": str(error), "source": "Google News RSS"}
    price_context = latest_price_context(symbol)
    options_context = latest_options_context(symbol)
    try:
        return {
            "symbol": symbol,
            "news": compact_news_items(news),
            "newsSource": news.get("source"),
            "newsQuery": news.get("query"),
            "newsFetchedAt": news.get("fetchedAt"),
            "analysis": call_openai_news_analysis(symbol, news, price_context, options_context, user_id),
        }
    except Exception as error:
        return {
            "symbol": symbol,
            "news": compact_news_items(news),
            "newsSource": news.get("source"),
            "newsQuery": news.get("query"),
            "newsFetchedAt": news.get("fetchedAt"),
            "analysis": fallback_news_analysis(symbol, news, price_context, options_context, str(error)),
        }


def extract_timeseries(payload: dict) -> dict[str, list[dict]]:
    series: dict[str, list[dict]] = {}
    for item in payload.get("timeseries", {}).get("result", []):
        types = item.get("meta", {}).get("type") or []
        if not types:
            continue
        type_name = types[0]
        entries = []
        for entry in item.get(type_name, []):
            value = raw_value(entry.get("reportedValue"))
            if value is None:
                continue
            entries.append(
                {
                    "date": entry.get("asOfDate"),
                    "value": value,
                    "fmt": (entry.get("reportedValue") or {}).get("fmt"),
                }
            )
        series[type_name] = sorted(entries, key=lambda row: row.get("date") or "")
    return series


def map_by_date(series: dict[str, list[dict]], key: str) -> dict[str, float]:
    return {
        row["date"]: row["value"]
        for row in series.get(key, [])
        if row.get("date") and isinstance(row.get("value"), (int, float))
    }


def calculate_roic_series(series: dict[str, list[dict]]) -> list[dict]:
    operating_income = map_by_date(series, "annualOperatingIncome")
    tax = map_by_date(series, "annualTaxProvision")
    pretax = map_by_date(series, "annualPretaxIncome")
    debt = map_by_date(series, "annualTotalDebt")
    equity = map_by_date(series, "annualStockholdersEquity")
    cash = map_by_date(series, "annualCashCashEquivalentsAndShortTermInvestments")
    rows = []

    for date in sorted(set(operating_income) & set(debt) & set(equity)):
        invested_capital = debt.get(date, 0) + equity.get(date, 0) - cash.get(date, 0)
        if invested_capital <= 0:
            continue

        tax_rate = 0.21
        if pretax.get(date, 0) > 0 and date in tax:
            tax_rate = clamp(tax[date] / pretax[date], 0, 0.35)

        roic = (operating_income[date] * (1 - tax_rate)) / invested_capital * 100
        rows.append({"date": date, "value": roic})

    return rows


def fetch_fundamentals(symbol: str) -> dict:
    now = int(time.time())
    payload = yahoo_json(
        "ws/fundamentals-timeseries/v1/finance/timeseries/" + urllib.parse.quote(symbol, safe=""),
        {
            "symbol": symbol,
            "type": ",".join(FUNDAMENTAL_TYPES),
            "period1": "0",
            "period2": str(now),
        },
    )
    series = extract_timeseries(payload)
    fcf_series = series.get("annualFreeCashFlow", [])
    roic_series = calculate_roic_series(series)
    latest_fcf = fcf_series[-1]["value"] if fcf_series else None
    previous_fcf = fcf_series[-2]["value"] if len(fcf_series) > 1 else None
    latest_roic = roic_series[-1]["value"] if roic_series else None
    fcf_growth = None
    fcf_cagr = None

    if latest_fcf is not None and previous_fcf:
        fcf_growth = (latest_fcf / previous_fcf - 1) * 100

    if len(fcf_series) >= 3:
        first = fcf_series[0]["value"]
        years = len(fcf_series) - 1
        if first > 0 and latest_fcf and latest_fcf > 0 and years > 0:
            fcf_cagr = ((latest_fcf / first) ** (1 / years) - 1) * 100

    roic_score = score_threshold(
        latest_roic,
        ((25, 100), (15, 85), (10, 70), (5, 55), (0, 40)),
    )
    growth_score = score_threshold(
        fcf_growth,
        ((30, 100), (15, 85), (5, 70), (0, 55), (-10, 40)),
    )
    score = round(roic_score * 0.55 + growth_score * 0.45)

    return {
        "available": bool(fcf_series or roic_series),
        "score": score,
        "roic": latest_roic,
        "roicSeries": roic_series[-4:],
        "freeCashFlow": latest_fcf,
        "fcfGrowth": fcf_growth,
        "fcfCagr": fcf_cagr,
        "fcfSeries": fcf_series[-4:],
        "source": "Yahoo Finance fundamentals time series",
    }


def fetch_factor_metrics(symbol: str) -> dict:
    payload = yahoo_json(
        "v10/finance/quoteSummary/" + urllib.parse.quote(symbol, safe=""),
        {"modules": "price,summaryDetail,defaultKeyStatistics,financialData"},
        crumb=True,
    )
    result = (payload.get("quoteSummary", {}).get("result") or [{}])[0]
    price = result.get("price") or {}
    summary = result.get("summaryDetail") or {}
    key_stats = result.get("defaultKeyStatistics") or {}
    financial = result.get("financialData") or {}

    metrics = {
        "marketCap": raw_value(price.get("marketCap")) or raw_value(summary.get("marketCap")),
        "sharesOutstanding": raw_value(key_stats.get("sharesOutstanding")) or raw_value(price.get("sharesOutstanding")),
        "beta": raw_value(summary.get("beta")),
        "trailingPe": raw_value(summary.get("trailingPE")) or raw_value(key_stats.get("trailingPE")),
        "forwardPe": raw_value(summary.get("forwardPE")) or raw_value(key_stats.get("forwardPE")),
        "priceToBook": raw_value(key_stats.get("priceToBook")) or raw_value(summary.get("priceToBook")),
        "priceToSales": raw_value(summary.get("priceToSalesTrailing12Months")),
        "enterpriseToRevenue": raw_value(key_stats.get("enterpriseToRevenue")),
        "enterpriseToEbitda": raw_value(key_stats.get("enterpriseToEbitda")),
        "returnOnEquity": raw_value(financial.get("returnOnEquity")),
        "returnOnAssets": raw_value(financial.get("returnOnAssets")),
        "profitMargins": raw_value(financial.get("profitMargins")),
        "grossMargins": raw_value(financial.get("grossMargins")),
        "operatingMargins": raw_value(financial.get("operatingMargins")),
        "revenueGrowth": raw_value(financial.get("revenueGrowth")),
        "earningsGrowth": raw_value(financial.get("earningsGrowth")),
    }

    return {
        "available": any(value is not None for value in metrics.values()),
        **metrics,
        "source": "Yahoo Finance quoteSummary factor metrics",
    }


def norm_cdf_density(value: float) -> float:
    return math.exp(-0.5 * value * value) / math.sqrt(2 * math.pi)


def option_gamma(spot: float, strike: float, iv: float, years: float) -> float:
    if spot <= 0 or strike <= 0 or iv <= 0 or years <= 0:
        return 0
    d1 = (math.log(spot / strike) + 0.5 * iv * iv * years) / (iv * math.sqrt(years))
    return norm_cdf_density(d1) / (spot * iv * math.sqrt(years))


def weighted_average(options: list[dict], field: str, *, spot: float | None = None) -> float | None:
    total_weight = 0.0
    total = 0.0
    for option in options:
        value = option.get(field)
        if not isinstance(value, (int, float)) or value <= 0:
            continue
        if spot and abs((option.get("strike", 0) / spot) - 1) > 0.08:
            continue
        weight = option.get("openInterest") or option.get("volume") or 1
        total += value * weight
        total_weight += weight
    return total / total_weight if total_weight else None


def sum_option_field(options: list[dict], field: str) -> float:
    return sum(value for option in options if isinstance((value := option.get(field)), (int, float)))


def fetch_options(symbol: str) -> dict:
    payload = yahoo_json(
        "v7/finance/options/" + urllib.parse.quote(symbol, safe=""),
        crumb=True,
    )
    chain = (payload.get("optionChain", {}).get("result") or [{}])[0]
    option_sets = chain.get("options") or []
    if not option_sets:
        return {"available": False, "source": "Yahoo Finance options"}

    quote = chain.get("quote") or {}
    spot = raw_value(quote.get("regularMarketPrice")) or raw_value(quote.get("regularMarketPreviousClose"))
    option_set = option_sets[0]
    calls = option_set.get("calls") or []
    puts = option_set.get("puts") or []
    expiration = option_set.get("expirationDate")
    days = max(1, round(((expiration or time.time()) - time.time()) / 86400))
    years = max(days / 365, 1 / 365)
    call_oi = sum_option_field(calls, "openInterest")
    put_oi = sum_option_field(puts, "openInterest")
    call_volume = sum_option_field(calls, "volume")
    put_volume = sum_option_field(puts, "volume")
    put_call_oi = put_oi / call_oi if call_oi else None
    put_call_volume = put_volume / call_volume if call_volume else None
    all_options = calls + puts
    atm_iv = weighted_average(all_options, "impliedVolatility", spot=spot) if spot else None
    average_iv = weighted_average(all_options, "impliedVolatility")
    call_gex = 0.0
    put_gex = 0.0

    if spot:
        for option in calls:
            gamma = option_gamma(spot, option.get("strike", 0), option.get("impliedVolatility", 0), years)
            call_gex += gamma * (option.get("openInterest") or 0) * 100 * spot * spot
        for option in puts:
            gamma = option_gamma(spot, option.get("strike", 0), option.get("impliedVolatility", 0), years)
            put_gex -= gamma * (option.get("openInterest") or 0) * 100 * spot * spot

    gross_gex = abs(call_gex) + abs(put_gex)
    gamma_tilt = (call_gex + put_gex) / gross_gex if gross_gex else None
    implied_move = spot * atm_iv * math.sqrt(years) if spot and atm_iv else None

    score = 50
    if put_call_oi is not None:
        score += 15 if put_call_oi < 0.7 else 6 if put_call_oi < 1 else -12 if put_call_oi > 1.25 else 0
    if put_call_volume is not None:
        score += 10 if put_call_volume < 0.7 else 4 if put_call_volume < 1 else -10 if put_call_volume > 1.25 else 0
    if atm_iv is not None:
        score += 5 if atm_iv < 0.35 else -6 if atm_iv > 0.75 else 0
    if gamma_tilt is not None:
        score += 7 if gamma_tilt > 0.15 else -7 if gamma_tilt < -0.15 else 0

    return {
        "available": True,
        "score": round(clamp(score, 0, 100)),
        "expiration": expiration,
        "daysToExpiration": days,
        "callVolume": call_volume,
        "putVolume": put_volume,
        "totalOptionVolume": call_volume + put_volume,
        "putCallOpenInterest": put_call_oi,
        "putCallVolume": put_call_volume,
        "averageIv": average_iv,
        "atmIv": atm_iv,
        "impliedMove": implied_move,
        "callGex": call_gex,
        "putGex": put_gex,
        "netGex": call_gex + put_gex,
        "gammaTilt": gamma_tilt,
        "source": "Yahoo Finance options chain",
    }


def period_return(points: list[dict], sessions: int) -> float | None:
    if len(points) < 2:
        return None
    start_index = max(0, len(points) - sessions)
    start = points[start_index]["close"]
    end = points[-1]["close"]
    if not start:
        return None
    return (end / start - 1) * 100


def fetch_relative_strength(symbol: str) -> dict:
    stock = fetch_history(symbol, "1y", "1d")
    spy = fetch_history("SPY", "1y", "1d")
    stock_points = stock["points"]
    spy_points = spy["points"]
    stock_6m = period_return(stock_points, 126)
    stock_12m = period_return(stock_points, 252)
    spy_6m = period_return(spy_points, 126)
    spy_12m = period_return(spy_points, 252)
    excess_6m = stock_6m - spy_6m if stock_6m is not None and spy_6m is not None else None
    excess_12m = stock_12m - spy_12m if stock_12m is not None and spy_12m is not None else None

    score = 50
    if excess_6m is not None:
        score += 22 if excess_6m > 20 else 14 if excess_6m > 10 else 6 if excess_6m > 0 else -12 if excess_6m < -10 else -5
    if excess_12m is not None:
        score += 18 if excess_12m > 25 else 11 if excess_12m > 12 else 5 if excess_12m > 0 else -12 if excess_12m < -12 else -5

    if stock_6m is not None and stock_12m is not None:
        score += 6 if stock_6m > 0 and stock_12m > 0 else -8 if stock_6m < 0 and stock_12m < 0 else 0

    return {
        "available": True,
        "score": round(clamp(score, 0, 100)),
        "stockReturn6m": stock_6m,
        "stockReturn12m": stock_12m,
        "spyReturn6m": spy_6m,
        "spyReturn12m": spy_12m,
        "excessReturn6m": excess_6m,
        "excessReturn12m": excess_12m,
        "source": "Yahoo Finance chart API: ticker versus SPY",
    }


def revision_percent(row: dict, previous_key: str) -> float | None:
    trend = row.get("epsTrend") or {}
    current = raw_value(trend.get("current"))
    previous = raw_value(trend.get(previous_key))
    if current is None or not previous:
        return None
    return (current / previous - 1) * 100


def revision_counts(row: dict) -> tuple[float | None, float | None]:
    revisions = row.get("epsRevisions") or {}
    up = raw_value(revisions.get("upLast30days"))
    down = raw_value(revisions.get("downLast30days"))
    return up, down


def fetch_earnings_revision(symbol: str) -> dict:
    payload = yahoo_json(
        "v10/finance/quoteSummary/" + urllib.parse.quote(symbol, safe=""),
        {"modules": "earningsTrend"},
        crumb=True,
    )
    result = (payload.get("quoteSummary", {}).get("result") or [{}])[0]
    trend_rows = (result.get("earningsTrend") or {}).get("trend") or []
    periods = []

    for row in trend_rows:
        period = row.get("period")
        if period not in {"0q", "+1q", "0y", "+1y"}:
            continue
        up, down = revision_counts(row)
        eps_avg = raw_value((row.get("earningsEstimate") or {}).get("avg"))
        periods.append(
            {
                "period": period,
                "endDate": row.get("endDate"),
                "epsAvg": eps_avg,
                "epsGrowth": raw_value((row.get("earningsEstimate") or {}).get("growth")),
                "revision7d": revision_percent(row, "7daysAgo"),
                "revision30d": revision_percent(row, "30daysAgo"),
                "revision90d": revision_percent(row, "90daysAgo"),
                "upLast30Days": up,
                "downLast30Days": down,
            }
        )

    primary = next((row for row in periods if row["period"] == "0q"), periods[0] if periods else None)
    next_q = next((row for row in periods if row["period"] == "+1q"), None)
    score = 50
    for weight, row in ((0.58, primary), (0.42, next_q)):
        if not row:
            continue
        revision_30d = row.get("revision30d")
        revision_90d = row.get("revision90d")
        up = row.get("upLast30Days") or 0
        down = row.get("downLast30Days") or 0
        net_revisions = up - down
        local = 50
        if revision_30d is not None:
            local += 22 if revision_30d > 8 else 14 if revision_30d > 3 else 6 if revision_30d > 0 else -14 if revision_30d < -5 else -6
        if revision_90d is not None:
            local += 10 if revision_90d > 8 else 5 if revision_90d > 0 else -8 if revision_90d < -5 else 0
        local += 12 if net_revisions >= 10 else 6 if net_revisions > 0 else -12 if net_revisions <= -5 else -4 if net_revisions < 0 else 0
        score += (local - 50) * weight

    return {
        "available": bool(periods),
        "score": round(clamp(score, 0, 100)),
        "periods": periods,
        "currentQuarter": primary,
        "nextQuarter": next_q,
        "source": "Yahoo Finance earningsTrend analyst estimate revisions",
    }


def fetch_institutional_flow(symbol: str) -> dict:
    payload = yahoo_json(
        "v10/finance/quoteSummary/" + urllib.parse.quote(symbol, safe=""),
        {
            "modules": "institutionOwnership,majorHoldersBreakdown,netSharePurchaseActivity",
        },
        crumb=True,
    )
    result = (payload.get("quoteSummary", {}).get("result") or [{}])[0]
    ownership = (result.get("institutionOwnership") or {}).get("ownershipList") or []
    holders = []
    for holder in ownership[:10]:
        holders.append(
            {
                "organization": holder.get("organization"),
                "pctHeld": raw_value(holder.get("pctHeld")),
                "position": raw_value(holder.get("position")),
                "value": raw_value(holder.get("value")),
                "pctChange": raw_value(holder.get("pctChange")),
                "reportDate": (holder.get("reportDate") or {}).get("fmt"),
            }
        )

    major = result.get("majorHoldersBreakdown") or {}
    activity = result.get("netSharePurchaseActivity") or {}
    net_inst_buying = raw_value(activity.get("netInstSharesBuying"))
    net_inst_percent = raw_value(activity.get("netInstBuyingPercent"))
    institutions_held = raw_value(major.get("institutionsPercentHeld"))
    positive_holders = sum(1 for holder in holders if (holder.get("pctChange") or 0) > 0)
    negative_holders = sum(1 for holder in holders if (holder.get("pctChange") or 0) < 0)
    weighted_change = 0.0
    total_weight = 0.0

    for holder in holders:
        pct_held = holder.get("pctHeld") or 0
        pct_change = holder.get("pctChange")
        if pct_change is None:
            continue
        weighted_change += pct_change * pct_held
        total_weight += pct_held

    weighted_change = weighted_change / total_weight if total_weight else None
    score = 50
    if net_inst_percent is not None:
        score += 22 if net_inst_percent > 0.015 else 14 if net_inst_percent > 0.005 else 5 if net_inst_percent > 0 else -14 if net_inst_percent < -0.005 else -5
    if weighted_change is not None:
        score += 14 if weighted_change > 0.03 else 8 if weighted_change > 0 else -14 if weighted_change < -0.03 else -6 if weighted_change < 0 else 0
    score += 8 if positive_holders > negative_holders else -8 if negative_holders > positive_holders else 0

    return {
        "available": bool(holders or net_inst_buying is not None),
        "score": round(clamp(score, 0, 100)),
        "holders": holders,
        "topHolders": holders[:5],
        "positiveHolders": positive_holders,
        "negativeHolders": negative_holders,
        "weightedChange": weighted_change,
        "netInstSharesBuying": net_inst_buying,
        "netInstBuyingPercent": net_inst_percent,
        "institutionsPercentHeld": institutions_held,
        "source": "Yahoo Finance holder and net institutional purchase data",
    }


def fetch_macro_context() -> dict:
    spy = fetch_history("SPY", "6mo", "1d")
    vix = fetch_history("^VIX", "6mo", "1d")
    spy_points = spy["points"]
    vix_points = vix["points"]
    spy_closes = [point["close"] for point in spy_points]
    spy_return = (spy_closes[-1] / spy_closes[0] - 1) * 100
    spy_ma50 = sum(spy_closes[-50:]) / min(50, len(spy_closes))
    vix_latest = vix_points[-1]["close"]
    score = 50

    score += 15 if spy_return > 5 else 6 if spy_return > 0 else -15 if spy_return < -5 else -5
    score += 10 if spy_closes[-1] > spy_ma50 else -10
    score += 10 if vix_latest < 18 else -10 if vix_latest > 25 else 0

    return {
        "available": True,
        "score": round(clamp(score, 0, 100)),
        "spyReturn": spy_return,
        "spyAbove50d": spy_closes[-1] > spy_ma50,
        "vix": vix_latest,
        "source": "Yahoo Finance chart API: SPY and ^VIX",
    }


def fetch_research(symbol: str) -> dict:
    sections = {}
    errors = []

    for key, fetcher in (
        ("fundamentals", lambda: fetch_fundamentals(symbol)),
        ("factorMetrics", lambda: fetch_factor_metrics(symbol)),
        ("options", lambda: fetch_options(symbol)),
        ("news", lambda: fetch_news(symbol)),
        ("macro", fetch_macro_context),
        ("relativeStrength", lambda: fetch_relative_strength(symbol)),
        ("earningsRevision", lambda: fetch_earnings_revision(symbol)),
        ("institutionalFlow", lambda: fetch_institutional_flow(symbol)),
    ):
        try:
            sections[key] = fetcher()
        except Exception as error:
            sections[key] = {"available": False, "error": str(error)}
            errors.append(f"{key}: {error}")

    return {"symbol": symbol, **sections, "errors": errors}


def create_server(host: str, preferred_port: int) -> tuple[ThreadingHTTPServer, int]:
    if preferred_port <= 0:
        server = ThreadingHTTPServer((host, 0), StockLensHandler)
        return server, server.server_address[1]

    for port in range(preferred_port, preferred_port + 20):
        try:
            return ThreadingHTTPServer((host, port), StockLensHandler), port
        except OSError as error:
            if error.errno != EADDRINUSE:
                raise

    server = ThreadingHTTPServer((host, 0), StockLensHandler)
    return server, server.server_address[1]


class StockLensHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format: str, *args) -> None:
        print(f"{self.address_string()} - {format % args}")

    def _send_json(self, status: int, payload: dict, headers: list[tuple[str, str]] | None = None) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for key, value in headers or []:
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def _cookie_value(self, name: str) -> str | None:
        cookie_header = self.headers.get("Cookie")
        if not cookie_header:
            return None
        cookies = SimpleCookie(cookie_header)
        morsel = cookies.get(name)
        return morsel.value if morsel else None

    def _session_cookie(self, token: str) -> str:
        secure = "; Secure" if os.environ.get("STOCKLENS_COOKIE_SECURE") == "1" else ""
        return (
            f"{SESSION_COOKIE}={token}; Path=/; Max-Age={SESSION_TTL_SECONDS}; "
            f"HttpOnly; SameSite=Lax{secure}"
        )

    def _clear_session_cookie(self) -> str:
        secure = "; Secure" if os.environ.get("STOCKLENS_COOKIE_SECURE") == "1" else ""
        return f"{SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax{secure}"

    def _current_user(self) -> dict | None:
        return get_session_user(self._cookie_value(SESSION_COOKIE))

    def _require_user(self) -> dict | None:
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "Please log in to use StockLens."})
            return None
        return user

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/auth/status":
            self._handle_auth_status()
            return

        if parsed.path == "/api/health":
            self._send_json(200, {"ok": True})
            return

        if parsed.path.startswith("/api/"):
            user = self._require_user()
            if not user:
                return

            if parsed.path == "/api/history":
                self._handle_history(parsed)
                return

            if parsed.path == "/api/research":
                self._handle_research(parsed)
                return

            if parsed.path == "/api/news-analysis":
                self._handle_news_analysis(parsed, user)
                return

            if parsed.path == "/api/openai-key-status":
                self._send_json(200, openai_key_status(user["id"]))
                return

            if parsed.path == "/api/user/settings":
                self._send_json(200, {"settings": get_user_settings(user["id"])})
                return

            if parsed.path == "/api/user/transcript":
                self._handle_user_transcript_get(parsed, user)
                return

            self._send_json(404, {"error": "Not found."})
            return

        if parsed.path == "/":
            self.path = "/static/index.html"

        super().do_GET()

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/auth/signup":
            self._handle_auth_signup()
            return

        if parsed.path == "/api/auth/login":
            self._handle_auth_login()
            return

        if parsed.path == "/api/auth/logout":
            self._handle_auth_logout()
            return

        if parsed.path.startswith("/api/"):
            user = self._require_user()
            if not user:
                return

            if parsed.path == "/api/openai-key":
                self._handle_openai_key(user)
                return

            if parsed.path == "/api/user/settings":
                self._handle_user_settings_post(user)
                return

            if parsed.path == "/api/user/transcript":
                self._handle_user_transcript_post(user)
                return

            self._send_json(404, {"error": "Not found."})
            return

        self._send_json(404, {"error": "Not found."})

    def _read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length") or "0")
        if length <= 0:
            return {}
        if length > 250_000:
            raise ValueError("Request body is too large.")
        body = self.rfile.read(length).decode("utf-8")
        payload = json.loads(body)
        if not isinstance(payload, dict):
            raise ValueError("Expected a JSON object.")
        return payload

    def _handle_auth_status(self) -> None:
        user = self._current_user()
        self._send_json(
            200,
            {
                "authenticated": bool(user),
                "user": user,
            },
        )

    def _auth_response(self, user: dict, token: str) -> None:
        self._send_json(
            200,
            {
                "authenticated": True,
                "user": user,
                "settings": get_user_settings(user["id"]),
            },
            headers=[("Set-Cookie", self._session_cookie(token))],
        )

    def _handle_auth_signup(self) -> None:
        try:
            payload = self._read_json_body()
            user = create_user(
                str(payload.get("email") or ""),
                str(payload.get("password") or ""),
                str(payload.get("displayName") or ""),
            )
            token = create_session(user["id"], self.headers.get("User-Agent"))
            self._auth_response(user, token)
        except ValueError as error:
            self._send_json(400, {"error": str(error)})
        except Exception as error:
            self._send_json(500, {"error": str(error)})

    def _handle_auth_login(self) -> None:
        try:
            payload = self._read_json_body()
            user = authenticate_user(str(payload.get("email") or ""), str(payload.get("password") or ""))
            token = create_session(user["id"], self.headers.get("User-Agent"))
            self._auth_response(user, token)
        except ValueError as error:
            self._send_json(401, {"error": str(error)})
        except Exception as error:
            self._send_json(500, {"error": str(error)})

    def _handle_auth_logout(self) -> None:
        delete_session(self._cookie_value(SESSION_COOKIE))
        self._send_json(
            200,
            {"authenticated": False},
            headers=[("Set-Cookie", self._clear_session_cookie())],
        )

    def _handle_user_settings_post(self, user: dict) -> None:
        try:
            settings = update_user_settings(user["id"], self._read_json_body())
            self._send_json(200, {"settings": settings})
        except ValueError as error:
            self._send_json(400, {"error": str(error)})
        except Exception as error:
            self._send_json(500, {"error": str(error)})

    def _handle_user_transcript_get(self, parsed: urllib.parse.ParseResult, user: dict) -> None:
        query = urllib.parse.parse_qs(parsed.query)
        try:
            symbol = _clean_symbol(query.get("symbol", [""])[0])
            self._send_json(
                200,
                {
                    "symbol": symbol,
                    "transcript": get_user_transcript(user["id"], symbol),
                },
            )
        except ValueError as error:
            self._send_json(400, {"error": str(error)})
        except Exception as error:
            self._send_json(500, {"error": str(error)})

    def _handle_user_transcript_post(self, user: dict) -> None:
        try:
            payload = self._read_json_body()
            symbol = _clean_symbol(str(payload.get("symbol") or ""))
            content = str(payload.get("transcript") or "")
            save_user_transcript(user["id"], symbol, content)
            self._send_json(200, {"symbol": symbol, "saved": True})
        except ValueError as error:
            self._send_json(400, {"error": str(error)})
        except Exception as error:
            self._send_json(500, {"error": str(error)})

    def _handle_history(self, parsed: urllib.parse.ParseResult) -> None:
        query = urllib.parse.parse_qs(parsed.query)
        try:
            symbol = _clean_symbol(query.get("symbol", [""])[0])
            range_name = query.get("range", ["1y"])[0]
            interval = query.get("interval", ["1d"])[0]
            if range_name not in VALID_RANGES:
                raise ValueError("Unsupported range.")
            if interval not in VALID_INTERVALS:
                raise ValueError("Unsupported interval.")

            self._send_json(200, fetch_history(symbol, range_name, interval))
        except ValueError as error:
            self._send_json(400, {"error": str(error)})
        except Exception as error:
            self._send_json(
                502,
                {
                    "error": str(error),
                    "hint": "Check the symbol and your internet connection.",
                },
            )

    def _handle_research(self, parsed: urllib.parse.ParseResult) -> None:
        query = urllib.parse.parse_qs(parsed.query)
        try:
            symbol = _clean_symbol(query.get("symbol", [""])[0])
            self._send_json(200, fetch_research(symbol))
        except ValueError as error:
            self._send_json(400, {"error": str(error)})
        except Exception as error:
            self._send_json(
                502,
                {
                    "error": str(error),
                    "hint": "Some research signals may require an internet connection.",
                },
            )

    def _handle_news_analysis(self, parsed: urllib.parse.ParseResult, user: dict) -> None:
        query = urllib.parse.parse_qs(parsed.query)
        try:
            symbol = _clean_symbol(query.get("symbol", [""])[0])
            self._send_json(200, fetch_ai_news_analysis(symbol, user["id"]))
        except ValueError as error:
            self._send_json(400, {"error": str(error)})
        except Exception as error:
            self._send_json(
                502,
                {
                    "error": str(error),
                    "hint": "AI news analysis requires internet access and optionally OPENAI_API_KEY.",
                },
            )

    def _handle_openai_key(self, user: dict) -> None:
        try:
            payload = self._read_json_body()
            action = payload.get("action", "save")
            if action == "clear":
                self._send_json(200, clear_openai_api_key(user["id"]))
                return
            self._send_json(200, save_openai_api_key(str(payload.get("apiKey") or ""), user["id"]))
        except ValueError as error:
            self._send_json(400, {"error": str(error)})
        except Exception as error:
            self._send_json(500, {"error": str(error)})


def main() -> None:
    init_db()
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))
    server, actual_port = create_server(host, port)
    if port <= 0:
        print(f"Using auto-selected port {actual_port}.", flush=True)
    elif actual_port != port:
        print(f"Port {port} is busy, using {actual_port} instead.", flush=True)

    port_file = os.environ.get("STOCKLENS_PORT_FILE")
    if port_file:
        Path(port_file).write_text(str(actual_port), encoding="utf-8")

    print(f"StockLens is running at http://{host}:{actual_port}", flush=True)
    print("Press Ctrl+C to stop.", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
