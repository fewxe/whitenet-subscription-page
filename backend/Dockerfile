FROM python:3.13-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY . .

RUN uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:$PATH"

CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${APP_PORT}"]
