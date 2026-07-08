from pydantic import BaseModel

from src.domain.models import TrafficLimitStrategy, UserStatus
from src.domain.value_objects import ShortUuid


class SubscriptionUserOut(BaseModel):
    short_uuid: ShortUuid
    username: str

    days_left: int
    is_active: bool

    user_status: UserStatus
    expires_at: str

    traffic_used: str
    traffic_limit: str

    traffic_used_bytes: int
    traffic_limit_bytes: int

    lifetime_traffic_used: str
    lifetime_traffic_used_bytes: int

    traffic_limit_strategy: TrafficLimitStrategy


class SubscriptionInfoOut(BaseModel):
    user: SubscriptionUserOut | None
    links: list[str]
    subscription_url: str | None
