from fastapi import APIRouter

from src.api.router import router


def get_routers() -> tuple[APIRouter]:
    return (
        router,
    )
