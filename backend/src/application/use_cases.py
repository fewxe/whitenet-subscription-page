from loguru import logger

from src.application.dto import RawSubscriptionPayload
from src.application.ports import SubscriptionGateway
from src.domain.exceptions import (
    SubscriptionNotFoundError,
    SubscriptionProviderResponseError,
    SubscriptionProviderUnavailableError,
)
from src.domain.models import SubscriptionInfo


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


class GetSubscription:
    def __init__(self, gateway: SubscriptionGateway):
        self.gateway = gateway

    async def execute(self, short_uuid: str, headers: dict[str, str]) -> RawSubscriptionPayload:
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
            logger.error(f"Provider unavailable while proxying subscription for short_uuid={short_uuid}")
            raise
