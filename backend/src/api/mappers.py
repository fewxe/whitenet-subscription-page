from src.api.schemas import SubscriptionInfoOut, SubscriptionUserOut
from src.domain.models import SubscriptionInfo, SubscriptionUser


def to_subscription_user_out(user: SubscriptionUser) -> SubscriptionUserOut:
    return SubscriptionUserOut(
        short_uuid=user.short_uuid,
        username=user.username,
        days_left=user.days_left,
        is_active=user.is_active,
        user_status=user.user_status,
        expires_at=user.expires_at,
        traffic_used=user.traffic_used,
        traffic_limit=user.traffic_limit,
        traffic_used_bytes=user.traffic_used_bytes,
        traffic_limit_bytes=user.traffic_limit_bytes,
        lifetime_traffic_used=user.lifetime_traffic_used,
        lifetime_traffic_used_bytes=user.lifetime_traffic_used_bytes,
        traffic_limit_strategy=user.traffic_limit_strategy,
    )


def to_subscription_info_out(info: SubscriptionInfo) -> SubscriptionInfoOut:
    return SubscriptionInfoOut(
        user=to_subscription_user_out(info.user) if info.user else None,
        links=info.links,
        subscription_url=info.subscription_url,
    )
