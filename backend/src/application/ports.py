from typing import Protocol

from src.application.dto import RawSubscriptionPayload
from src.domain.models import SubscriptionInfo


class SubscriptionGateway(Protocol):
    async def fetch_info(self, short_uuid: str) -> SubscriptionInfo: ...

    async def fetch_subscription(
        self,
        short_uuid: str,
        *,
        client_type: str | None = None,
        headers: dict[str, str] | None = None,
    ) -> RawSubscriptionPayload: ...
