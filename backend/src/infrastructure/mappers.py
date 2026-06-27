from typing import Any

from loguru import logger

from src.domain.exceptions import SubscriptionProviderResponseError
from src.domain.models import SubscriptionInfo, SubscriptionUser, TrafficLimitStrategy, UserStatus


def parse_subscription_info(payload: dict[str, Any], short_uuid: str) -> SubscriptionInfo:
    try:
        data = payload["response"]
        raw_user = data.get("user")

        user: SubscriptionUser | None = None
        if raw_user:
            user = SubscriptionUser(
                short_uuid=raw_user["shortUuid"],
                username=raw_user["username"],
                days_left=raw_user["daysLeft"],
                is_active=raw_user["isActive"],
                user_status=UserStatus(raw_user["userStatus"]),
                expires_at=raw_user["expiresAt"],
                traffic_used=raw_user["trafficUsed"],
                traffic_limit=raw_user["trafficLimit"],
                traffic_used_bytes=int(raw_user["trafficUsedBytes"]),
                traffic_limit_bytes=int(raw_user["trafficLimitBytes"]),
                lifetime_traffic_used=raw_user["lifetimeTrafficUsed"],
                lifetime_traffic_used_bytes=int(raw_user["lifetimeTrafficUsedBytes"]),
                traffic_limit_strategy=TrafficLimitStrategy(raw_user["trafficLimitStrategy"]),
            )

        return SubscriptionInfo(
            is_found=data["isFound"],
            user=user,
            links=data.get("links", []),
            subscription_url=data.get("subscriptionUrl"),
        )
    except (KeyError, ValueError, TypeError) as exc:
        logger.error(
            f"Malformed subscription info payload for short_uuid={short_uuid}: {exc}, payload={payload!r}"
        )
        raise SubscriptionProviderResponseError(short_uuid, f"malformed payload: {exc}") from exc
