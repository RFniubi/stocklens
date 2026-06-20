FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY static ./static

ENV HOST=0.0.0.0
ENV PORT=8000
ENV STOCKLENS_DB_PATH=/data/stocklens.sqlite3

RUN mkdir -p /data

EXPOSE 8000

CMD ["python", "main.py"]

