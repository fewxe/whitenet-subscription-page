from dishka import make_async_container
from dishka.integrations.fastapi import setup_dishka
from fastapi import FastAPI

from src.api import get_routers
from src.api.middlewares import no_robots_middleware
from src.setup.config import config
from src.setup.di import get_providers
from src.setup.logging import setup_logger

setup_logger(config)

container = make_async_container(*get_providers())


def get_app() -> FastAPI:
    fastapi_app = FastAPI(
        docs_url="/docs" if config.debug else None,
        redoc_url="/redoc" if config.debug else None,
        openapi_url="/openapi.json" if config.debug else None,
    )
    fastapi_app.middleware("http")(no_robots_middleware)
    fastapi_app.include_router(*get_routers())
    setup_dishka(container, fastapi_app)

    return fastapi_app


app = get_app()
