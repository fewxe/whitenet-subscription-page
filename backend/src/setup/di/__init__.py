from dishka import Provider

from src.setup.di.providers import AppConfigProvider, GatewayProvider, HttpClientProvider, UseCaseProvider


def get_providers() -> list[Provider]:
    return [
        AppConfigProvider(),
        HttpClientProvider(),
        GatewayProvider(),
        UseCaseProvider(),
    ]
