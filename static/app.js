const state = {
  user: null,
  userSettings: {},
  searchHistory: [],
  symbol: "NVDA",
  range: "1y",
  data: null,
  analysis: null,
  research: null,
  researchError: null,
  aiNewsAnalysis: null,
  aiNewsError: null,
  overallContext: null,
  tradePlan: null,
  searchHistoryOpen: false,
};

const els = {
  authShell: document.querySelector("#authShell"),
  appShell: document.querySelector("#appShell"),
  authForm: document.querySelector("#authForm"),
  authTitle: document.querySelector("#authTitle"),
  authCopy: document.querySelector("#authCopy"),
  authEmail: document.querySelector("#authEmail"),
  authDisplayName: document.querySelector("#authDisplayName"),
  authPassword: document.querySelector("#authPassword"),
  displayNameWrap: document.querySelector("#displayNameWrap"),
  authSubmit: document.querySelector("#authSubmit"),
  authStatus: document.querySelector("#authStatus"),
  authSwitch: document.querySelector("#authSwitch"),
  userBadge: document.querySelector("#userBadge"),
  logoutButton: document.querySelector("#logoutButton"),
  form: document.querySelector("#searchForm"),
  input: document.querySelector("#symbolInput"),
  searchHistory: document.querySelector("#searchHistory"),
  rangeControls: document.querySelector("#rangeControls"),
  statusText: document.querySelector("#statusText"),
  sourceText: document.querySelector("#sourceText"),
  chart: document.querySelector("#priceChart"),
  tooltip: document.querySelector("#tooltip"),
  lastPrice: document.querySelector("#lastPrice"),
  lastDate: document.querySelector("#lastDate"),
  dayMove: document.querySelector("#dayMove"),
  dayMoveAbs: document.querySelector("#dayMoveAbs"),
  rangeReturn: document.querySelector("#rangeReturn"),
  rangeDates: document.querySelector("#rangeDates"),
  trendLabel: document.querySelector("#trendLabel"),
  trendScore: document.querySelector("#trendScore"),
  chartTitle: document.querySelector("#chartTitle"),
  chartSubtitle: document.querySelector("#chartSubtitle"),
  outlookText: document.querySelector("#outlookText"),
  expectedBand: document.querySelector("#expectedBand"),
  supportLevel: document.querySelector("#supportLevel"),
  resistanceLevel: document.querySelector("#resistanceLevel"),
  signalList: document.querySelector("#signalList"),
  rsiValue: document.querySelector("#rsiValue"),
  macdValue: document.querySelector("#macdValue"),
  atrValue: document.querySelector("#atrValue"),
  volumeTrend: document.querySelector("#volumeTrend"),
  volatilityValue: document.querySelector("#volatilityValue"),
  drawdownValue: document.querySelector("#drawdownValue"),
  weekRange: document.querySelector("#weekRange"),
  bullishProbability: document.querySelector("#bullishProbability"),
  expectedReturn: document.querySelector("#expectedReturn"),
  riskLevel: document.querySelector("#riskLevel"),
  fundamentalScore: document.querySelector("#fundamentalScore"),
  fundamentalScoreNote: document.querySelector("#fundamentalScoreNote"),
  sentimentScore: document.querySelector("#sentimentScore"),
  sentimentScoreNote: document.querySelector("#sentimentScoreNote"),
  macroScore: document.querySelector("#macroScore"),
  macroScoreNote: document.querySelector("#macroScoreNote"),
  optionsScore: document.querySelector("#optionsScore"),
  optionsScoreNote: document.querySelector("#optionsScoreNote"),
  relativeStrengthScore: document.querySelector("#relativeStrengthScore"),
  relativeStrengthScoreNote: document.querySelector("#relativeStrengthScoreNote"),
  revisionScore: document.querySelector("#revisionScore"),
  revisionScoreNote: document.querySelector("#revisionScoreNote"),
  flowScore: document.querySelector("#flowScore"),
  flowScoreNote: document.querySelector("#flowScoreNote"),
  totalScore: document.querySelector("#totalScore"),
  totalScoreNote: document.querySelector("#totalScoreNote"),
  callSentimentLabel: document.querySelector("#callSentimentLabel"),
  transcriptInput: document.querySelector("#transcriptInput"),
  ceoCallScore: document.querySelector("#ceoCallScore"),
  cfoCallScore: document.querySelector("#cfoCallScore"),
  qaCallScore: document.querySelector("#qaCallScore"),
  keywordCoverageScore: document.querySelector("#keywordCoverageScore"),
  callKeywordGrid: document.querySelector("#callKeywordGrid"),
  institutionalFocus: document.querySelector("#institutionalFocus"),
  sentimentDetails: document.querySelector("#sentimentDetails"),
  qualityLabel: document.querySelector("#qualityLabel"),
  roicValue: document.querySelector("#roicValue"),
  fcfGrowthValue: document.querySelector("#fcfGrowthValue"),
  freeCashFlowValue: document.querySelector("#freeCashFlowValue"),
  fcfCagrValue: document.querySelector("#fcfCagrValue"),
  optionsLabel: document.querySelector("#optionsLabel"),
  putCallOi: document.querySelector("#putCallOi"),
  putCallVolume: document.querySelector("#putCallVolume"),
  atmIv: document.querySelector("#atmIv"),
  gammaProxy: document.querySelector("#gammaProxy"),
  optionsMove: document.querySelector("#optionsMove"),
  volumeFlowLabel: document.querySelector("#volumeFlowLabel"),
  stockVolumeValue: document.querySelector("#stockVolumeValue"),
  avgVolumeValue: document.querySelector("#avgVolumeValue"),
  stockVolumeRatio: document.querySelector("#stockVolumeRatio"),
  dollarVolumeValue: document.querySelector("#dollarVolumeValue"),
  totalOptionVolume: document.querySelector("#totalOptionVolume"),
  optionStockVolumeRatio: document.querySelector("#optionStockVolumeRatio"),
  callPutVolumeValue: document.querySelector("#callPutVolumeValue"),
  volumeFlowDetails: document.querySelector("#volumeFlowDetails"),
  multiFactorLabel: document.querySelector("#multiFactorLabel"),
  factorFormula: document.querySelector("#factorFormula"),
  factorMomentum: document.querySelector("#factorMomentum"),
  factorValue: document.querySelector("#factorValue"),
  factorQuality: document.querySelector("#factorQuality"),
  factorVolatility: document.querySelector("#factorVolatility"),
  factorSize: document.querySelector("#factorSize"),
  factorVolume: document.querySelector("#factorVolume"),
  factorDetails: document.querySelector("#factorDetails"),
  scenarioForecastLabel: document.querySelector("#scenarioForecastLabel"),
  baseCaseReturn: document.querySelector("#baseCaseReturn"),
  bullCaseReturn: document.querySelector("#bullCaseReturn"),
  bearCaseReturn: document.querySelector("#bearCaseReturn"),
  forecastConfidence: document.querySelector("#forecastConfidence"),
  scenarioBreakpoint: document.querySelector("#scenarioBreakpoint"),
  scenarioDetails: document.querySelector("#scenarioDetails"),
  tradeBiasLabel: document.querySelector("#tradeBiasLabel"),
  buyZone: document.querySelector("#buyZone"),
  buyPointDate: document.querySelector("#buyPointDate"),
  addTrigger: document.querySelector("#addTrigger"),
  trimZone: document.querySelector("#trimZone"),
  sellPointDate: document.querySelector("#sellPointDate"),
  riskStop: document.querySelector("#riskStop"),
  signalUpdatedAt: document.querySelector("#signalUpdatedAt"),
  tradePlanDetails: document.querySelector("#tradePlanDetails"),
  moveReasonList: document.querySelector("#moveReasonList"),
  alertEmail: document.querySelector("#alertEmail"),
  emailAlertButton: document.querySelector("#emailAlertButton"),
  refreshButton: document.querySelector("#refreshButton"),
  autoEmailToggle: document.querySelector("#autoEmailToggle"),
  alertStatus: document.querySelector("#alertStatus"),
  alphaLabel: document.querySelector("#alphaLabel"),
  rs6mValue: document.querySelector("#rs6mValue"),
  rs12mValue: document.querySelector("#rs12mValue"),
  epsRevisionValue: document.querySelector("#epsRevisionValue"),
  institutionalBuyingValue: document.querySelector("#institutionalBuyingValue"),
  alphaDetails: document.querySelector("#alphaDetails"),
  newsToneLabel: document.querySelector("#newsToneLabel"),
  latestNewsDate: document.querySelector("#latestNewsDate"),
  newsDriverLabel: document.querySelector("#newsDriverLabel"),
  newsInsightList: document.querySelector("#newsInsightList"),
  googleNewsLink: document.querySelector("#googleNewsLink"),
  aiNewsLabel: document.querySelector("#aiNewsLabel"),
  aiNewsImpact: document.querySelector("#aiNewsImpact"),
  aiNewsConfidence: document.querySelector("#aiNewsConfidence"),
  aiNewsModel: document.querySelector("#aiNewsModel"),
  aiNewsSnapshot: document.querySelector("#aiNewsSnapshot"),
  aiNewsSummary: document.querySelector("#aiNewsSummary"),
  aiNewsWhy: document.querySelector("#aiNewsWhy"),
  aiNewsCatalysts: document.querySelector("#aiNewsCatalysts"),
  aiNewsRisks: document.querySelector("#aiNewsRisks"),
  aiNewsHorizons: document.querySelector("#aiNewsHorizons"),
  aiNewsSources: document.querySelector("#aiNewsSources"),
  openaiKeyInput: document.querySelector("#openaiKeyInput"),
  openaiKeySave: document.querySelector("#openaiKeySave"),
  openaiKeyClear: document.querySelector("#openaiKeyClear"),
  openaiKeyStatus: document.querySelector("#openaiKeyStatus"),
};

const ranges = {
  "1mo": "1 month",
  "3mo": "3 months",
  "6mo": "6 months",
  "1y": "1 year",
  "2y": "2 years",
  "5y": "5 years",
};

const SEARCH_HISTORY_KEY = "stocklens-search-history";
const SEARCH_HISTORY_LIMIT = 10;
let authMode = "login";
let transcriptSaveTimer = null;

const positiveWords = new Set([
  "accelerate",
  "accelerated",
  "beat",
  "beats",
  "confident",
  "demand",
  "durable",
  "expand",
  "expanding",
  "growth",
  "improve",
  "improved",
  "margin",
  "momentum",
  "opportunity",
  "outperform",
  "record",
  "resilient",
  "strong",
  "upside",
]);

const negativeWords = new Set([
  "cautious",
  "challenge",
  "challenging",
  "decline",
  "declined",
  "delay",
  "downside",
  "headwind",
  "miss",
  "missed",
  "pressure",
  "risk",
  "slow",
  "slowing",
  "soft",
  "uncertain",
  "weak",
  "weakness",
]);

const uncertaintyWords = new Set([
  "maybe",
  "uncertain",
  "volatility",
  "depends",
  "could",
  "may",
  "risk",
  "headwind",
]);

const institutionalTopics = [
  {
    key: "ai",
    label: "AI",
    terms: ["ai", "artificial intelligence", "accelerated computing", "gpu", "inference", "training", "blackwell", "cuda"],
  },
  {
    key: "demand",
    label: "Demand",
    terms: ["demand", "orders", "backlog", "pipeline", "booking", "bookings", "customer", "customers", "adoption"],
  },
  {
    key: "margin",
    label: "Margin",
    terms: ["margin", "margins", "gross margin", "operating margin", "profitability", "pricing", "mix"],
  },
  {
    key: "capacity",
    label: "Capacity",
    terms: ["capacity", "supply", "constraint", "constraints", "inventory", "lead time", "shipment", "shipments"],
  },
  {
    key: "guidance",
    label: "Guidance",
    terms: ["guidance", "outlook", "forecast", "expect", "expects", "expected", "raise", "raised", "lower", "lowered"],
  },
];

const speakerHints = {
  ceo: ["ceo", "chief executive", "founder", "president and chief executive"],
  cfo: ["cfo", "chief financial", "finance chief"],
  qa: ["question-and-answer", "question and answer", "q&a", "analyst", "operator"],
};

function formatMoney(value, currency = "USD") {
  if (!Number.isFinite(value)) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatCompact(value) {
  if (!Number.isFinite(value)) return "--";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatLargeMoney(value, currency = "USD") {
  if (!Number.isFinite(value)) return "--";
  const compact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
  return `${currency || "USD"} ${compact}`;
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return "--";
  return value.toFixed(digits);
}

function formatPercent(value, digits = 2) {
  if (!Number.isFinite(value)) return "--";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

function formatPlainPercent(value, digits = 1) {
  if (!Number.isFinite(value)) return "--";
  return `${value.toFixed(digits)}%`;
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp * 1000));
}

function formatShortDate(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp * 1000));
}

function formatLocalDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatNewsSnapshot(payload) {
  if (!payload) return "Latest news snapshot: --";
  const items = payload.news || [];
  const latest = items
    .map((item) => item.published)
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0];
  const parts = [
    `${items.length} headline${items.length === 1 ? "" : "s"}`,
    payload.newsSource || "news source unknown",
  ];
  if (Number.isFinite(latest)) {
    parts.push(`newest ${formatDate(latest)}`);
  }
  if (Number.isFinite(payload.newsFetchedAt)) {
    parts.push(`fetched ${formatLocalDateTime(new Date(payload.newsFetchedAt * 1000))}`);
  }
  return `Latest news snapshot: ${parts.join(" • ")}`;
}

function daysSinceTimestamp(timestamp, now = Date.now()) {
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, Math.floor((now - timestamp * 1000) / 86_400_000));
}

function normalizeSymbol(value) {
  return (value || "").trim().toUpperCase();
}

async function fetchJson(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && state.user) {
      showSignedOut(payload.error || "Session expired. Please log in again.");
    }
    throw new Error(payload.error || "Request failed.");
  }
  return payload;
}

function legacySearchHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .map((symbol) => normalizeSymbol(symbol))
      .filter((symbol, index, list) => symbol && list.indexOf(symbol) === index)
      .slice(0, SEARCH_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

function getSearchHistory() {
  return state.searchHistory
    .map((symbol) => normalizeSymbol(symbol))
    .filter((symbol, index, list) => symbol && list.indexOf(symbol) === index)
    .slice(0, SEARCH_HISTORY_LIMIT);
}

function saveSearchHistory(symbol) {
  const cleanSymbol = normalizeSymbol(symbol);
  if (!cleanSymbol) return;
  const history = [cleanSymbol, ...getSearchHistory().filter((item) => item !== cleanSymbol)]
    .slice(0, SEARCH_HISTORY_LIMIT);
  state.searchHistory = history;
  saveUserSettings({
    searchHistory: history,
    symbol: cleanSymbol,
    range: state.range,
  });
  renderSearchHistory();
}

function matchingSearchHistory() {
  const query = normalizeSymbol(els.input.value);
  return getSearchHistory()
    .filter((symbol) => !query || symbol.includes(query))
    .slice(0, SEARCH_HISTORY_LIMIT);
}

function hideSearchHistory() {
  state.searchHistoryOpen = false;
  els.searchHistory.hidden = true;
  els.input.setAttribute("aria-expanded", "false");
}

function renderSearchHistory() {
  if (!els.searchHistory) return;
  const history = matchingSearchHistory();
  els.searchHistory.replaceChildren(
    ...history.map((symbol, index) => {
      const button = document.createElement("button");
      const label = document.createElement("span");
      const meta = document.createElement("small");
      button.type = "button";
      button.className = "history-item";
      button.dataset.symbol = symbol;
      button.setAttribute("role", "option");
      label.textContent = symbol;
      meta.textContent = index === 0 ? "latest" : "history";
      button.append(label, meta);
      return button;
    }),
  );
  const shouldShow = state.searchHistoryOpen && history.length > 0;
  els.searchHistory.hidden = !shouldShow;
  els.input.setAttribute("aria-expanded", shouldShow ? "true" : "false");
}

function setAuthMode(mode) {
  authMode = mode;
  const signingUp = authMode === "signup";
  els.authTitle.textContent = signingUp ? "Create your StockLens account" : "Log in to your workspace";
  els.authCopy.textContent = signingUp
    ? "Create an account to keep your saved tickers, transcripts, alert settings, and AI configuration separate."
    : "Your watch history, transcripts, settings, and AI keys stay separated by account.";
  els.authSubmit.textContent = signingUp ? "Create account" : "Log in";
  els.authSwitch.textContent = signingUp ? "Already have an account? Log in" : "Create an account";
  els.displayNameWrap.hidden = !signingUp;
  els.authPassword.autocomplete = signingUp ? "new-password" : "current-password";
  setAuthStatus("");
}

function setAuthStatus(message, tone = "neutral") {
  els.authStatus.textContent = message;
  els.authStatus.classList.remove("positive", "negative", "neutral");
  els.authStatus.classList.add(tone);
}

function applyUserSettings(settings = {}) {
  state.userSettings = settings;
  const legacySymbol = normalizeSymbol(localStorage.getItem("stocklens-symbol"));
  const legacyRange = localStorage.getItem("stocklens-range");
  const legacyHistory = legacySearchHistory();
  state.symbol = normalizeSymbol(settings.symbol) || legacySymbol || "NVDA";
  state.range = ranges[settings.range] ? settings.range : ranges[legacyRange] ? legacyRange : "1y";
  state.searchHistory = Array.isArray(settings.searchHistory) && settings.searchHistory.length
    ? settings.searchHistory
    : legacyHistory;
  els.alertEmail.value = settings.alertEmail || "";
  els.autoEmailToggle.checked = Boolean(settings.autoEmailDraft);
  els.input.value = state.symbol;
  syncRangeButtons();
  renderSearchHistory();
}

async function saveUserSettings(patch) {
  if (!state.user) return;
  state.userSettings = { ...state.userSettings, ...patch };
  try {
    const payload = await fetchJson("/api/user/settings", {
      method: "POST",
      body: JSON.stringify(patch),
    });
    state.userSettings = payload.settings || state.userSettings;
  } catch (error) {
    setStatus(error.message);
  }
}

function showSignedOut(message = "") {
  state.user = null;
  els.appShell.hidden = true;
  els.authShell.hidden = false;
  if (message) setAuthStatus(message, "negative");
}

async function startUserWorkspace(user, settings) {
  state.user = user;
  els.userBadge.textContent = user.email;
  els.authShell.hidden = true;
  els.appShell.hidden = false;
  applyUserSettings(settings);
  await refreshOpenAiKeyStatus();
  await loadStock();
}

async function refreshAuthStatus() {
  setAuthStatus("Checking session...");
  try {
    const response = await fetch("/api/auth/status", { credentials: "same-origin" });
    const payload = await response.json();
    if (payload.authenticated && payload.user) {
      const settingsPayload = await fetchJson("/api/user/settings");
      await startUserWorkspace(payload.user, settingsPayload.settings || {});
      return;
    }
    showSignedOut();
    setAuthStatus("");
  } catch (error) {
    showSignedOut(error.message);
  }
}

async function submitAuth(event) {
  event.preventDefault();
  setAuthStatus(authMode === "signup" ? "Creating account..." : "Logging in...");
  const payload = {
    email: els.authEmail.value.trim(),
    password: els.authPassword.value,
  };
  if (authMode === "signup") {
    payload.displayName = els.authDisplayName.value.trim();
  }
  try {
    const result = await fetchJson(`/api/auth/${authMode}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    els.authPassword.value = "";
    setAuthStatus("Authenticated.", "positive");
    await startUserWorkspace(result.user, result.settings || {});
  } catch (error) {
    setAuthStatus(error.message, "negative");
  }
}

async function logout() {
  try {
    await fetchJson("/api/auth/logout", { method: "POST", body: "{}" });
  } catch {
    // The local UI should still return to the login screen if logout cleanup fails.
  }
  showSignedOut("Logged out.");
}

function userScopedKey(key) {
  return `stocklens-user-${state.user?.id || "anonymous"}-${key}`;
}

function classFor(value) {
  if (value > 0.05) return "positive";
  if (value < -0.05) return "negative";
  return "neutral";
}

function setTone(element, value) {
  element.classList.remove("positive", "negative", "neutral");
  element.classList.add(classFor(value));
}

function toneForScore(score) {
  if (!Number.isFinite(score)) return "neutral";
  if (score >= 65) return "positive";
  if (score <= 45) return "negative";
  return "neutral";
}

function setScore(element, score) {
  element.textContent = Number.isFinite(score) ? Math.round(score).toString() : "--";
  element.classList.remove("positive", "negative", "neutral");
  element.classList.add(toneForScore(score));
}

function scoreLabel(score, positive = "Bullish", neutral = "Neutral", negative = "Bearish") {
  if (!Number.isFinite(score)) return "--";
  if (score >= 70) return `${positive} ${Math.round(score)}`;
  if (score <= 40) return `${negative} ${Math.round(score)}`;
  return `${neutral} ${Math.round(score)}`;
}

function qualityLabel(score) {
  if (!Number.isFinite(score)) return "--";
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 45) return "Mixed";
  return "Weak";
}

function clamp(value, lower, upper) {
  return Math.max(lower, Math.min(upper, value));
}

function formatGex(value) {
  if (!Number.isFinite(value)) return "--";
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value / 1_000_000_000).toFixed(1)}B`;
}

function movingAverage(values, period) {
  const out = Array(values.length).fill(null);
  let sum = 0;
  for (let index = 0; index < values.length; index += 1) {
    sum += values[index];
    if (index >= period) sum -= values[index - period];
    if (index >= period - 1) out[index] = sum / period;
  }
  return out;
}

function exponentialMovingAverage(values, period) {
  const out = Array(values.length).fill(null);
  const alpha = 2 / (period + 1);
  let seedSum = 0;
  let count = 0;
  let ema = null;

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!Number.isFinite(value)) continue;

    count += 1;
    if (count <= period) {
      seedSum += value;
      if (count === period) {
        ema = seedSum / period;
        out[index] = ema;
      }
      continue;
    }

    ema = value * alpha + ema * (1 - alpha);
    out[index] = ema;
  }

  return out;
}

function bollingerBands(values, period = 20, multiplier = 2) {
  const middle = movingAverage(values, period);
  const upper = Array(values.length).fill(null);
  const lower = Array(values.length).fill(null);

  for (let index = period - 1; index < values.length; index += 1) {
    const window = values.slice(index - period + 1, index + 1).filter(Number.isFinite);
    if (window.length !== period || !Number.isFinite(middle[index])) continue;
    const deviation = standardDeviation(window);
    upper[index] = middle[index] + deviation * multiplier;
    lower[index] = middle[index] - deviation * multiplier;
  }

  return { middle, upper, lower };
}

function averageTrueRange(points, period = 14) {
  const ranges = points.map((point, index) => {
    if (index === 0) return (point.high || point.close) - (point.low || point.close);
    const previousClose = points[index - 1].close;
    const high = point.high || point.close;
    const low = point.low || point.close;
    return Math.max(high - low, Math.abs(high - previousClose), Math.abs(low - previousClose));
  });
  return exponentialMovingAverage(ranges, period);
}

function macd(values) {
  const ema12 = exponentialMovingAverage(values, 12);
  const ema26 = exponentialMovingAverage(values, 26);
  const line = values.map((_, index) =>
    Number.isFinite(ema12[index]) && Number.isFinite(ema26[index]) ? ema12[index] - ema26[index] : null,
  );
  const signal = exponentialMovingAverage(line, 9);
  const histogram = line.map((value, index) =>
    Number.isFinite(value) && Number.isFinite(signal[index]) ? value - signal[index] : null,
  );
  return { line, signal, histogram };
}

function rsi(values, period = 14) {
  if (values.length <= period) return null;
  let gain = 0;
  let loss = 0;

  for (let index = 1; index <= period; index += 1) {
    const change = values[index] - values[index - 1];
    if (change >= 0) gain += change;
    else loss -= change;
  }

  let avgGain = gain / period;
  let avgLoss = loss / period;

  for (let index = period + 1; index < values.length; index += 1) {
    const change = values[index] - values[index - 1];
    avgGain = (avgGain * (period - 1) + Math.max(change, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-change, 0)) / period;
  }

  if (avgLoss === 0) return 100;
  const relativeStrength = avgGain / avgLoss;
  return 100 - 100 / (1 + relativeStrength);
}

function standardDeviation(values) {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function maxDrawdown(values) {
  let peak = values[0];
  let worst = 0;
  for (const value of values) {
    peak = Math.max(peak, value);
    worst = Math.min(worst, value / peak - 1);
  }
  return worst * 100;
}

function lastNonNull(values) {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (Number.isFinite(values[index])) return values[index];
  }
  return null;
}

function previousNonNull(values) {
  let seenLatest = false;
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (!Number.isFinite(values[index])) continue;
    if (seenLatest) return values[index];
    seenLatest = true;
  }
  return null;
}

function sliceLast(values, count) {
  return values.slice(Math.max(0, values.length - count));
}

