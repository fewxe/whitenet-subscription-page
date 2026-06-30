FROM python:3.13-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY backend/pyproject.toml backend/uv.lock ./backend/

WORKDIR /app/backend
RUN uv sync --frozen --no-dev

WORKDIR /app
COPY frontend ./frontend

COPY backend ./backend

ENV PATH="/app/backend/.venv/bin:$PATH"

WORKDIR /app/backend

CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${APP_PORT}"]
