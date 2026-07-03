from collections.abc import AsyncIterable

import httpx
from dishka import Provider, Scope, provide, provide_all

from src.api.page_renderer import PageRenderer
from src.application.ports import SubscriptionGateway
from src.application.use_cases import GetSubscription, GetSubscriptionInfo
from src.infrastructure.remnawave_gateway import RemnawaveGateway
from src.setup.config import AppConfig, config


class HttpClientProvider(Provider):
    scope = Scope.APP

    @provide
    async def http_client(self, config: AppConfig) -> AsyncIterable[httpx.AsyncClient]:
        async with httpx.AsyncClient(
            base_url=str(config.remnawave_panel_url),
            timeout=10,
        ) as client:
            yield client


class GatewayProvider(Provider):
    scope = Scope.APP

    gateway = provide(RemnawaveGateway, provides=SubscriptionGateway)


class UseCaseProvider(Provider):
    scope = Scope.APP

    use_cases = provide_all(
        GetSubscriptionInfo,
        GetSubscription,
    )


class AppConfigProvider(Provider):
    scope = Scope.APP

    @provide
    def config(self) -> AppConfig:
        return config


class PageRendererProvider(Provider):
    scope = Scope.APP

    page_renderer = provide(PageRenderer)