function scoreText(text) {
  const tokens = (text || "").toLowerCase().match(/[a-z][a-z'-]+/g) || [];
  if (!tokens.length) {
    return { score: 50, positive: 0, negative: 0, uncertainty: 0, tokens: 0 };
  }

  let positive = 0;
  let negative = 0;
  let uncertainty = 0;
  for (const token of tokens) {
    if (positiveWords.has(token)) positive += 1;
    if (negativeWords.has(token)) negative += 1;
    if (uncertaintyWords.has(token)) uncertainty += 1;
  }

  const denominator = Math.sqrt(tokens.length / 20 + 1);
  const rawScore = 50 + ((positive - negative) * 8) / denominator - uncertainty * 0.7;
  return {
    score: clamp(rawScore, 0, 100),
    positive,
    negative,
    uncertainty,
    tokens: tokens.length,
  };
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countTerm(text, term) {
  const pattern = term.includes(" ")
    ? new RegExp(escapeRegex(term), "gi")
    : new RegExp(`\\b${escapeRegex(term)}\\b`, "gi");
  return (text.match(pattern) || []).length;
}

function keywordStats(text) {
  const lowerText = (text || "").toLowerCase();
  const tokens = lowerText.match(/[a-z][a-z'-]+/g) || [];
  const wordCount = tokens.length;
  const topics = institutionalTopics.map((topic) => {
    const count = topic.terms.reduce((sum, term) => sum + countTerm(lowerText, term), 0);
    const perThousand = wordCount ? (count / wordCount) * 1000 : 0;
    return { ...topic, count, perThousand };
  });
  const totalCount = topics.reduce((sum, topic) => sum + topic.count, 0);
  const coveredTopics = topics.filter((topic) => topic.count > 0).length;
  const score = wordCount
    ? clamp(42 + coveredTopics * 8 + Math.min(22, (totalCount / Math.max(1, wordCount)) * 1400), 0, 100)
    : 50;

  return { score, wordCount, totalCount, coveredTopics, topics };
}

function sectionForLine(line, currentSection) {
  const lower = line.toLowerCase();
  const compactLine = lower.replace(/\s+/g, " ").trim();

  if (speakerHints.qa.some((hint) => compactLine.includes(hint))) {
    return "qa";
  }
  if (speakerHints.cfo.some((hint) => compactLine.includes(hint))) {
    return "cfo";
  }
  if (speakerHints.ceo.some((hint) => compactLine.includes(hint))) {
    return "ceo";
  }
  if (/^(operator|analyst|question)\b/.test(compactLine)) {
    return "qa";
  }
  if (/^(chief financial officer|finance)\b/.test(compactLine)) {
    return "cfo";
  }
  if (/^(chief executive officer|ceo)\b/.test(compactLine)) {
    return "ceo";
  }

  return currentSection;
}

function splitCallSections(text) {
  const sections = { ceo: "", cfo: "", qa: "", other: "" };
  const lines = (text || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
  let currentSection = "other";
  let detectedSections = 0;

  for (const line of lines) {
    const nextSection = sectionForLine(line, currentSection);
    if (nextSection !== currentSection) {
      detectedSections += 1;
      currentSection = nextSection;
    }

    const headingOnly =
      line.length < 120 &&
      /(chief|ceo|cfo|question|answer|operator|analyst|prepared remarks)/i.test(line);
    if (!headingOnly) {
      sections[currentSection] += `${line} `;
    }
  }

  if (!sections.ceo && !sections.cfo && !sections.qa && text.trim()) {
    sections.other = text;
  }

  return { sections, detectedSections };
}

function analyzeCallTranscript(text) {
  const trimmed = (text || "").trim();
  const overallTextScore = scoreText(trimmed);
  const keywords = keywordStats(trimmed);
  const { sections, detectedSections } = splitCallSections(trimmed);
  const sectionScores = {
    ceo: scoreText(sections.ceo),
    cfo: scoreText(sections.cfo),
    qa: scoreText(sections.qa),
    other: scoreText(sections.other),
  };
  const sectionWeights = [];

  for (const [key, weight] of [
    ["ceo", 0.28],
    ["cfo", 0.24],
    ["qa", 0.32],
    ["other", 0.16],
  ]) {
    if (sectionScores[key].tokens > 0) {
      sectionWeights.push({ score: sectionScores[key].score, weight });
    }
  }

  const weightedSections = sectionWeights.length
    ? sectionWeights.reduce((sum, row) => sum + row.score * row.weight, 0) /
      sectionWeights.reduce((sum, row) => sum + row.weight, 0)
    : overallTextScore.score;
  const hasTranscript = overallTextScore.tokens >= 12;
  const overallScore = hasTranscript
    ? clamp(weightedSections * 0.72 + keywords.score * 0.28, 0, 100)
    : 50;

  return {
    hasTranscript,
    overallScore,
    detectedSections,
    sections,
    sectionScores,
    keywords,
    wordCount: overallTextScore.tokens,
    uncertainty: overallTextScore.uncertainty,
  };
}

function newsText(research) {
  return (research?.news?.items || [])
    .map((item) => `${item.title || ""} ${item.publisher || ""}`)
    .join(" ");
}

function currentTranscriptKey() {
  return `stocklens-transcript-${state.symbol}`;
}

async function loadTranscriptForSymbol() {
  els.transcriptInput.value = "";
  if (!state.user) return;
  try {
    const payload = await fetchJson(`/api/user/transcript?symbol=${encodeURIComponent(state.symbol)}`);
    els.transcriptInput.value = payload.transcript || "";
  } catch (error) {
    els.transcriptInput.value = localStorage.getItem(currentTranscriptKey()) || "";
  }
}

async function saveTranscriptForSymbol() {
  if (!state.user) return;
  const transcript = els.transcriptInput.value;
  localStorage.setItem(currentTranscriptKey(), transcript);
  try {
    await fetchJson("/api/user/transcript", {
      method: "POST",
      body: JSON.stringify({
        symbol: state.symbol,
        transcript,
      }),
    });
  } catch (error) {
    setStatus(error.message);
  }
}

function queueTranscriptSave() {
  window.clearTimeout(transcriptSaveTimer);
  transcriptSaveTimer = window.setTimeout(() => {
    saveTranscriptForSymbol();
  }, 500);
}

function calculateSentiment(research) {
  const transcript = els.transcriptInput.value.trim();
  const callNlp = analyzeCallTranscript(transcript);
  const newsScore = scoreText(newsText(research));
  const hasTranscript = callNlp.hasTranscript;
  const hasNews = (research?.news?.items || []).length > 0;

  let score = 50;
  if (hasTranscript && hasNews) score = callNlp.overallScore * 0.82 + newsScore.score * 0.18;
  else if (hasTranscript) score = callNlp.overallScore;
  else if (hasNews) score = newsScore.score;

  return {
    score,
    hasTranscript,
    hasNews,
    transcriptScore: { ...callNlp.sectionScores.other, score: callNlp.overallScore },
    callNlp,
    newsScore,
    headlineCount: (research?.news?.items || []).length,
  };
}

function sortedNewsItems(research) {
  return [...(research?.news?.items || [])]
    .filter((item) => item?.title)
    .sort((a, b) => (b.published || 0) - (a.published || 0));
}

function analyzeNews(research, analysis) {
  const items = sortedNewsItems(research);
  const latest = items[0] || null;
  const newsTextScore = scoreText(items.map((item) => item.title || "").join(" "));
  const direction = newsTextScore.score >= 60 ? "Positive" : newsTextScore.score <= 45 ? "Negative" : "Mixed";
  const newsTone =
    newsTextScore.score >= 60 ? "good" : newsTextScore.score <= 45 ? "bad" : "watch";
  const recentItems = items.slice(0, 5).map((item) => {
    const titleScore = scoreText(item.title || "");
    const tone = titleScore.score >= 60 ? "good" : titleScore.score <= 45 ? "bad" : "watch";
    const age = Number.isFinite(item.published) ? `${daysSinceTimestamp(item.published)}D ago` : "date unknown";
    return {
      tone,
      text: `${item.publisher || "News"} - ${Number.isFinite(item.published) ? formatShortDate(item.published) : "undated"} (${age}): ${item.title}`,
    };
  });

  const latestAge = latest?.published ? daysSinceTimestamp(latest.published) : null;
  const driverText =
    latest && analysis
      ? `${direction} news tone; latest headline is ${latestAge === 0 ? "today" : latestAge === 1 ? "1 day old" : `${latestAge} days old`}.`
      : "No live headline loaded.";

  return {
    available: items.length > 0,
    score: newsTextScore.score,
    direction,
    tone: newsTone,
    latest,
    latestAge,
    driverText,
    items: recentItems,
  };
}

function analyze(data) {
  const points = data.points;
  const closes = points.map((point) => point.close);
  const last = points.at(-1);
  const previous = points.at(-2);
  const first = points[0];
  const ma20 = movingAverage(closes, 20);
  const ma50 = movingAverage(closes, 50);
  const ma200 = movingAverage(closes, 200);
  const ema21 = exponentialMovingAverage(closes, 21);
  const bb20 = bollingerBands(closes, 20, 2);
  const atr14 = averageTrueRange(points, 14);
  const macdSeries = macd(closes);
  const currentMa20 = lastNonNull(ma20);
  const currentMa50 = lastNonNull(ma50);
  const currentMa200 = lastNonNull(ma200);
  const currentEma21 = lastNonNull(ema21);
  const currentBbUpper = lastNonNull(bb20.upper);
  const currentBbLower = lastNonNull(bb20.lower);
  const currentAtr14 = lastNonNull(atr14);
  const currentMacd = lastNonNull(macdSeries.line);
  const currentMacdSignal = lastNonNull(macdSeries.signal);
  const currentMacdHistogram = lastNonNull(macdSeries.histogram);
  const previousMacdHistogram = previousNonNull(macdSeries.histogram);
  const dailyReturns = [];

  for (let index = 1; index < closes.length; index += 1) {
    dailyReturns.push(closes[index] / closes[index - 1] - 1);
  }

  const dayPercent = (last.close / previous.close - 1) * 100;
  const rangePercent = (last.close / first.close - 1) * 100;
  const volatility = standardDeviation(sliceLast(dailyReturns, 252)) * Math.sqrt(252) * 100;
  const rsiValue = rsi(closes);
  const drawdown = maxDrawdown(closes);
  const recent20 = sliceLast(points, 20);
  const recent50 = sliceLast(points, 50);
  const support = Math.min(...recent20.map((point) => point.low || point.close));
  const resistance = Math.max(...recent20.map((point) => point.high || point.close));
  const recent20Offset = points.length - recent20.length;
  const supportIndex =
    recent20Offset +
    recent20.reduce((bestIndex, point, index) => {
      const value = point.low || point.close;
      const bestValue = recent20[bestIndex].low || recent20[bestIndex].close;
      return value < bestValue ? index : bestIndex;
    }, 0);
  const resistanceIndex =
    recent20Offset +
    recent20.reduce((bestIndex, point, index) => {
      const value = point.high || point.close;
      const bestValue = recent20[bestIndex].high || recent20[bestIndex].close;
      return value > bestValue ? index : bestIndex;
    }, 0);
  const high52 = Math.max(...sliceLast(points, 252).map((point) => point.high || point.close));
  const low52 = Math.min(...sliceLast(points, 252).map((point) => point.low || point.close));
  const volume20 =
    recent20.reduce((sum, point) => sum + (point.volume || 0), 0) /
    Math.max(1, recent20.filter((point) => point.volume).length);
  const volumeRatio = last.volume && volume20 ? last.volume / volume20 : null;

  let score = 0;
  const signals = [];

  if (currentMa20) {
    if (last.close > currentMa20) {
      score += 1;
      signals.push({ tone: "good", text: `Price is above the 20D average at ${formatMoney(currentMa20, data.currency)}.` });
    } else {
      score -= 1;
      signals.push({ tone: "bad", text: `Price is below the 20D average at ${formatMoney(currentMa20, data.currency)}.` });
    }
  }

  if (currentMa50) {
    if (last.close > currentMa50) {
      score += 1;
      signals.push({ tone: "good", text: `Price is above the 50D average at ${formatMoney(currentMa50, data.currency)}.` });
    } else {
      score -= 1;
      signals.push({ tone: "bad", text: `Price is below the 50D average at ${formatMoney(currentMa50, data.currency)}.` });
    }
  }

  if (currentMa20 && currentMa50) {
    if (currentMa20 > currentMa50) {
      score += 1;
      signals.push({ tone: "good", text: "The 20D average is above the 50D average." });
    } else {
      score -= 1;
      signals.push({ tone: "bad", text: "The 20D average is below the 50D average." });
    }
  }

  if (currentMa200) {
    if (last.close > currentMa200) score += 1;
    else score -= 1;
  }

  if (currentEma21) {
    if (last.close > currentEma21) {
      score += 0.75;
      signals.push({ tone: "good", text: `Price is above EMA 21 at ${formatMoney(currentEma21, data.currency)}.` });
    } else {
      score -= 0.75;
      signals.push({ tone: "bad", text: `Price is below EMA 21 at ${formatMoney(currentEma21, data.currency)}.` });
    }
  }

  if (rangePercent > 5) score += 1;
  if (rangePercent < -5) score -= 1;

  if (rsiValue !== null) {
    if (rsiValue > 72) {
      score -= 0.5;
      signals.push({ tone: "watch", text: `RSI is hot at ${rsiValue.toFixed(1)}.` });
    } else if (rsiValue < 35) {
      score -= 0.5;
      signals.push({ tone: "watch", text: `RSI is weak at ${rsiValue.toFixed(1)}.` });
    } else {
      score += 0.5;
      signals.push({ tone: "good", text: `RSI is balanced at ${rsiValue.toFixed(1)}.` });
    }
  }

  if (Number.isFinite(currentMacdHistogram)) {
    const macdRising = Number.isFinite(previousMacdHistogram) && currentMacdHistogram > previousMacdHistogram;
    if (currentMacdHistogram > 0) {
      score += macdRising ? 1 : 0.5;
      signals.push({
        tone: "good",
        text: `MACD histogram is positive${macdRising ? " and rising" : ""}.`,
      });
    } else {
      score -= macdRising ? 0.25 : 0.8;
      signals.push({
        tone: currentMacdHistogram < 0 && !macdRising ? "bad" : "watch",
        text: `MACD histogram is ${macdRising ? "improving" : "negative"}.`,
      });
    }
  }

  if (currentBbUpper && currentBbLower) {
    if (last.close > currentBbUpper) {
      score -= 0.25;
      signals.push({ tone: "watch", text: "Close is above the upper Bollinger band; upside may be stretched." });
    } else if (last.close < currentBbLower) {
      score -= 0.25;
      signals.push({ tone: "watch", text: "Close is below the lower Bollinger band; wait for stabilization." });
    }
  }

  if (Number.isFinite(volumeRatio) && volumeRatio > 1.35) {
    const volumeTone = dayPercent >= 0 ? "good" : "bad";
    signals.push({
      tone: volumeTone,
      text: `Volume is ${volumeRatio.toFixed(1)}x the 20D average, confirming the ${dayPercent >= 0 ? "advance" : "selloff"}.`,
    });
  }

  if (volatility > 65) {
    score -= 0.5;
    signals.push({ tone: "watch", text: `Annualized volatility is elevated at ${volatility.toFixed(1)}%.` });
  }

  const weeklyMove = last.close * standardDeviation(sliceLast(dailyReturns, 63)) * Math.sqrt(5);
  const expectedLow = Math.max(0, last.close - weeklyMove);
  const expectedHigh = last.close + weeklyMove;
  const trend =
    score >= 3 ? "Uptrend" : score <= -2 ? "Downtrend" : score > 0 ? "Constructive" : "Mixed";

  let outlook;
  if (score >= 3) {
    outlook = `Bullish bias while ${data.symbol} holds near ${formatMoney(support, data.currency)}. A push through ${formatMoney(resistance, data.currency)} would confirm fresh momentum.`;
  } else if (score <= -2) {
    outlook = `Bearish-to-cautious bias unless ${data.symbol} reclaims ${formatMoney(resistance, data.currency)}. A break below ${formatMoney(support, data.currency)} would keep pressure on the chart.`;
  } else {
    outlook = `Neutral-to-choppy bias. The cleaner signal is a close above ${formatMoney(resistance, data.currency)} or below ${formatMoney(support, data.currency)}.`;
  }

  const moveDrivers = [
    {
      tone: dayPercent >= 0 ? "good" : "bad",
      text: `Latest candle ${dayPercent >= 0 ? "rose" : "fell"} ${formatPercent(dayPercent, 2)} because price ${last.close >= previous.close ? "closed above" : "closed below"} the prior close.`,
    },
  ];

  if (currentMa20 && currentMa50) {
    if (last.close > currentMa20 && currentMa20 > currentMa50) {
      moveDrivers.push({
        tone: "good",
        text: `Short-term trend supports upside: close > SMA 20 (${formatMoney(currentMa20, data.currency)}) and SMA 20 > SMA 50.`,
      });
    } else if (last.close < currentMa20 && currentMa20 < currentMa50) {
      moveDrivers.push({
        tone: "bad",
        text: `Downside pressure is active: close < SMA 20 (${formatMoney(currentMa20, data.currency)}) and SMA 20 < SMA 50.`,
      });
    } else {
      moveDrivers.push({
        tone: "watch",
        text: "Moving averages are mixed, so the move is more likely range-bound than clean trend.",
      });
    }
  }

  if (Number.isFinite(currentMacdHistogram)) {
    const macdRising = Number.isFinite(previousMacdHistogram) && currentMacdHistogram > previousMacdHistogram;
    moveDrivers.push({
      tone: currentMacdHistogram > 0 ? "good" : macdRising ? "watch" : "bad",
      text: `Momentum ${currentMacdHistogram > 0 ? "supports buyers" : macdRising ? "is trying to recover" : "still favors sellers"}; MACD histogram ${currentMacdHistogram.toFixed(2)}${macdRising ? " and rising" : ""}.`,
    });
  }

  if (Number.isFinite(volumeRatio)) {
    moveDrivers.push({
      tone: volumeRatio >= 1.25 ? (dayPercent >= 0 ? "good" : "bad") : "watch",
      text: volumeRatio >= 1.25
        ? `Volume was ${volumeRatio.toFixed(1)}x 20D average, so the ${dayPercent >= 0 ? "up move" : "drop"} had participation.`
        : `Volume was only ${volumeRatio.toFixed(1)}x 20D average, so confirmation is limited.`,
    });
  }

  if (rsiValue !== null) {
    moveDrivers.push({
      tone: rsiValue > 72 ? "watch" : rsiValue < 35 ? "watch" : "good",
      text: rsiValue > 72
        ? `RSI ${rsiValue.toFixed(1)} is hot; upside can continue but pullback risk is elevated.`
        : rsiValue < 35
          ? `RSI ${rsiValue.toFixed(1)} is weak; wait for buyers to reclaim momentum.`
          : `RSI ${rsiValue.toFixed(1)} is not extreme, leaving room for a cleaner trend signal.`,
    });
  }

  const distanceToSupport = ((last.close / support - 1) * 100);
  const distanceToResistance = ((resistance / last.close - 1) * 100);
  moveDrivers.push({
    tone: distanceToSupport < distanceToResistance ? "good" : "watch",
    text: `Price is ${distanceToSupport.toFixed(1)}% above support and ${distanceToResistance.toFixed(1)}% below resistance, defining the current risk/reward.`,
  });

  return {
    points,
    closes,
    ma20,
    ma50,
    ma200,
    ema21,
    bb20,
    atr14,
    macd: macdSeries,
    last,
    previous,
    first,
    dayPercent,
    dayAbs: last.close - previous.close,
    rangePercent,
    volatility,
    rsiValue,
    atrValue: currentAtr14,
    macdLine: currentMacd,
    macdSignal: currentMacdSignal,
    macdHistogram: currentMacdHistogram,
    drawdown,
    support,
    resistance,
    supportIndex,
    resistanceIndex,
    expectedLow,
    expectedHigh,
    high52,
    low52,
    volume20,
    volumeRatio,
    trend,
    score,
    signals,
    moveDrivers,
    outlook,
    recentHigh50: Math.max(...recent50.map((point) => point.high || point.close)),
    recentLow50: Math.min(...recent50.map((point) => point.low || point.close)),
  };
}

function setStatus(message, source = "") {
  els.statusText.textContent = message;
  els.sourceText.textContent = source;
}

async function loadStock() {
  const symbol = normalizeSymbol(state.symbol);
  state.symbol = symbol;
  localStorage.setItem("stocklens-symbol", symbol);
  localStorage.setItem("stocklens-range", state.range);
  saveSearchHistory(symbol);
  els.input.value = symbol;
  await loadTranscriptForSymbol();
  state.data = null;
  state.analysis = null;
  state.research = null;
  state.researchError = null;
  state.aiNewsAnalysis = null;
  state.aiNewsError = null;
  state.overallContext = null;
  state.tradePlan = null;
  setStatus(`Loading ${symbol}...`);
  renderResearch();
  renderAiNewsAnalysis();

  const researchPromise = fetch(`/api/research?symbol=${encodeURIComponent(symbol)}`).then(async (response) => {
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not load research data.");
    return payload;
  });
  const aiNewsPromise = fetch(`/api/news-analysis?symbol=${encodeURIComponent(symbol)}`).then(async (response) => {
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not load AI news analysis.");
    return payload;
  });

  try {
    const response = await fetch(
      `/api/history?symbol=${encodeURIComponent(symbol)}&range=${encodeURIComponent(state.range)}&interval=1d`,
    );
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not load market data.");
    state.data = payload;
    state.analysis = analyze(payload);
    render();
  } catch (error) {
    setStatus(error.message);
    els.sourceText.textContent = "No data loaded";
  }

  try {
    state.research = await researchPromise;
  } catch (error) {
    state.researchError = error.message;
  }
  renderResearch();

  try {
    state.aiNewsAnalysis = await aiNewsPromise;
  } catch (error) {
    state.aiNewsError = error.message;
  }
  renderAiNewsAnalysis();
}

function render() {
  const { data, analysis } = state;
  const currency = data.currency || "USD";
  const rangeName = ranges[data.range] || data.range;

  els.chartTitle.textContent = `${data.symbol} price history`;
  els.chartSubtitle.textContent = `${rangeName} candles with SMA 20, EMA 21, SMA 50, Bollinger bands, and trade levels`;
  setStatus(`${data.exchange || "Market"} - ${data.symbol}`, `Source: ${data.source}`);

  els.lastPrice.textContent = formatMoney(analysis.last.close, currency);
  els.lastDate.textContent = formatDate(analysis.last.timestamp);

  els.dayMove.textContent = formatPercent(analysis.dayPercent);
  els.dayMoveAbs.textContent = `${formatMoney(analysis.dayAbs, currency)} vs previous close`;
  setTone(els.dayMove, analysis.dayPercent);

  els.rangeReturn.textContent = formatPercent(analysis.rangePercent);
  els.rangeDates.textContent = `${formatDate(analysis.first.timestamp)} to ${formatDate(analysis.last.timestamp)}`;
  setTone(els.rangeReturn, analysis.rangePercent);

  els.trendLabel.textContent = analysis.trend;
  els.trendScore.textContent = `Signal score ${analysis.score.toFixed(1)}`;
  els.trendLabel.classList.remove("positive", "negative", "neutral");
  els.trendLabel.classList.add(analysis.score >= 3 ? "positive" : analysis.score <= -2 ? "negative" : "neutral");

  els.outlookText.textContent = analysis.outlook;
  els.expectedBand.textContent = `${formatMoney(analysis.expectedLow, currency)} - ${formatMoney(analysis.expectedHigh, currency)}`;
  els.supportLevel.textContent = formatMoney(analysis.support, currency);
  els.resistanceLevel.textContent = formatMoney(analysis.resistance, currency);
  els.rsiValue.textContent = analysis.rsiValue === null ? "--" : analysis.rsiValue.toFixed(1);
  els.macdValue.textContent = Number.isFinite(analysis.macdHistogram)
    ? `${analysis.macdHistogram >= 0 ? "+" : ""}${analysis.macdHistogram.toFixed(2)} hist`
    : "--";
  els.atrValue.textContent = Number.isFinite(analysis.atrValue)
    ? `${formatMoney(analysis.atrValue, currency)} (${formatPlainPercent((analysis.atrValue / analysis.last.close) * 100, 1)})`
    : "--";
  els.volumeTrend.textContent = Number.isFinite(analysis.volumeRatio)
    ? `${analysis.volumeRatio.toFixed(1)}x 20D`
    : "--";
  els.volatilityValue.textContent = formatPercent(analysis.volatility, 1);
  els.drawdownValue.textContent = formatPercent(analysis.drawdown, 1);
  els.weekRange.textContent = `${formatMoney(analysis.low52, currency)} - ${formatMoney(analysis.high52, currency)}`;

  els.signalList.replaceChildren(
    ...analysis.signals.slice(0, 8).map((signal) => {
      const li = document.createElement("li");
      li.className = signal.tone;
      li.textContent = signal.text;
      return li;
    }),
  );

  renderChart(data, analysis, state.tradePlan);
  renderResearch();
}

function listItems(items) {
  return items.map((item) => {
    const li = document.createElement("li");
    li.className = item.tone || "watch";
    li.textContent = item.text;
    return li;
  });
}

function toneForDirection(direction, score) {
  if (direction === "Bullish" || score >= 65) return "good";
  if (direction === "Bearish" || score <= 42) return "bad";
  return "watch";
}

function renderAiSources(payload, sourceIds) {
  const items = payload?.news || [];
  const ids = Array.isArray(sourceIds) && sourceIds.length
    ? sourceIds
    : items.slice(0, 3).map((item) => item.id);
  els.aiNewsSources.replaceChildren(
    ...ids
      .map((id) => items.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        const meta = document.createElement("small");
        meta.textContent = `${item.publisher || "News"} ${Number.isFinite(item.published) ? formatShortDate(item.published) : ""}`.trim();
        link.href = item.link || "#";
        link.target = "_blank";
        link.rel = "noopener";
        link.append(meta, item.title || "Untitled headline");
        li.append(link);
        return li;
      }),
  );
}

function renderOpenAiKeyStatus(status) {
  if (!els.openaiKeyStatus) return;
  if (!status) {
    els.openaiKeyStatus.textContent = "Automatic analysis mode.";
    return;
  }
  els.openaiKeyStatus.textContent = status.configured
    ? `Automatic analysis: OpenAI model ${status.model}.`
    : "Automatic analysis: local news model.";
}

async function refreshOpenAiKeyStatus() {
  try {
    const response = await fetch("/api/openai-key-status");
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not check OpenAI key.");
    renderOpenAiKeyStatus(payload);
  } catch (error) {
    if (els.openaiKeyStatus) {
      els.openaiKeyStatus.textContent = "Automatic analysis: local news model.";
    }
  }
}

async function refreshAiNewsAnalysis() {
  const symbol = normalizeSymbol(state.symbol);
  if (!symbol) return;
  state.aiNewsAnalysis = null;
  state.aiNewsError = null;
  renderAiNewsAnalysis();
  try {
    const response = await fetch(`/api/news-analysis?symbol=${encodeURIComponent(symbol)}`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not load AI news analysis.");
    state.aiNewsAnalysis = payload;
  } catch (error) {
    state.aiNewsError = error.message;
  }
  renderAiNewsAnalysis();
}

async function saveOpenAiKeyFromUi() {
  if (!els.openaiKeyInput || !els.openaiKeyStatus) return;
  const apiKey = els.openaiKeyInput.value.trim();
  if (!apiKey) {
    els.openaiKeyStatus.textContent = "Paste an OpenAI API key first.";
    return;
  }
  els.openaiKeyStatus.textContent = "Saving OpenAI key...";
  try {
    const response = await fetch("/api/openai-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not save OpenAI key.");
    els.openaiKeyInput.value = "";
    renderOpenAiKeyStatus(payload);
    await refreshAiNewsAnalysis();
  } catch (error) {
    els.openaiKeyStatus.textContent = error.message;
  }
}

async function clearOpenAiKeyFromUi() {
  if (!els.openaiKeyStatus) return;
  els.openaiKeyStatus.textContent = "Clearing local OpenAI key...";
  try {
    const response = await fetch("/api/openai-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not clear OpenAI key.");
    renderOpenAiKeyStatus(payload);
    await refreshAiNewsAnalysis();
  } catch (error) {
    els.openaiKeyStatus.textContent = error.message;
  }
}

function tradeSignature(plan, analysis, research) {
  if (!plan || !analysis) return "";
  const latestNews = sortedNewsItems(research)[0];
  const levels = plan.levels || {};
  return [
    state.symbol,
    plan.bias,
    analysis.last.timestamp,
    Math.round((levels.buyLow || 0) * 100),
    Math.round((levels.buyHigh || 0) * 100),
    Math.round((levels.addTrigger || 0) * 100),
    Math.round((levels.trimLow || 0) * 100),
    Math.round((levels.stop || 0) * 100),
    latestNews?.published || 0,
    latestNews?.title || "",
  ].join("|");
}

function emailBody(plan, analysis, research) {
  const latestNews = sortedNewsItems(research).slice(0, 5);
  const lines = [
    `StockLens update for ${state.symbol}`,
    "",
    `Bias: ${plan.bias}`,
    `Last price: ${formatMoney(analysis.last.close, state.data?.currency || "USD")} on ${formatDate(analysis.last.timestamp)}`,
    `Buy zone: ${plan.buyZone}`,
    `Buy point date: ${plan.buyPointDate}`,
    `Add trigger: ${plan.addTrigger}`,
    `Trim / sell: ${plan.trimZone}`,
    `Sell point date: ${plan.sellPointDate}`,
    `Risk stop: ${plan.stop}`,
    `Updated: ${plan.updatedAt}`,
    "",
    "Why this setup:",
    ...plan.details.map((item) => `- ${item.text}`),
    "",
    "Up / down drivers:",
    ...analysis.moveDrivers.slice(0, 6).map((item) => `- ${item.text}`),
    "",
    "Latest news:",
    ...(latestNews.length
      ? latestNews.map((item) => `- ${Number.isFinite(item.published) ? formatDate(item.published) : "Undated"} ${item.publisher || "News"}: ${item.title}`)
      : ["- No live news headlines loaded."]),
    "",
    "Scenario analysis only, not financial advice.",
  ];
  return lines.join("\n");
}

function updateAlertStatus(plan, analysis, research) {
  if (!els.alertStatus || !plan || !analysis) return;
  if (!research) {
    els.alertStatus.textContent = "Waiting for live research and news.";
    return;
  }
  const signature = tradeSignature(plan, analysis, research);
  const key = userScopedKey(`signal-signature-${state.symbol}`);
  const previousSignature = localStorage.getItem(key);
  localStorage.setItem(key, signature);
  const changed = Boolean(previousSignature && previousSignature !== signature);
  els.alertStatus.textContent =
    changed
      ? `Signal changed on ${formatLocalDateTime()}; email draft is ready.`
      : `Signal checked on ${formatLocalDateTime()}.`;

  const autoKey = userScopedKey(`auto-draft-signature-${state.symbol}`);
  if (
    changed &&
    els.autoEmailToggle.checked &&
    els.alertEmail.value.trim() &&
    localStorage.getItem(autoKey) !== signature
  ) {
    localStorage.setItem(autoKey, signature);
    openEmailDraft();
  }
}

function openEmailDraft() {
  const plan = state.tradePlan;
  const analysis = state.analysis;
  if (!plan || !analysis) {
    els.alertStatus.textContent = "No signal loaded yet.";
    return;
  }
  const email = els.alertEmail.value.trim();
  if (!email) {
    els.alertStatus.textContent = "Enter an email address first.";
    return;
  }
  localStorage.setItem("stocklens-alert-email", email);
  saveUserSettings({ alertEmail: email });
  const subject = `StockLens ${state.symbol} update: ${plan.bias}`;
  const body = emailBody(plan, analysis, state.research);
  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, "_blank", "noopener");
  els.alertStatus.textContent = `Opened email draft for ${email}.`;
}

function scoreFromTechnical(analysis) {
  if (!analysis) return 50;
  return clamp(50 + analysis.score * 10, 0, 100);
}

function calculateRiskLevel(total, analysis, research, forecast = null) {
  let risk = 50;
  if (analysis) {
    risk += analysis.volatility > 55 ? 18 : analysis.volatility > 35 ? 8 : -6;
    risk += analysis.drawdown < -30 ? 12 : analysis.drawdown < -18 ? 6 : -4;
  }
  const atmIv = research?.options?.atmIv;
  const vix = research?.macro?.vix;
  if (Number.isFinite(atmIv)) risk += atmIv > 0.8 ? 14 : atmIv > 0.5 ? 7 : -4;
  if (Number.isFinite(vix)) risk += vix > 28 ? 14 : vix > 20 ? 6 : -6;
  if (Number.isFinite(forecast?.cases?.bear?.return)) risk += forecast.cases.bear.return <= -25 ? 7 : 0;
  if (Number.isFinite(forecast?.confidence)) risk += forecast.confidence < 45 ? 5 : forecast.confidence > 70 ? -3 : 0;
  risk -= total > 75 ? 6 : total < 40 ? -6 : 0;

  if (risk >= 68) return "High";
  if (risk <= 38) return "Low";
  return "Medium";
}

function alphaComposite(relativeStrength, revision, flow) {
  const rsScore = Number.isFinite(relativeStrength?.score) ? relativeStrength.score : 50;
  const revisionScore = Number.isFinite(revision?.score) ? revision.score : 50;
  const flowScore = Number.isFinite(flow?.score) ? flow.score : 50;
  return rsScore * 0.4 + revisionScore * 0.35 + flowScore * 0.25;
}

function metricPercent(value) {
  if (!Number.isFinite(value)) return null;
  return Math.abs(value) <= 2 ? value * 100 : value;
}

function scoreLowerBetter(value, bands) {
  if (!Number.isFinite(value)) return null;
  if (value <= 0) return 30;
  for (const [limit, score] of bands) {
    if (value <= limit) return score;
  }
  return 25;
}

function scoreHigherBetter(value, bands) {
  if (!Number.isFinite(value)) return null;
  for (const [threshold, score] of bands) {
    if (value >= threshold) return score;
  }
  return 25;
}

function averageScore(scores, fallback = 50) {
  const usable = scores.filter(Number.isFinite);
  if (!usable.length) return fallback;
  return usable.reduce((sum, score) => sum + score, 0) / usable.length;
}

function weightedScore(parts, fallback = 50) {
  let weighted = 0;
  let totalWeight = 0;
  parts.forEach(([score, weight]) => {
    if (!Number.isFinite(score) || !Number.isFinite(weight) || weight <= 0) return;
    weighted += score * weight;
    totalWeight += weight;
  });
  return totalWeight ? weighted / totalWeight : fallback;
}

function marketCapBucket(marketCap) {
  if (!Number.isFinite(marketCap)) return { label: "Unknown size", score: 50 };
  if (marketCap >= 200_000_000_000) return { label: "Mega cap", score: 85 };
  if (marketCap >= 10_000_000_000) return { label: "Large cap", score: 75 };
  if (marketCap >= 2_000_000_000) return { label: "Mid cap", score: 60 };
  if (marketCap >= 300_000_000) return { label: "Small cap", score: 42 };
  return { label: "Micro cap", score: 30 };
}

function factorLabel(score) {
  if (!Number.isFinite(score)) return "--";
  if (score >= 80) return `Top 10% candidate ${Math.round(score)}`;
  if (score >= 70) return `Strong ${Math.round(score)}`;
  if (score >= 55) return `Watchlist ${Math.round(score)}`;
  if (score >= 45) return `Neutral ${Math.round(score)}`;
  return `Weak ${Math.round(score)}`;
}

function calculateVolumeFlow(analysis, research) {
  const options = research?.options;
  const stockVolume = analysis?.last?.volume;
  const averageVolume = analysis?.volume20;
  const stockRatio = analysis?.volumeRatio;
  const dollarVolume = Number.isFinite(stockVolume) && Number.isFinite(analysis?.last?.close)
    ? stockVolume * analysis.last.close
    : null;
  const callVolume = options?.callVolume;
  const putVolume = options?.putVolume;
  const totalOptionVolume = Number.isFinite(options?.totalOptionVolume)
    ? options.totalOptionVolume
    : Number.isFinite(callVolume) && Number.isFinite(putVolume)
      ? callVolume + putVolume
      : null;
  const optionEquivalentRatio =
    Number.isFinite(totalOptionVolume) && Number.isFinite(stockVolume) && stockVolume > 0
      ? (totalOptionVolume * 100 / stockVolume) * 100
      : null;
  const putCallVolume = options?.putCallVolume;
  const dayPercent = analysis?.dayPercent;

  let score = 50;
  if (Number.isFinite(stockRatio)) {
    score += stockRatio >= 1.5 ? (dayPercent >= 0 ? 20 : -18) : stockRatio >= 1.1 ? (dayPercent >= 0 ? 10 : -10) : -4;
  }
  if (Number.isFinite(optionEquivalentRatio)) {
    score += optionEquivalentRatio >= 35 ? 10 : optionEquivalentRatio >= 12 ? 4 : -3;
  }
  if (Number.isFinite(putCallVolume)) {
    score += putCallVolume < 0.75 ? 10 : putCallVolume > 1.25 ? -10 : 0;
  }
  score = clamp(score, 0, 100);

  let label = "Normal";
  if (score >= 70) label = dayPercent >= 0 ? "Accumulation" : "Active hedge";
  else if (score <= 40) label = dayPercent < 0 ? "Distribution" : "Weak flow";
  else if (Number.isFinite(optionEquivalentRatio) && optionEquivalentRatio >= 25) label = "Options active";

  const details = [];
  if (Number.isFinite(stockRatio)) {
    details.push({
      tone: stockRatio >= 1.25 ? (dayPercent >= 0 ? "good" : "bad") : "watch",
      text: `Stock volume is ${stockRatio.toFixed(1)}x its 20D average, so the latest ${dayPercent >= 0 ? "advance" : "drop"} has ${stockRatio >= 1.25 ? "participation" : "limited confirmation"}.`,
    });
  }
  if (Number.isFinite(dollarVolume)) {
    details.push({
      tone: "watch",
      text: `Latest dollar volume is ${formatLargeMoney(dollarVolume, state.data?.currency || "USD")}, useful for liquidity and institution-scale activity.`,
    });
  }
  if (Number.isFinite(totalOptionVolume)) {
    details.push({
      tone: Number.isFinite(optionEquivalentRatio) && optionEquivalentRatio >= 25 ? "good" : "watch",
      text: `Options traded ${formatCompact(totalOptionVolume)} contracts, equal to ${formatPlainPercent(optionEquivalentRatio, 1)} of stock share volume on a 100-share contract basis.`,
    });
  } else {
    details.push({ tone: "watch", text: "Options volume is unavailable for this ticker or expiration chain." });
  }
  if (Number.isFinite(callVolume) || Number.isFinite(putVolume)) {
    details.push({
      tone: Number.isFinite(putCallVolume) && putCallVolume > 1.25 ? "bad" : Number.isFinite(putCallVolume) && putCallVolume < 0.75 ? "good" : "watch",
      text: `Call volume ${formatCompact(callVolume)} versus put volume ${formatCompact(putVolume)}; put/call volume is ${formatNumber(putCallVolume, 2)}.`,
    });
  }

  return {
    score,
    label,
    stockVolume,
    averageVolume,
    stockRatio,
    dollarVolume,
    callVolume,
    putVolume,
    totalOptionVolume,
    optionEquivalentRatio,
    putCallVolume,
    details,
  };
}

function calculateFactorModel(analysis, research) {
  const factors = research?.factorMetrics || {};
  const fundamental = research?.fundamentals;
  const relativeStrength = research?.relativeStrength;
  const volumeFlow = calculateVolumeFlow(analysis, research);
  const technicalScore = scoreFromTechnical(analysis);
  const rangeScore = scoreHigherBetter(analysis?.rangePercent, [
    [50, 92],
    [25, 80],
    [10, 66],
    [0, 54],
    [-15, 40],
  ]);
  const momentum = weightedScore([
    [relativeStrength?.score, 0.45],
    [technicalScore, 0.35],
    [rangeScore, 0.2],
  ]);

  const value = averageScore([
    scoreLowerBetter(factors.trailingPe, [[15, 85], [25, 72], [40, 56], [60, 42]]),
    scoreLowerBetter(factors.forwardPe, [[15, 86], [25, 73], [40, 58], [60, 43]]),
    scoreLowerBetter(factors.priceToBook, [[2, 82], [5, 68], [10, 52], [20, 38]]),
    scoreLowerBetter(factors.priceToSales, [[3, 80], [8, 62], [15, 45], [25, 34]]),
    scoreLowerBetter(factors.enterpriseToRevenue, [[3, 80], [8, 62], [15, 45], [25, 34]]),
  ]);

  const roe = metricPercent(factors.returnOnEquity);
  const profitMargin = metricPercent(factors.profitMargins);
  const grossMargin = metricPercent(factors.grossMargins);
  const operatingMargin = metricPercent(factors.operatingMargins);
  const revenueGrowth = metricPercent(factors.revenueGrowth);
  const earningsGrowth = metricPercent(factors.earningsGrowth);
  const quality = weightedScore([
    [fundamental?.available ? fundamental.score : null, 0.36],
    [scoreHigherBetter(roe, [[30, 90], [20, 78], [10, 62], [0, 45]]), 0.18],
    [scoreHigherBetter(profitMargin, [[25, 90], [15, 76], [8, 62], [0, 45]]), 0.14],
    [scoreHigherBetter(operatingMargin, [[30, 88], [18, 74], [8, 58], [0, 42]]), 0.12],
    [scoreHigherBetter(revenueGrowth, [[25, 88], [12, 72], [5, 60], [0, 48]]), 0.1],
    [scoreHigherBetter(earningsGrowth, [[25, 88], [12, 72], [5, 60], [0, 48]]), 0.1],
  ]);

  const drawdownRisk = Number.isFinite(analysis?.drawdown) ? Math.abs(Math.min(analysis.drawdown, 0)) : null;
  const volatility = averageScore([
    scoreLowerBetter(analysis?.volatility, [[20, 88], [35, 72], [55, 55], [75, 38]]),
    scoreLowerBetter(drawdownRisk, [[8, 86], [18, 72], [30, 54], [45, 36]]),
    scoreLowerBetter(factors.beta, [[0.8, 84], [1.15, 68], [1.6, 50], [2.2, 34]]),
  ]);

  const size = marketCapBucket(factors.marketCap);
  const volume = volumeFlow.score;
  const total =
    momentum * 0.3 +
    value * 0.2 +
    quality * 0.2 +
    volatility * 0.15 +
    size.score * 0.1 +
    volume * 0.05;

  return {
    total,
    label: factorLabel(total),
    scores: {
      momentum,
      value,
      quality,
      volatility,
      size: size.score,
      volume,
    },
    details: [
      {
        tone: toneForScore(momentum).replace("positive", "good").replace("negative", "bad"),
        text: `Momentum blends RS, chart trend, and range return; current score is ${Math.round(momentum)}.`,
      },
      {
        tone: toneForScore(value).replace("positive", "good").replace("negative", "bad"),
        text: `Value uses PE, forward PE, PB, PS, and EV/revenue; PE ${formatNumber(factors.trailingPe, 1)}, PB ${formatNumber(factors.priceToBook, 1)}.`,
      },
      {
        tone: toneForScore(quality).replace("positive", "good").replace("negative", "bad"),
        text: `Quality uses ROIC/FCF plus ROE ${formatPlainPercent(roe, 1)}, profit margin ${formatPlainPercent(profitMargin, 1)}, and growth.`,
      },
      {
        tone: toneForScore(volatility).replace("positive", "good").replace("negative", "bad"),
        text: `Volatility factor rewards lower risk: annualized vol ${formatPercent(analysis?.volatility, 1)}, beta ${formatNumber(factors.beta, 2)}.`,
      },
      {
        tone: size.score >= 70 ? "good" : size.score <= 45 ? "bad" : "watch",
        text: `${size.label}: market cap ${formatLargeMoney(factors.marketCap, "USD")}.`,
      },
      {
        tone: toneForScore(volume).replace("positive", "good").replace("negative", "bad"),
        text: `Volume factor uses stock participation and options flow; current score is ${Math.round(volume)}.`,
      },
    ],
  };
}

function safeScore(value, fallback = 50) {
  return Number.isFinite(value) ? clamp(value, 0, 100) : fallback;
}

function normalizeCaseWeights(cases) {
  const minBase = 0.18;
  let bull = clamp(cases.bull, 0.1, 0.7);
  let bear = clamp(cases.bear, 0.1, 0.6);
  let base = 1 - bull - bear;

  if (base < minBase) {
    const excess = minBase - base;
    const tailWeight = Math.max(0.01, bull + bear);
    bull = Math.max(0.1, bull - excess * (bull / tailWeight));
    bear = Math.max(0.1, bear - excess * (bear / tailWeight));
    base = minBase;
  }

  const total = bull + base + bear;
  return {
    bull: bull / total,
    base: base / total,
    bear: bear / total,
  };
}

function forecastLabel(forecast) {
  if (!forecast) return "--";
  if (forecast.expectedReturn >= 15 && forecast.bullishProbability >= 68) return "Bull skew";
  if (forecast.expectedReturn >= 6) return "Positive skew";
  if (forecast.expectedReturn <= -8) return "Downside skew";
  return "Balanced";
}

function calculateScenarioForecast(analysis, research, scores) {
  if (!analysis) return null;

  const totalScore = safeScore(scores.total);
  const alphaScore = safeScore(scores.alpha);
  const factorScore = safeScore(scores.factorTotal, totalScore);
  const technicalScore = safeScore(scores.technical);
  const macroScore = safeScore(scores.macro);
  const optionsScore = safeScore(scores.options);
  const sentimentScore = safeScore(scores.sentiment);
  const revisionScore = safeScore(scores.revision);
  const fundamentalScore = safeScore(scores.fundamental);
  const flowScore = safeScore(scores.flow);
  const currency = state.data?.currency || "USD";
  const volatility = Number.isFinite(analysis.volatility) ? Math.max(analysis.volatility, 8) : 35;
  const drawdown = Number.isFinite(analysis.drawdown) ? Math.abs(Math.min(analysis.drawdown, 0)) : 18;
  const atmIv = research?.options?.atmIv;
  const putCallVolume = research?.options?.putCallVolume;
  const volumeRatio = analysis.volumeRatio;
  const resistance = analysis.resistance;
  const support = analysis.support;
  const last = analysis.last?.close;

  const riskDrag =
    Math.max(0, volatility - 35) * 0.11 +
    Math.max(0, drawdown - 20) * 0.09 +
    (Number.isFinite(atmIv) && atmIv > 0.55 ? (atmIv - 0.55) * 12 : 0);
  const flowBoost =
    (Number.isFinite(volumeRatio) && volumeRatio >= 1.25 ? 1.5 : 0) +
    (Number.isFinite(putCallVolume) && putCallVolume < 0.75 ? 1.2 : 0) -
    (Number.isFinite(putCallVolume) && putCallVolume > 1.25 ? 1.4 : 0);

  const baseReturn = clamp(
    (totalScore - 50) * 0.22 +
      (alphaScore - 50) * 0.16 +
      (factorScore - 50) * 0.14 +
      (technicalScore - 50) * 0.1 +
      (macroScore - 50) * 0.08 +
      (sentimentScore - 50) * 0.06 +
      (revisionScore - 50) * 0.06 +
      (fundamentalScore - 50) * 0.05 +
      flowBoost -
      riskDrag,
    -28,
    34,
  );

  const upsideVol = clamp(volatility * 0.34, 6, 18);
  const downsideVol = clamp(volatility * 0.44 + drawdown * 0.12, 8, 28);
  const breakoutDistance = Number.isFinite(last) && Number.isFinite(resistance)
    ? clamp((resistance / last - 1) * 100, 0, 18)
    : 6;
  const supportDistance = Number.isFinite(last) && Number.isFinite(support)
    ? clamp((last / support - 1) * 100, 0, 22)
    : 8;
  const bullReturn = clamp(baseReturn + upsideVol + breakoutDistance * 0.35, baseReturn + 5, 58);
  const supportBreakDownside = -clamp(
    volatility * 0.35 + supportDistance * 0.4 + Math.max(0, drawdown - 15) * 0.1,
    8,
    36,
  );
  const bearReturn = clamp(
    Math.min(baseReturn - downsideVol - supportDistance * 0.2, supportBreakDownside),
    -58,
    baseReturn - 5,
  );

  const downsideStress = clamp(
    Math.max(0, volatility - 30) / 220 +
      drawdown / 320 +
      (Number.isFinite(atmIv) && atmIv > 0.55 ? 0.05 : 0) +
      (sentimentScore < 45 ? 0.04 : 0),
    0,
    0.24,
  );
  const weights = normalizeCaseWeights({
    bull:
      0.3 +
      (totalScore - 50) / 170 +
      (alphaScore - 50) / 240 +
      (factorScore - 50) / 260 +
      (macroScore - 50) / 360 +
      (optionsScore - 50) / 360 -
      downsideStress,
    bear:
      0.25 -
      (totalScore - 50) / 220 -
      (alphaScore - 50) / 340 +
      downsideStress +
      (sentimentScore < 45 ? 0.05 : 0),
  });

  const expectedReturn =
    bullReturn * weights.bull +
    baseReturn * weights.base +
    bearReturn * weights.bear;
  const bullishProbability = clamp((weights.bull + weights.base * (baseReturn >= 0 ? 0.65 : 0.42)) * 100, 5, 95);
  const dataInputs = [
    analysis?.points?.length > 80,
    research?.fundamentals?.available,
    research?.options?.available,
    research?.macro?.available,
    research?.relativeStrength?.available,
    research?.earningsRevision?.available,
    research?.institutionalFlow?.available,
    scores.sentimentHasNews,
  ].filter(Boolean).length;
  const spread = bullReturn - bearReturn;
  const confidence = clamp(34 + dataInputs * 7 - Math.max(0, spread - 42) * 0.28 - downsideStress * 45, 22, 90);
  const sensitivity = 10 * 0.22;
  const breakpoint = expectedReturn >= 0
    ? `Bull case needs close above ${formatMoney(resistance, currency)}; fail below ${formatMoney(support, currency)}.`
    : `Downside remains active until price reclaims ${formatMoney(resistance, currency)}.`;

  const details = [
    {
      tone: baseReturn >= 6 ? "good" : baseReturn <= -6 ? "bad" : "watch",
      text: `Base case is ${formatPercent(baseReturn, 1)} with ${formatPlainPercent(weights.base * 100, 0)} weight from composite, alpha, factor, and macro scores.`,
    },
    {
      tone: "good",
      text: `Bull case is ${formatPercent(bullReturn, 1)} with ${formatPlainPercent(weights.bull * 100, 0)} weight if resistance breaks and volume/options confirm demand.`,
    },
    {
      tone: "bad",
      text: `Bear case is ${formatPercent(bearReturn, 1)} with ${formatPlainPercent(weights.bear * 100, 0)} weight if support fails or volatility expands.`,
    },
    {
      tone: confidence >= 65 ? "good" : confidence <= 45 ? "bad" : "watch",
      text: `Confidence is ${Math.round(confidence)}/100 from ${dataInputs}/8 available data groups and a ${formatPlainPercent(spread, 1)} bull/bear spread.`,
    },
    {
      tone: "watch",
      text: `Sensitivity: every 10-point composite score change moves base-case return about ${formatPlainPercent(sensitivity, 1)} before probability shifts.`,
    },
  ];

  return {
    label: forecastLabel({ expectedReturn, bullishProbability }),
    expectedReturn,
    bullishProbability,
    confidence,
    breakpoint,
    cases: {
      bull: { return: bullReturn, probability: weights.bull },
      base: { return: baseReturn, probability: weights.base },
      bear: { return: bearReturn, probability: weights.bear },
    },
    details,
  };
}

function buildTradePlan(analysis, research, totalScore, alphaScore) {
  if (!analysis) {
    return null;
  }

  const currency = state.data?.currency || "USD";
  const last = analysis.last.close;
  const support = analysis.support;
  const resistance = analysis.resistance;
  const buyPoint = analysis.points[analysis.supportIndex] || analysis.last;
  const sellPoint = analysis.points[analysis.resistanceIndex] || analysis.last;
  const buyPointPrice = buyPoint.low || buyPoint.close;
  const sellPointPrice = sellPoint.high || sellPoint.close;
  const buyPointAge = daysSinceTimestamp(buyPoint.timestamp);
  const sellPointAge = daysSinceTimestamp(sellPoint.timestamp);
  const staleBuyPoint = Number.isFinite(buyPointAge) && buyPointAge > 21;
  const range = Math.max(resistance - support, last * 0.03);
  const buyLow = Math.max(0, support - range * 0.08);
  const buyHigh = support + range * 0.28;
  const addTrigger = resistance * 1.01;
  const trimLow = resistance;
  const trimHigh = resistance + range * 0.35;
  const atrBuffer = Number.isFinite(analysis.atrValue) ? analysis.atrValue * 0.8 : range * 0.18;
  const stop = Math.max(0, support - Math.max(range * 0.18, atrBuffer));
  const nearSupport = last <= buyHigh;
  const breakoutReady = last > resistance * 0.985;
  const aboveShortTrend = last > (lastNonNull(analysis.ema21) || last) && last > (lastNonNull(analysis.ma20) || last);
  const macdImproving = Number.isFinite(analysis.macdHistogram) && analysis.macdHistogram > 0;
  const volumeConfirmed = Number.isFinite(analysis.volumeRatio) && analysis.volumeRatio >= 1.25;
  const distanceFromSupport = ((last / support - 1) * 100);
  const rewardToTrim = trimLow - last;
  const riskToStop = Math.max(last - stop, 0.01);
  const rewardRisk = rewardToTrim / riskToStop;
  const weakSetup = totalScore < 45 || alphaScore < 45;
  const strongSetup = totalScore >= 70 && alphaScore >= 68;

  let bias = "Wait";
  if (weakSetup) bias = "Avoid / sell";
  else if (strongSetup && nearSupport) bias = "Buy zone";
  else if (strongSetup && breakoutReady) bias = "Breakout watch";
  else if (strongSetup) bias = "Buy pullback";

  const tones = {
    "Buy zone": "good",
    "Breakout watch": "good",
    "Buy pullback": "watch",
    Wait: "watch",
    "Avoid / sell": "bad",
  };

  return {
    bias,
    tone: tones[bias],
    buyZone: weakSetup ? "No fresh buy" : `${formatMoney(buyLow, currency)} - ${formatMoney(buyHigh, currency)}`,
    addTrigger: `${formatMoney(addTrigger, currency)} close`,
    trimZone: `${formatMoney(trimLow, currency)} - ${formatMoney(trimHigh, currency)}`,
    stop: `${formatMoney(stop, currency)} close`,
    buyPointDate: `${formatDate(buyPoint.timestamp)} @ ${formatMoney(buyPointPrice, currency)}`,
    sellPointDate: `${formatDate(sellPoint.timestamp)} @ ${formatMoney(sellPointPrice, currency)}`,
    updatedAt: `${formatDate(analysis.last.timestamp)} data / ${formatLocalDateTime()} refresh`,
    levels: {
      buyLow,
      buyHigh,
      addTrigger,
      trimLow,
      trimHigh,
      stop,
    },
    details: [
      {
        tone: staleBuyPoint ? "watch" : "good",
        text: staleBuyPoint
          ? `Buy reference is old: support formed on ${formatDate(buyPoint.timestamp)} (${buyPointAge} days ago) at ${formatMoney(buyPointPrice, currency)}; wait for a fresh retest before buying size.`
          : `Buy reference is fresh: support formed on ${formatDate(buyPoint.timestamp)} at ${formatMoney(buyPointPrice, currency)}.`,
      },
      {
        tone: "watch",
        text: `Sell/trim reference formed on ${formatDate(sellPoint.timestamp)} at ${formatMoney(sellPointPrice, currency)}; that is the nearest proven supply zone.`,
      },
      {
        tone: strongSetup ? "good" : weakSetup ? "bad" : "watch",
        text: strongSetup
          ? `Buy bias has evidence: total score ${Math.round(totalScore)}, alpha stack ${Math.round(alphaScore)} from RS, revisions, and institutional flow.`
          : weakSetup
            ? `Avoid fresh buys: total score ${Math.round(totalScore)} and alpha ${Math.round(alphaScore)} are below the quality threshold.`
            : `Mixed setup: total score ${Math.round(totalScore)} and alpha ${Math.round(alphaScore)} need either support or breakout confirmation.`,
      },
      {
        tone: nearSupport && !weakSetup ? "good" : "watch",
        text: nearSupport
          ? `Buy zone is tied to the ${formatShortDate(buyPoint.timestamp)} support; current price is ${distanceFromSupport.toFixed(1)}% above it.`
          : `Do not chase: current price is ${distanceFromSupport.toFixed(1)}% above the ${formatShortDate(buyPoint.timestamp)} support, so the better buy is a pullback into ${formatMoney(buyLow, currency)} - ${formatMoney(buyHigh, currency)}.`,
      },
      {
        tone: breakoutReady && aboveShortTrend ? "good" : "watch",
        text: breakoutReady
          ? `Add only on a close above ${formatMoney(addTrigger, currency)}; that clears recent resistance and confirms buyers accepted higher prices.`
          : `Add trigger stays at ${formatMoney(addTrigger, currency)} because resistance near ${formatMoney(resistance, currency)} has not clearly broken yet.`,
      },
      {
        tone: rewardRisk >= 1.2 ? "good" : "watch",
        text: `Trim/sell zone starts at ${formatMoney(trimLow, currency)}; current reward/risk to first trim is about ${rewardRisk.toFixed(1)}x.`,
      },
      {
        tone: analysis.last.close > stop ? "watch" : "bad",
        text: `Risk stop is ${formatMoney(stop, currency)} because a close below support plus ATR buffer invalidates the setup.`,
      },
      {
        tone: macdImproving && volumeConfirmed ? "good" : macdImproving || volumeConfirmed ? "watch" : "bad",
        text: `${macdImproving ? "MACD supports momentum" : "MACD does not confirm momentum"}; ${volumeConfirmed ? `volume is ${analysis.volumeRatio.toFixed(1)}x average` : "volume confirmation is limited"}.`,
      },
    ],
  };
}

function setNlpScore(element, score, tokenCount) {
  element.textContent = tokenCount > 0 ? Math.round(score).toString() : "--";
  element.classList.remove("positive", "negative", "neutral");
  element.classList.add(tokenCount > 0 ? toneForScore(score) : "neutral");
}

function renderCallNlp(sentiment) {
  const callNlp = sentiment.callNlp;
  const sectionScores = callNlp.sectionScores;
  setNlpScore(els.ceoCallScore, sectionScores.ceo.score, sectionScores.ceo.tokens);
  setNlpScore(els.cfoCallScore, sectionScores.cfo.score, sectionScores.cfo.tokens);
  setNlpScore(els.qaCallScore, sectionScores.qa.score, sectionScores.qa.tokens);
  setNlpScore(els.keywordCoverageScore, callNlp.keywords.score, callNlp.wordCount);

  els.callKeywordGrid.replaceChildren(
    ...callNlp.keywords.topics.map((topic) => {
      const node = document.createElement("span");
      const label = document.createElement("small");
      const value = document.createElement("strong");
      label.textContent = topic.label;
      value.textContent = `${topic.count}`;
      node.append(label, value);
      return node;
    }),
  );

  const topTopics = [...callNlp.keywords.topics].sort((a, b) => b.count - a.count);
  const missingTopics = topTopics.filter((topic) => topic.count === 0).map((topic) => topic.label);
  const qaTone =
    sectionScores.qa.tokens === 0
      ? "watch"
      : sectionScores.qa.score >= 65
        ? "good"
        : sectionScores.qa.score <= 45
          ? "bad"
          : "watch";

  els.institutionalFocus.replaceChildren(
    ...listItems([
      {
        tone: topTopics[0]?.count > 0 ? "good" : "watch",
        text: topTopics[0]?.count > 0
          ? `Most discussed: ${topTopics.slice(0, 3).map((topic) => `${topic.label} ${topic.count}`).join(", ")}.`
          : "No institutional topic keywords detected yet.",
      },
      {
        tone: qaTone,
        text: sectionScores.qa.tokens > 0
          ? `Analyst Q&A score ${Math.round(sectionScores.qa.score)} from ${sectionScores.qa.tokens} words.`
          : "Analyst Q&A not detected; paste the Q&A section for stronger signal quality.",
      },
      {
        tone: missingTopics.length ? "watch" : "good",
        text: missingTopics.length
          ? `Missing focus areas: ${missingTopics.slice(0, 3).join(", ")}.`
          : "All core focus areas appeared at least once.",
      },
    ]),
  );
}

function renderAlphaAndTrade(analysis, research, totalScore, alphaScore) {
  const relativeStrength = research?.relativeStrength;
  const revision = research?.earningsRevision;
  const flow = research?.institutionalFlow;
  const currentQuarter = revision?.currentQuarter;
  const topHolders = flow?.topHolders || [];
  const topAccumulating = topHolders
    .filter((holder) => Number.isFinite(holder.pctChange) && holder.pctChange > 0)
    .slice(0, 2)
    .map((holder) => holder.organization?.replace(/( Inc\.| LLC| Corporation| Capital Management)/gi, "").trim())
    .filter(Boolean);

  setScore(els.relativeStrengthScore, relativeStrength?.available ? relativeStrength.score : NaN);
  setScore(els.revisionScore, revision?.available ? revision.score : NaN);
  setScore(els.flowScore, flow?.available ? flow.score : NaN);

  els.relativeStrengthScoreNote.textContent = relativeStrength?.available
    ? `6M ${formatPercent(relativeStrength.excessReturn6m, 1)}`
    : "Loading";
  els.revisionScoreNote.textContent = revision?.available
    ? `30D ${formatPercent(currentQuarter?.revision30d, 1)}`
    : "Loading";
  els.flowScoreNote.textContent = flow?.available
    ? `Net ${formatPlainPercent((flow.netInstBuyingPercent || 0) * 100, 2)}`
    : "Loading";

  els.alphaLabel.textContent = scoreLabel(alphaScore, "Strong", "Mixed", "Weak");
  els.alphaLabel.classList.remove("positive", "negative", "neutral");
  els.alphaLabel.classList.add(toneForScore(alphaScore));
  els.rs6mValue.textContent = relativeStrength?.available ? formatPercent(relativeStrength.excessReturn6m, 1) : "--";
  els.rs12mValue.textContent = relativeStrength?.available ? formatPercent(relativeStrength.excessReturn12m, 1) : "--";
  els.epsRevisionValue.textContent = revision?.available ? formatPercent(currentQuarter?.revision30d, 1) : "--";
  els.institutionalBuyingValue.textContent = flow?.available
    ? formatPlainPercent((flow.netInstBuyingPercent || 0) * 100, 2)
    : "--";

  els.alphaDetails.replaceChildren(
    ...listItems([
      {
        tone: relativeStrength?.score >= 70 ? "good" : relativeStrength?.score <= 45 ? "bad" : "watch",
        text: relativeStrength?.available
          ? `Relative strength: ${formatPercent(relativeStrength.stockReturn6m, 1)} over 6M versus SPY ${formatPercent(relativeStrength.spyReturn6m, 1)}.`
          : "Relative strength unavailable.",
      },
      {
        tone: revision?.score >= 70 ? "good" : revision?.score <= 45 ? "bad" : "watch",
        text: revision?.available
          ? `Analysts revised current-quarter EPS ${formatPercent(currentQuarter?.revision30d, 1)} in 30 days; ${currentQuarter?.upLast30Days || 0} up vs ${currentQuarter?.downLast30Days || 0} down.`
          : "Earnings revision unavailable.",
      },
      {
        tone: flow?.score >= 70 ? "good" : flow?.score <= 45 ? "bad" : "watch",
        text: flow?.available
          ? topAccumulating.length
            ? `Institutional accumulation led by ${topAccumulating.join(" and ")}.`
            : `${flow.positiveHolders || 0} top holders increased, ${flow.negativeHolders || 0} reduced.`
          : "Institutional flow unavailable.",
      },
    ]),
  );

  const plan = buildTradePlan(analysis, research, totalScore, alphaScore);
  if (!plan) {
    state.tradePlan = null;
    els.tradeBiasLabel.textContent = "--";
    els.buyZone.textContent = "--";
    els.buyPointDate.textContent = "--";
    els.addTrigger.textContent = "--";
    els.trimZone.textContent = "--";
    els.sellPointDate.textContent = "--";
    els.riskStop.textContent = "--";
    els.signalUpdatedAt.textContent = "--";
    els.tradePlanDetails.replaceChildren();
    els.moveReasonList.replaceChildren();
    return;
  }

  state.tradePlan = plan;
  els.tradeBiasLabel.textContent = plan.bias;
  els.tradeBiasLabel.classList.remove("positive", "negative", "neutral");
  els.tradeBiasLabel.classList.add(plan.tone === "good" ? "positive" : plan.tone === "bad" ? "negative" : "neutral");
  els.buyZone.textContent = plan.buyZone;
  els.buyPointDate.textContent = plan.buyPointDate;
  els.addTrigger.textContent = plan.addTrigger;
  els.trimZone.textContent = plan.trimZone;
  els.sellPointDate.textContent = plan.sellPointDate;
  els.riskStop.textContent = plan.stop;
  els.signalUpdatedAt.textContent = plan.updatedAt;
  els.tradePlanDetails.replaceChildren(...listItems(plan.details));
  const news = analyzeNews(research, analysis);
  const newsDriver = news.latest
    ? {
        tone: news.tone,
        text: `News driver: ${Number.isFinite(news.latest.published) ? formatDate(news.latest.published) : "Undated"} ${news.latest.publisher || "News"} - ${news.latest.title}`,
      }
    : null;
  els.moveReasonList.replaceChildren(
    ...listItems([...(newsDriver ? [newsDriver] : []), ...analysis.moveDrivers].slice(0, 7)),
  );
  updateAlertStatus(plan, analysis, research);

  if (state.data && state.analysis) {
    renderChart(state.data, state.analysis, plan);
  }
}

function renderNewsInsights(research, analysis, sentiment) {
  const news = analyzeNews(research, analysis);
  els.newsToneLabel.textContent = news.available
    ? `${news.direction} ${Math.round(news.score)}`
    : "--";
  els.newsToneLabel.classList.remove("positive", "negative", "neutral");
  els.newsToneLabel.classList.add(news.tone === "good" ? "positive" : news.tone === "bad" ? "negative" : "neutral");
  els.latestNewsDate.textContent = news.latest?.published
    ? `${formatDate(news.latest.published)}`
    : "--";
  els.newsDriverLabel.textContent = news.available ? news.driverText : "--";
  els.newsInsightList.replaceChildren(
    ...listItems(
      news.available
        ? [
            {
              tone: sentiment?.hasNews ? news.tone : "watch",
              text: `News score ${Math.round(news.score)} is included in sentiment; refresh time ${formatLocalDateTime()}.`,
            },
            ...news.items,
          ]
        : [{ tone: "watch", text: "No live news headlines loaded yet." }],
    ),
  );
  const query = encodeURIComponent(`${state.symbol} stock latest news`);
  els.googleNewsLink.href = `https://www.google.com/search?tbm=nws&q=${query}`;
}

function renderAiNewsAnalysis() {
  const payload = state.aiNewsAnalysis;
  const newsAnalysis = payload?.analysis;
  const overall = buildOverallSummary(newsAnalysis);
  if (overall) {
    const context = state.overallContext;
    const modelLabel = newsAnalysis?.source === "OpenAI Responses API"
      ? "OpenAI + StockLens factor model"
      : "StockLens local factor/news model";
    els.aiNewsLabel.textContent = `${overall.direction} ${Math.round(context.totalScore)}`;
    els.aiNewsLabel.classList.remove("positive", "negative", "neutral");
    els.aiNewsLabel.classList.add(overall.tone === "good" ? "positive" : overall.tone === "bad" ? "negative" : "neutral");
    els.aiNewsImpact.textContent = `${Math.round(context.totalScore)}/100`;
    els.aiNewsConfidence.textContent = `${Math.round(overall.confidence)}/100`;
    els.aiNewsModel.textContent = modelLabel;
    els.aiNewsSnapshot.textContent = payload ? formatNewsSnapshot(payload) : "Latest news snapshot: loading latest headlines...";
    if (els.openaiKeyStatus) {
      els.openaiKeyStatus.textContent = newsAnalysis?.source === "OpenAI Responses API"
        ? "Automatic analysis: OpenAI news layer plus local factor model."
        : "Automatic analysis: local factor/news model.";
    }
    els.aiNewsSummary.textContent = overall.summary;
    els.aiNewsWhy.replaceChildren(...listItems(overall.overallRead));
    els.aiNewsCatalysts.replaceChildren(...listItems(overall.catalysts));
    els.aiNewsRisks.replaceChildren(...listItems(overall.risks));
    els.aiNewsHorizons.replaceChildren(...listItems(overall.horizons));
    renderAiSources(payload, newsAnalysis?.sourcesUsed);
    return;
  }

  if (!newsAnalysis) {
    els.aiNewsLabel.textContent = state.aiNewsError ? "Unavailable" : "Loading";
    els.aiNewsLabel.classList.remove("positive", "negative", "neutral");
    els.aiNewsLabel.classList.add(state.aiNewsError ? "negative" : "neutral");
    els.aiNewsImpact.textContent = "--";
    els.aiNewsConfidence.textContent = "--";
    els.aiNewsModel.textContent = "--";
    els.aiNewsSnapshot.textContent = "Latest news snapshot: --";
    els.aiNewsSummary.textContent = state.aiNewsError || "Waiting for company news analysis.";
    els.aiNewsWhy.replaceChildren();
    els.aiNewsCatalysts.replaceChildren();
    els.aiNewsRisks.replaceChildren();
    els.aiNewsHorizons.replaceChildren();
    els.aiNewsSources.replaceChildren();
    return;
  }

  const tone = toneForDirection(newsAnalysis.direction, newsAnalysis.impactScore);
  const isOpenAi = newsAnalysis.source === "OpenAI Responses API";
  els.aiNewsLabel.textContent = `${newsAnalysis.direction || "Mixed"} ${Math.round(newsAnalysis.impactScore || 0)}`;
  els.aiNewsLabel.classList.remove("positive", "negative", "neutral");
  els.aiNewsLabel.classList.add(tone === "good" ? "positive" : tone === "bad" ? "negative" : "neutral");
  els.aiNewsImpact.textContent = Number.isFinite(newsAnalysis.impactScore)
    ? `${Math.round(newsAnalysis.impactScore)}/100`
    : "--";
  els.aiNewsConfidence.textContent = Number.isFinite(newsAnalysis.confidence)
    ? `${Math.round(newsAnalysis.confidence)}/100`
    : "--";
  els.aiNewsModel.textContent = isOpenAi
    ? newsAnalysis.model || "OpenAI"
    : newsAnalysis.model || "StockLens local model";
  els.aiNewsSnapshot.textContent = formatNewsSnapshot(payload);
  els.aiNewsSummary.textContent = newsAnalysis.summary || "--";

  const sourceTone = newsAnalysis.source === "OpenAI Responses API" ? "good" : "watch";
  els.aiNewsWhy.replaceChildren(
    ...listItems([
      { tone: sourceTone, text: `Source: ${newsAnalysis.source || "AI analysis"}.` },
      ...(newsAnalysis.whyMove || []).map((text) => ({ tone, text })),
      ...(newsAnalysis.priceVolumeRead ? [{ tone: "watch", text: newsAnalysis.priceVolumeRead }] : []),
      ...(newsAnalysis.optionsRead ? [{ tone: "watch", text: newsAnalysis.optionsRead }] : []),
    ].slice(0, 7)),
  );
  els.aiNewsCatalysts.replaceChildren(
    ...listItems((newsAnalysis.catalysts || []).map((text) => ({ tone, text }))),
  );
  els.aiNewsRisks.replaceChildren(
    ...listItems((newsAnalysis.risks || []).map((text) => ({ tone: "bad", text }))),
  );
  els.aiNewsHorizons.replaceChildren(
    ...listItems([
      { tone: "watch", text: `1D: ${newsAnalysis.horizons?.oneDay || "--"}` },
      { tone: "watch", text: `1W: ${newsAnalysis.horizons?.oneWeek || "--"}` },
      { tone: "watch", text: `1M: ${newsAnalysis.horizons?.oneMonth || "--"}` },
    ]),
  );
  renderAiSources(payload, newsAnalysis.sourcesUsed);
}

function renderVolumeFlow(analysis, research, currency) {
  const flow = calculateVolumeFlow(analysis, research);
  els.volumeFlowLabel.textContent = analysis ? `${flow.label} ${Math.round(flow.score)}` : "--";
  els.volumeFlowLabel.classList.remove("positive", "negative", "neutral");
  els.volumeFlowLabel.classList.add(toneForScore(flow.score));
  els.stockVolumeValue.textContent = formatCompact(flow.stockVolume);
  els.avgVolumeValue.textContent = formatCompact(flow.averageVolume);
  els.stockVolumeRatio.textContent = Number.isFinite(flow.stockRatio)
    ? `${flow.stockRatio.toFixed(1)}x`
    : "--";
  els.dollarVolumeValue.textContent = formatLargeMoney(flow.dollarVolume, currency);
  els.totalOptionVolume.textContent = formatCompact(flow.totalOptionVolume);
  els.optionStockVolumeRatio.textContent = formatPlainPercent(flow.optionEquivalentRatio, 1);
  els.callPutVolumeValue.textContent = Number.isFinite(flow.callVolume) || Number.isFinite(flow.putVolume)
    ? `${formatCompact(flow.callVolume)} / ${formatCompact(flow.putVolume)}`
    : "--";
  els.volumeFlowDetails.replaceChildren(
    ...listItems(
      analysis || research
        ? flow.details
        : [{ tone: "watch", text: "Waiting for stock volume and options chain data." }],
    ),
  );
}

function renderMultiFactor(analysis, research, suppliedModel = null) {
  if (!analysis && !research) {
    els.multiFactorLabel.textContent = "--";
    setScore(els.factorMomentum, NaN);
    setScore(els.factorValue, NaN);
    setScore(els.factorQuality, NaN);
    setScore(els.factorVolatility, NaN);
    setScore(els.factorSize, NaN);
    setScore(els.factorVolume, NaN);
    els.factorDetails.replaceChildren(
      ...listItems([{ tone: "watch", text: "Waiting for price history and factor metrics." }]),
    );
    return null;
  }

  const model = suppliedModel || calculateFactorModel(analysis, research);
  els.multiFactorLabel.textContent = model.label;
  els.multiFactorLabel.classList.remove("positive", "negative", "neutral");
  els.multiFactorLabel.classList.add(toneForScore(model.total));
  setScore(els.factorMomentum, model.scores.momentum);
  setScore(els.factorValue, model.scores.value);
  setScore(els.factorQuality, model.scores.quality);
  setScore(els.factorVolatility, model.scores.volatility);
  setScore(els.factorSize, model.scores.size);
  setScore(els.factorVolume, model.scores.volume);
  els.factorDetails.replaceChildren(...listItems(model.details));
  return model;
}

function renderScenarioForecast(forecast) {
  if (!forecast) {
    els.scenarioForecastLabel.textContent = "--";
    els.scenarioForecastLabel.classList.remove("positive", "negative", "neutral");
    els.scenarioForecastLabel.classList.add("neutral");
    els.baseCaseReturn.textContent = "--";
    els.bullCaseReturn.textContent = "--";
    els.bearCaseReturn.textContent = "--";
    els.forecastConfidence.textContent = "--";
    els.scenarioBreakpoint.textContent = "--";
    els.scenarioDetails.replaceChildren(
      ...listItems([{ tone: "watch", text: "Waiting for scorecard, market data, and factor inputs." }]),
    );
    return;
  }

  els.scenarioForecastLabel.textContent = forecast.label;
  els.scenarioForecastLabel.classList.remove("positive", "negative", "neutral");
  els.scenarioForecastLabel.classList.add(
    forecast.expectedReturn >= 6 ? "positive" : forecast.expectedReturn <= -8 ? "negative" : "neutral",
  );
  els.baseCaseReturn.textContent = `${formatPercent(forecast.cases.base.return, 1)} / ${formatPlainPercent(forecast.cases.base.probability * 100, 0)}`;
  els.bullCaseReturn.textContent = `${formatPercent(forecast.cases.bull.return, 1)} / ${formatPlainPercent(forecast.cases.bull.probability * 100, 0)}`;
  els.bearCaseReturn.textContent = `${formatPercent(forecast.cases.bear.return, 1)} / ${formatPlainPercent(forecast.cases.bear.probability * 100, 0)}`;
  els.forecastConfidence.textContent = `${Math.round(forecast.confidence)}/100`;
  els.scenarioBreakpoint.textContent = forecast.breakpoint;
  els.scenarioDetails.replaceChildren(...listItems(forecast.details));
}

function overallDirectionFromContext(context) {
  if (!context) return "Mixed";
  if (context.expectedReturn >= 8 && context.totalScore >= 62 && context.risk !== "High") return "Bullish";
  if (context.expectedReturn <= -5 || context.totalScore <= 42) return "Bearish";
  if (context.totalScore >= 58 && context.expectedReturn > 0) return "Constructive";
  return "Mixed";
}

function toneForOverallDirection(direction) {
  if (direction === "Bullish" || direction === "Constructive") return "good";
  if (direction === "Bearish") return "bad";
  return "watch";
}

function scoreRowsFromContext(context) {
  if (!context) return [];
  return [
    { key: "fundamental", label: "Fundamental", score: context.fundamentalScore, note: "ROIC + FCF quality" },
    { key: "sentiment", label: "Sentiment", score: context.sentimentScore, note: "call/news tone" },
    { key: "macro", label: "Macro", score: context.macroScore, note: "SPY + VIX backdrop" },
    { key: "options", label: "Options", score: context.optionsScore, note: "put/call, IV, gamma" },
    { key: "rs", label: "Relative strength", score: context.relativeStrengthScore, note: "versus SPY" },
    { key: "revision", label: "Revision", score: context.revisionScore, note: "EPS estimate trend" },
    { key: "flow", label: "Institutional flow", score: context.flowScore, note: "holder accumulation" },
    { key: "technical", label: "Technical", score: context.technicalScore, note: context.analysis?.trend || "price trend" },
    { key: "multiFactor", label: "Multi-factor", score: context.factorModel?.total, note: "momentum/value/quality/risk" },
  ].filter((row) => Number.isFinite(row.score));
}

function buildOverallSummary(payloadAnalysis) {
  const context = state.overallContext;
  if (!context) return null;

  const rows = scoreRowsFromContext(context);
  const direction = overallDirectionFromContext(context);
  const tone = toneForOverallDirection(direction);
  const newsDirection = payloadAnalysis?.direction || "Mixed";
  const newsScore = Number.isFinite(payloadAnalysis?.impactScore) ? payloadAnalysis.impactScore : null;
  const confidenceInputs = [
    [context.forecast?.confidence, 0.65],
    [payloadAnalysis?.confidence, payloadAnalysis ? 0.25 : 0],
    [context.totalScore, 0.1],
  ];
  const confidence = weightedScore(confidenceInputs, context.forecast?.confidence || 50);
  const strongest = [...rows].sort((a, b) => b.score - a.score).slice(0, 3);
  const weakest = [...rows].sort((a, b) => a.score - b.score).slice(0, 3);
  const last = context.analysis?.last?.close;
  const support = context.analysis?.support;
  const resistance = context.analysis?.resistance;
  const currency = state.data?.currency || "USD";

  const summary = [
    `Conclusion: ${state.symbol} is ${direction.toLowerCase()} overall.`,
    `The scenario model shows ${formatPercent(context.expectedReturn, 1)} expected 12M return with ${formatPercent(context.bullishProbability, 0).replace("+", "")} bullish probability.`,
    `Main support comes from ${strongest.map((row) => `${row.label} ${Math.round(row.score)}`).join(", ")}.`,
    newsScore !== null ? `Latest news tone is ${newsDirection.toLowerCase()} at ${Math.round(newsScore)}/100.` : "Latest news is not yet loaded.",
  ].join(" ");

  const overallRead = [
    {
      tone,
      text: `Overall score ${Math.round(context.totalScore)}/100; forecast label ${context.forecast?.label || "--"}; risk is ${context.risk}.`,
    },
    {
      tone: context.expectedReturn >= 6 ? "good" : context.expectedReturn <= -5 ? "bad" : "watch",
      text: `Scenario-weighted expected return is ${formatPercent(context.expectedReturn, 1)}; bear case is ${formatPercent(context.forecast?.cases?.bear?.return, 1)}.`,
    },
    {
      tone: context.factorModel?.total >= 70 ? "good" : context.factorModel?.total <= 45 ? "bad" : "watch",
      text: `Multi-factor score is ${Math.round(context.factorModel?.total || 0)}/100, blending momentum, value, quality, volatility, size, and volume.`,
    },
    {
      tone: payloadAnalysis ? toneForDirection(payloadAnalysis.direction, payloadAnalysis.impactScore) : "watch",
      text: payloadAnalysis
        ? `News layer reads ${newsDirection.toLowerCase()} with ${Math.round(newsScore || 0)}/100 impact.`
        : "News layer is still loading; the conclusion currently relies on price, factor, flow, and options data.",
    },
    {
      tone: context.analysis?.trend === "Uptrend" ? "good" : context.analysis?.trend === "Downtrend" ? "bad" : "watch",
      text: `Technical trend is ${context.analysis?.trend || "--"}; current price is ${formatMoney(last, currency)} versus support ${formatMoney(support, currency)} and resistance ${formatMoney(resistance, currency)}.`,
    },
  ];

  const catalysts = [
    ...strongest.map((row) => ({
      tone: row.score >= 70 ? "good" : "watch",
      text: `${row.label}: ${Math.round(row.score)}/100 from ${row.note}.`,
    })),
    ...(payloadAnalysis?.catalysts || []).slice(0, 2).map((text) => ({ tone: "watch", text })),
  ].slice(0, 5);

  const risks = [
    ...weakest
      .filter((row) => row.score < 58)
      .map((row) => ({
        tone: row.score <= 45 ? "bad" : "watch",
        text: `${row.label}: ${Math.round(row.score)}/100 is the weakest part of the setup.`,
      })),
    {
      tone: "bad",
      text: `Bear case is ${formatPercent(context.forecast?.cases?.bear?.return, 1)} if support fails, volatility expands, or news follow-through weakens.`,
    },
    ...(payloadAnalysis?.risks || []).slice(0, 2).map((text) => ({ tone: "bad", text })),
  ].slice(0, 5);

  const horizons = [
    {
      tone: "watch",
      text: `1D: Watch whether price holds ${formatMoney(support, currency)} and whether volume confirms the next move.`,
    },
    {
      tone: context.expectedReturn >= 6 ? "good" : "watch",
      text: `1W: ${context.forecast?.breakpoint || "Use support/resistance breakpoints for confirmation."}`,
    },
    {
      tone: direction === "Bearish" ? "bad" : "watch",
      text: `1M: Re-check revisions, institutional flow, options put/call, and news tone before treating this as a durable trend.`,
    },
  ];

  return {
    direction,
    tone,
    confidence,
    summary,
    overallRead,
    catalysts,
    risks,
    horizons,
  };
}

function renderResearch() {
  const research = state.research;
  const analysis = state.analysis;
  const sentiment = calculateSentiment(research);
  const fundamental = research?.fundamentals;
  const options = research?.options;
  const macro = research?.macro;
  const relativeStrength = research?.relativeStrength;
  const revision = research?.earningsRevision;
  const flow = research?.institutionalFlow;
  const currency = state.data?.currency || "USD";

  const fundamentalScore = Number.isFinite(fundamental?.score) ? fundamental.score : 50;
  const sentimentScore = sentiment.score;
  const macroScore = Number.isFinite(macro?.score) ? macro.score : 50;
  const optionsScore = Number.isFinite(options?.score) ? options.score : 50;
  const relativeStrengthScore = Number.isFinite(relativeStrength?.score) ? relativeStrength.score : 50;
  const revisionScore = Number.isFinite(revision?.score) ? revision.score : 50;
  const flowScore = Number.isFinite(flow?.score) ? flow.score : 50;
  const technicalScore = scoreFromTechnical(analysis);
  const alphaScore = alphaComposite(relativeStrength, revision, flow);
  const total =
    fundamentalScore * 0.13 +
    sentimentScore * 0.1 +
    macroScore * 0.07 +
    optionsScore * 0.11 +
    relativeStrengthScore * 0.18 +
    revisionScore * 0.16 +
    flowScore * 0.1 +
    technicalScore * 0.15;
  const factorModel = analysis || research ? calculateFactorModel(analysis, research) : null;
  const forecast = calculateScenarioForecast(analysis, research, {
    total,
    alpha: alphaScore,
    factorTotal: factorModel?.total,
    technical: technicalScore,
    fundamental: fundamentalScore,
    sentiment: sentimentScore,
    macro: macroScore,
    options: optionsScore,
    revision: revisionScore,
    flow: flowScore,
    sentimentHasNews: sentiment.hasNews,
  });
  const bullishProbability = Number.isFinite(forecast?.bullishProbability)
    ? forecast.bullishProbability
    : clamp(12 + total * 0.78, 5, 95);
  const expectedReturn = Number.isFinite(forecast?.expectedReturn)
    ? forecast.expectedReturn
    : clamp((total - 50) * 0.55, -30, 35);
  const risk = calculateRiskLevel(total, analysis, research, forecast);
  state.overallContext = analysis
    ? {
        analysis,
        research,
        sentiment,
        factorModel,
        forecast,
        totalScore: total,
        alphaScore,
        fundamentalScore,
        sentimentScore,
        macroScore,
        optionsScore,
        relativeStrengthScore,
        revisionScore,
        flowScore,
        technicalScore,
        bullishProbability,
        expectedReturn,
        risk,
      }
    : null;

  renderNewsInsights(research, analysis, sentiment);
  renderVolumeFlow(analysis, research, currency);
  renderMultiFactor(analysis, research, factorModel);
  renderScenarioForecast(forecast);

  setScore(els.fundamentalScore, fundamental?.available ? fundamentalScore : NaN);
  setScore(els.sentimentScore, sentimentScore);
  setScore(els.macroScore, macro?.available ? macroScore : NaN);
  setScore(els.optionsScore, options?.available ? optionsScore : NaN);
  setScore(els.totalScore, analysis ? total : NaN);

  els.fundamentalScoreNote.textContent = fundamental?.available
    ? `ROIC ${formatPercent(fundamental.roic, 1)}`
    : "Loading";
  els.sentimentScoreNote.textContent = sentiment.hasTranscript
    ? "Call + news"
    : sentiment.hasNews
      ? "News proxy"
      : "Neutral";
  els.macroScoreNote.textContent = macro?.available
    ? `SPY ${formatPercent(macro.spyReturn, 1)}`
    : "Loading";
  els.optionsScoreNote.textContent = options?.available
    ? `${options.daysToExpiration}D chain`
    : "Loading";
  els.totalScoreNote.textContent = analysis
    ? forecast
      ? `Scenario conf. ${Math.round(forecast.confidence)}`
      : `Technical ${Math.round(technicalScore)}`
    : "Waiting";
  renderAlphaAndTrade(analysis, research, total, alphaScore);

  els.bullishProbability.textContent = analysis ? formatPercent(bullishProbability, 0).replace("+", "") : "--";
  els.expectedReturn.textContent = analysis ? formatPercent(expectedReturn, 1) : "--";
  els.riskLevel.textContent = analysis ? risk : "--";
  els.riskLevel.classList.remove("positive", "negative", "neutral");
  els.riskLevel.classList.add(risk === "Low" ? "positive" : risk === "High" ? "negative" : "neutral");

  els.callSentimentLabel.textContent = scoreLabel(sentimentScore, "Positive", "Mixed", "Negative");
  els.callSentimentLabel.classList.remove("positive", "negative", "neutral");
  els.callSentimentLabel.classList.add(toneForScore(sentimentScore));
  renderCallNlp(sentiment);
  els.sentimentDetails.replaceChildren(
    ...listItems([
      {
        tone: sentiment.hasTranscript ? "good" : "watch",
        text: sentiment.hasTranscript
          ? `Call NLP score ${Math.round(sentiment.callNlp.overallScore)} from ${sentiment.callNlp.wordCount} words.`
          : "Call NLP is neutral until transcript notes are added.",
      },
      {
        tone: sentiment.newsScore.score >= 60 ? "good" : sentiment.newsScore.score <= 45 ? "bad" : "watch",
        text: sentiment.hasNews
          ? `News tone ${Math.round(sentiment.newsScore.score)} from ${sentiment.headlineCount} headlines.`
          : "News tone unavailable.",
      },
      {
        tone: sentiment.callNlp.detectedSections > 0 ? "good" : "watch",
        text: sentiment.callNlp.detectedSections > 0
          ? `Detected ${sentiment.callNlp.detectedSections} speaker/section changes.`
          : "Speaker split not detected; use CEO, CFO, and Q&A headings for better section scoring.",
      },
    ]),
  );

  els.qualityLabel.textContent = fundamental?.available ? qualityLabel(fundamentalScore) : "--";
  els.qualityLabel.classList.remove("positive", "negative", "neutral");
  els.qualityLabel.classList.add(toneForScore(fundamentalScore));
  els.roicValue.textContent = formatPercent(fundamental?.roic, 1);
  els.fcfGrowthValue.textContent = formatPercent(fundamental?.fcfGrowth, 1);
  els.freeCashFlowValue.textContent = formatLargeMoney(fundamental?.freeCashFlow, currency);
  els.fcfCagrValue.textContent = formatPercent(fundamental?.fcfCagr, 1);

  els.optionsLabel.textContent = options?.available ? scoreLabel(optionsScore) : "--";
  els.optionsLabel.classList.remove("positive", "negative", "neutral");
  els.optionsLabel.classList.add(toneForScore(optionsScore));
  els.putCallOi.textContent = formatNumber(options?.putCallOpenInterest, 2);
  els.putCallVolume.textContent = formatNumber(options?.putCallVolume, 2);
  els.atmIv.textContent = Number.isFinite(options?.atmIv) ? formatPlainPercent(options.atmIv * 100, 1) : "--";
  els.gammaProxy.textContent = formatGex(options?.netGex);
  els.optionsMove.textContent = Number.isFinite(options?.impliedMove) && Number.isFinite(analysis?.last?.close)
    ? `${formatMoney(Math.max(0, analysis.last.close - options.impliedMove), currency)} - ${formatMoney(analysis.last.close + options.impliedMove, currency)}`
    : "--";

  if (state.researchError) {
    els.fundamentalScoreNote.textContent = state.researchError;
    els.optionsScoreNote.textContent = "Unavailable";
    els.macroScoreNote.textContent = "Unavailable";
  }
  renderAiNewsAnalysis();
}

function mapPoint(value, min, max, low, high) {
  if (max === min) return (low + high) / 2;
  return high - ((value - min) / (max - min)) * (high - low);
}

function pathFrom(values, points, xFor, yFor) {
  let path = "";
  let started = false;
  values.forEach((value, index) => {
    if (!Number.isFinite(value)) {
      started = false;
      return;
    }
    const command = started ? "L" : "M";
    path += `${command}${xFor(index).toFixed(2)} ${yFor(value).toFixed(2)} `;
    started = true;
  });
  return path.trim();
}

function placeChartLabels(labels, top, bottom, minGap = 18) {
  const sorted = labels
    .map((label) => ({ ...label, labelY: clamp(label.y, top + 12, bottom - 8) }))
    .sort((a, b) => a.labelY - b.labelY);

  for (let index = 1; index < sorted.length; index += 1) {
    sorted[index].labelY = Math.max(sorted[index].labelY, sorted[index - 1].labelY + minGap);
  }

  const overflow = sorted.length ? sorted.at(-1).labelY - (bottom - 8) : 0;
  if (overflow > 0) {
    sorted.at(-1).labelY -= overflow;
    for (let index = sorted.length - 2; index >= 0; index -= 1) {
      sorted[index].labelY = Math.min(sorted[index].labelY, sorted[index + 1].labelY - minGap);
    }
  }

  return Object.fromEntries(sorted.map((label) => [label.key, clamp(label.labelY, top + 12, bottom - 8)]));
}

function renderChart(data, analysis, tradePlan = null) {
  const svg = els.chart;
  const width = 920;
  const height = 430;
  const pad = { top: 22, right: 108, bottom: 52, left: 70 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const points = analysis.points;
  const closeValues = analysis.closes;
  const highValues = points.map((point) => point.high || point.close);
  const lowValues = points.map((point) => point.low || point.close);
  const tradeValues = tradePlan?.levels ? Object.values(tradePlan.levels).filter(Number.isFinite) : [];
  const allValues = [
    ...highValues,
    ...lowValues,
    ...analysis.ma20.filter(Number.isFinite),
    ...analysis.ema21.filter(Number.isFinite),
    ...analysis.ma50.filter(Number.isFinite),
    ...analysis.bb20.upper.filter(Number.isFinite),
    ...analysis.bb20.lower.filter(Number.isFinite),
    ...tradeValues,
  ];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const padding = Math.max((rawMax - rawMin) * 0.08, rawMax * 0.01);
  const min = rawMin - padding;
  const max = rawMax + padding;
  const xFor = (index) => pad.left + (index / Math.max(1, points.length - 1)) * plotW;
  const yFor = (value) => mapPoint(value, min, max, pad.top, pad.top + plotH);
  const volumeMax = Math.max(...points.map((point) => point.volume || 0), 1);
  const volumeH = 58;
  const volumeBase = pad.top + plotH;
  const candleW = Math.max(1, Math.min(8, (plotW / Math.max(1, points.length)) * 0.58));
  const grid = [];

  for (let index = 0; index <= 4; index += 1) {
    const value = min + ((max - min) * index) / 4;
    const y = yFor(value);
    grid.push(`
      <line class="grid" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"></line>
      <text class="axis-label" x="${width - pad.right + 12}" y="${y + 4}">${formatMoney(value, data.currency)}</text>
    `);
  }

  const labelIndexes = [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
    Math.min(points.length - 1, Math.round((points.length - 1) * ratio)),
  );
  const xLabels = labelIndexes.map((index) => {
    const x = xFor(index);
    return `<text class="axis-label date-label" x="${x}" y="${height - 18}">${formatDate(points[index].timestamp).replace(", 202", ", '2")}</text>`;
  });

  const closePath = pathFrom(closeValues, points, xFor, yFor);
  const ma20Path = pathFrom(analysis.ma20, points, xFor, yFor);
  const ema21Path = pathFrom(analysis.ema21, points, xFor, yFor);
  const ma50Path = pathFrom(analysis.ma50, points, xFor, yFor);
  const bbUpperPath = pathFrom(analysis.bb20.upper, points, xFor, yFor);
  const bbLowerPath = pathFrom(analysis.bb20.lower, points, xFor, yFor);
  const volumeBars = points
    .map((point, index) => {
      const x = xFor(index) - candleW / 2;
      const barH = ((point.volume || 0) / volumeMax) * volumeH;
      const direction = point.close >= (point.open || point.close) ? "up" : "down";
      return `<rect class="volume-bar ${direction}" x="${x.toFixed(2)}" y="${(volumeBase - barH).toFixed(2)}" width="${candleW.toFixed(2)}" height="${barH.toFixed(2)}"></rect>`;
    })
    .join("");
  const candles = points
    .map((point, index) => {
      const x = xFor(index);
      const open = point.open || point.close;
      const high = point.high || Math.max(open, point.close);
      const low = point.low || Math.min(open, point.close);
      const openY = yFor(open);
      const closeY = yFor(point.close);
      const highY = yFor(high);
      const lowY = yFor(low);
      const direction = point.close >= open ? "up" : "down";
      const bodyY = Math.min(openY, closeY);
      const bodyH = Math.max(1, Math.abs(closeY - openY));
      return `
        <line class="wick ${direction}" x1="${x.toFixed(2)}" y1="${highY.toFixed(2)}" x2="${x.toFixed(2)}" y2="${lowY.toFixed(2)}"></line>
        <rect class="candle ${direction}" x="${(x - candleW / 2).toFixed(2)}" y="${bodyY.toFixed(2)}" width="${candleW.toFixed(2)}" height="${bodyH.toFixed(2)}"></rect>
      `;
    })
    .join("");

  const tradeLayer = [];
  if (tradePlan?.levels) {
    const { buyLow, buyHigh, addTrigger, trimLow, trimHigh, stop } = tradePlan.levels;
    const buyY1 = yFor(buyHigh);
    const buyY2 = yFor(buyLow);
    const trimY1 = yFor(trimHigh);
    const trimY2 = yFor(trimLow);
    const addY = yFor(addTrigger);
    const stopY = yFor(stop);
    const labelY = placeChartLabels(
      [
        { key: "buy", y: Math.min(buyY1, buyY2) - 6 },
        { key: "sell", y: Math.min(trimY1, trimY2) - 6 },
        { key: "add", y: addY - 6 },
        { key: "stop", y: stopY - 6 },
      ],
      pad.top,
      pad.top + plotH,
    );
    tradeLayer.push(`
      <rect class="trade-band buy" x="${pad.left}" y="${Math.min(buyY1, buyY2)}" width="${plotW}" height="${Math.max(2, Math.abs(buyY2 - buyY1))}"></rect>
      <rect class="trade-band sell" x="${pad.left}" y="${Math.min(trimY1, trimY2)}" width="${plotW}" height="${Math.max(2, Math.abs(trimY2 - trimY1))}"></rect>
      <line class="trade-line add" x1="${pad.left}" y1="${addY}" x2="${width - pad.right}" y2="${addY}"></line>
      <line class="trade-line stop" x1="${pad.left}" y1="${stopY}" x2="${width - pad.right}" y2="${stopY}"></line>
      <line class="label-guide buy" x1="${width - pad.right - 8}" y1="${Math.min(buyY1, buyY2)}" x2="${width - pad.right - 48}" y2="${labelY.buy}"></line>
      <line class="label-guide sell" x1="${width - pad.right - 8}" y1="${Math.min(trimY1, trimY2)}" x2="${width - pad.right - 48}" y2="${labelY.sell}"></line>
      <line class="label-guide add" x1="${width - pad.right - 8}" y1="${addY}" x2="${width - pad.right - 48}" y2="${labelY.add}"></line>
      <line class="label-guide stop" x1="${width - pad.right - 8}" y1="${stopY}" x2="${width - pad.right - 48}" y2="${labelY.stop}"></line>
      <text class="trade-label buy" x="${width - pad.right - 8}" y="${labelY.buy}">Buy zone</text>
      <text class="trade-label sell" x="${width - pad.right - 8}" y="${labelY.sell}">Trim / sell</text>
      <text class="trade-label add" x="${width - pad.right - 8}" y="${labelY.add}">Add</text>
      <text class="trade-label stop" x="${width - pad.right - 8}" y="${labelY.stop}">Stop</text>
    `);
  }

  const supportPoint = points[analysis.supportIndex];
  const resistancePoint = points[analysis.resistanceIndex];
  const supportEdge = xFor(analysis.supportIndex) > pad.left + plotW * 0.82;
  const resistanceEdge = xFor(analysis.resistanceIndex) > pad.left + plotW * 0.82;
  const supportMarker = supportPoint
    ? `<g class="point-marker buy" transform="translate(${xFor(analysis.supportIndex).toFixed(2)} ${yFor(supportPoint.low || supportPoint.close).toFixed(2)})"><path d="M0 -12 L8 4 L-8 4 Z"></path><text class="${supportEdge ? "edge" : ""}" x="${supportEdge ? -12 : 0}" y="-18">Buy ${formatShortDate(supportPoint.timestamp)}</text></g>`
    : "";
  const resistanceMarker = resistancePoint
    ? `<g class="point-marker sell" transform="translate(${xFor(analysis.resistanceIndex).toFixed(2)} ${yFor(resistancePoint.high || resistancePoint.close).toFixed(2)})"><path d="M0 12 L8 -4 L-8 -4 Z"></path><text class="${resistanceEdge ? "edge" : ""}" x="${resistanceEdge ? -12 : 0}" y="30">Sell ${formatShortDate(resistancePoint.timestamp)}</text></g>`
    : "";

  svg.innerHTML = `
    <rect class="plot-bg" x="${pad.left}" y="${pad.top}" width="${plotW}" height="${plotH}"></rect>
    ${tradeLayer.join("")}
    ${volumeBars}
    ${grid.join("")}
    ${xLabels.join("")}
    <path class="bb-line" d="${bbUpperPath}"></path>
    <path class="bb-line" d="${bbLowerPath}"></path>
    ${candles}
    <path class="ma20-line" d="${ma20Path}"></path>
    <path class="ema21-line" d="${ema21Path}"></path>
    <path class="ma50-line" d="${ma50Path}"></path>
    <path class="close-line" d="${closePath}"></path>
    ${supportMarker}
    ${resistanceMarker}
    <line class="hover-line" id="hoverLine" x1="0" y1="${pad.top}" x2="0" y2="${pad.top + plotH}" hidden></line>
    <circle class="hover-dot" id="hoverDot" cx="0" cy="0" r="5" hidden></circle>
  `;

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
    .plot-bg { fill: #fbfcfd; }
    .grid { stroke: #dce4ea; stroke-width: 1; }
    .axis-label { fill: #63717e; font: 700 12px Inter, system-ui, sans-serif; }
    .date-label { text-anchor: middle; }
    .volume-bar { opacity: .18; }
    .volume-bar.up { fill: #12805c; }
    .volume-bar.down { fill: #ba3b46; }
    .wick { stroke-width: 1.2; }
    .wick.up, .candle.up { stroke: #12805c; fill: #16a06f; }
    .wick.down, .candle.down { stroke: #ba3b46; fill: #d94d59; }
    .close-line { fill: none; stroke: #1e6bd6; stroke-width: 1.5; stroke-linecap: round; opacity: .55; }
    .ma20-line { fill: none; stroke: #0e8a9d; stroke-width: 2; stroke-linecap: round; }
    .ema21-line { fill: none; stroke: #7c3aed; stroke-width: 1.8; stroke-linecap: round; }
    .ma50-line { fill: none; stroke: #b7791f; stroke-width: 2; stroke-linecap: round; }
    .bb-line { fill: none; stroke: #8a98a8; stroke-width: 1.2; stroke-dasharray: 5 5; opacity: .7; }
    .trade-band.buy { fill: #12805c; opacity: .1; }
    .trade-band.sell { fill: #ba3b46; opacity: .09; }
    .trade-line { stroke-width: 1.6; stroke-dasharray: 6 5; }
    .trade-line.add { stroke: #1e6bd6; }
    .trade-line.stop { stroke: #ba3b46; }
    .label-guide { stroke-width: 1; stroke-dasharray: 2 3; opacity: .45; }
    .label-guide.buy { stroke: #12805c; }
    .label-guide.sell, .label-guide.stop { stroke: #ba3b46; }
    .label-guide.add { stroke: #1e6bd6; }
    .trade-label { font: 800 11px Inter, system-ui, sans-serif; text-anchor: end; paint-order: stroke; stroke: #fbfcfd; stroke-width: 4px; stroke-linejoin: round; }
    .trade-label.buy { fill: #12805c; }
    .trade-label.sell, .trade-label.stop { fill: #ba3b46; }
    .trade-label.add { fill: #1e6bd6; }
    .point-marker path { stroke: #ffffff; stroke-width: 1.5; }
    .point-marker.buy path { fill: #12805c; }
    .point-marker.sell path { fill: #ba3b46; }
    .point-marker text { font: 800 11px Inter, system-ui, sans-serif; text-anchor: middle; paint-order: stroke; stroke: #ffffff; stroke-width: 4px; stroke-linejoin: round; }
    .point-marker text.edge { text-anchor: end; }
    .point-marker.buy text { fill: #12805c; }
    .point-marker.sell text { fill: #ba3b46; }
    .hover-line { stroke: #17212b; stroke-width: 1; stroke-dasharray: 4 4; opacity: .45; }
    .hover-dot { fill: #ffffff; stroke: #1e6bd6; stroke-width: 3; }
  `;
  svg.appendChild(style);

  svg.onpointermove = (event) => {
    const rect = svg.getBoundingClientRect();
    const scaleX = width / rect.width;
    const x = (event.clientX - rect.left) * scaleX;
    const index = Math.max(
      0,
      Math.min(points.length - 1, Math.round(((x - pad.left) / plotW) * (points.length - 1))),
    );
    const point = points[index];
    const line = svg.querySelector("#hoverLine");
    const dot = svg.querySelector("#hoverDot");
    const px = xFor(index);
    const py = yFor(point.close);
    line.setAttribute("x1", px);
    line.setAttribute("x2", px);
    dot.setAttribute("cx", px);
    dot.setAttribute("cy", py);
    line.removeAttribute("hidden");
    dot.removeAttribute("hidden");

    els.tooltip.hidden = false;
    els.tooltip.innerHTML = `
      <strong>${formatDate(point.timestamp)}</strong>
      O: ${formatMoney(point.open, data.currency)} H: ${formatMoney(point.high, data.currency)}<br>
      L: ${formatMoney(point.low, data.currency)} C: ${formatMoney(point.close, data.currency)}<br>
      SMA20: ${formatMoney(analysis.ma20[index], data.currency)} / EMA21: ${formatMoney(analysis.ema21[index], data.currency)}<br>
      MACD hist: ${Number.isFinite(analysis.macd.histogram[index]) ? analysis.macd.histogram[index].toFixed(2) : "--"}<br>
      Volume: ${formatCompact(point.volume)}
    `;
    const left = Math.min(rect.width - 156, Math.max(8, event.clientX - rect.left + 14));
    const top = Math.min(rect.height - 86, Math.max(8, event.clientY - rect.top + 12));
    els.tooltip.style.left = `${left}px`;
    els.tooltip.style.top = `${top}px`;
  };

  svg.onpointerleave = () => {
    const line = svg.querySelector("#hoverLine");
    const dot = svg.querySelector("#hoverDot");
    if (line) line.setAttribute("hidden", "");
    if (dot) dot.setAttribute("hidden", "");
    els.tooltip.hidden = true;
  };
}

function syncRangeButtons() {
  for (const button of els.rangeControls.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.range === state.range);
  }
}

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const symbol = normalizeSymbol(els.input.value);
  if (!symbol) return;
  state.symbol = symbol;
  hideSearchHistory();
  loadStock();
});

els.input.addEventListener("focus", () => {
  state.searchHistoryOpen = true;
  renderSearchHistory();
});

els.input.addEventListener("click", () => {
  state.searchHistoryOpen = true;
  renderSearchHistory();
});

els.input.addEventListener("input", () => {
  state.searchHistoryOpen = true;
  renderSearchHistory();
});

els.input.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideSearchHistory();
  }
});

els.searchHistory.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-symbol]");
  if (!button) return;
  state.symbol = button.dataset.symbol;
  els.input.value = state.symbol;
  hideSearchHistory();
  loadStock();
});

document.addEventListener("pointerdown", (event) => {
  if (!els.form.contains(event.target)) {
    hideSearchHistory();
  }
});

els.rangeControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-range]");
  if (!button) return;
  state.range = button.dataset.range;
  syncRangeButtons();
  loadStock();
});

els.authForm.addEventListener("submit", submitAuth);

els.authSwitch.addEventListener("click", () => {
  setAuthMode(authMode === "login" ? "signup" : "login");
});

els.logoutButton.addEventListener("click", () => {
  logout();
});

els.transcriptInput.addEventListener("input", () => {
  queueTranscriptSave();
  renderResearch();
});

els.alertEmail.addEventListener("input", () => {
  localStorage.setItem("stocklens-alert-email", els.alertEmail.value.trim());
  saveUserSettings({ alertEmail: els.alertEmail.value.trim() });
});

els.autoEmailToggle.addEventListener("change", () => {
  localStorage.setItem("stocklens-auto-email-draft", els.autoEmailToggle.checked ? "true" : "false");
  saveUserSettings({ autoEmailDraft: els.autoEmailToggle.checked });
});

els.emailAlertButton.addEventListener("click", () => {
  openEmailDraft();
});

els.refreshButton.addEventListener("click", () => {
  loadStock();
});

if (els.openaiKeySave) {
  els.openaiKeySave.addEventListener("click", () => {
    saveOpenAiKeyFromUi();
  });
}

if (els.openaiKeyClear) {
  els.openaiKeyClear.addEventListener("click", () => {
    clearOpenAiKeyFromUi();
  });
}

if (els.openaiKeyInput) {
  els.openaiKeyInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveOpenAiKeyFromUi();
    }
  });
}

els.input.value = state.symbol;
setAuthMode("login");
refreshAuthStatus();
