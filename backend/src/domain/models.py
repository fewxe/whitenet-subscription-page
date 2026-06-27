import enum
from dataclasses import dataclass


class UserStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    DISABLED = "DISABLED"
    LIMITED = "LIMITED"
    EXPIRED = "EXPIRED"


@dataclass(frozen=True, slots=True)
class SubscriptionUser:
    username: str
    days_left: int
    is_active: bool
    user_status: UserStatus
    expires_at: str
    traffic_used: str
    traffic_limit: str
    traffic_used_bytes: int
    traffic_limit_bytes: int


@dataclass(frozen=True, slots=True)
class SubscriptionInfo:
    is_found: bool
    user: SubscriptionUser | None
    links: list[str]
    subscription_url: str | None
