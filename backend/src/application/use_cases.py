from loguru import logger

from src.application.dto import RawSubscriptionPayload
from src.application.ports import SubscriptionGateway
from src.domain.exceptions import (
    SubscriptionNotFoundError,
    SubscriptionProviderResponseError,
    SubscriptionProviderUnavailableError,
)
from src.domain.models import SubscriptionInfo
from src.domain.services import is_browser
from src.setup.config import AppConfig


class GetSubscriptionInfo:
    def __init__(self, gateway: SubscriptionGateway):
        self.gateway = gateway

    async def execute(self, short_uuid: str) -> SubscriptionInfo:
        try:
            info = await self.gateway.fetch_info(short_uuid)
        except (SubscriptionProviderUnavailableError, SubscriptionProviderResponseError):
            logger.error(f"Failed to get subscription info for short_uuid={short_uuid}")
            raise

        if not info.is_found:
            logger.info(f"Subscription not found: short_uuid={short_uuid}")
            raise SubscriptionNotFoundError(short_uuid)

        return info


class ResolveEntrypoint:
    def __init__(self, gateway: SubscriptionGateway, settings: AppConfig):
        self.gateway = gateway
        self.frontend_base_url = settings.frontend_base_url

    async def execute(
        self, short_uuid: str, headers: dict[str, str]
    ) -> str | RawSubscriptionPayload:

        if is_browser(headers.get("user-agent", "")):
            logger.debug(f"Browser request for short_uuid={short_uuid}, redirecting to frontend")
            return f"{self.frontend_base_url}/{short_uuid}"

        logger.info(
            f"Subscription requested: short_uuid={short_uuid}, "
            f"ip={headers.get('x-remnawave-real-ip', '-')}, "
            f"user_agent={headers.get('user-agent', '-')}, "
            f"hwid={headers.get('x-hwid', '-')}, "
            f"device_os={headers.get('x-device-os', '-')}, "
            f"device_model={headers.get('x-device-model', '-')}"
        )
        try:
            return await self.gateway.fetch_subscription(short_uuid, headers=headers)
        except SubscriptionProviderUnavailableError:
            logger.error(
                f"Provider unavailable while proxying subscription for short_uuid={short_uuid}"
            )
            raise
