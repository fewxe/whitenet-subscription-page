from dataclasses import dataclass
from enum import Enum, auto
from typing import Any

from src.domain.value_objects import ShortUuid


class UpperStrEnum(str, Enum):
    @staticmethod
    def _generate_next_value_(name: str, start: int, count: int, last_values: list[Any]) -> str:
        return name


class UserStatus(UpperStrEnum):
    ACTIVE = auto()
    DISABLED = auto()
    LIMITED = auto()
    EXPIRED = auto()


class TrafficLimitStrategy(UpperStrEnum):
    NO_RESET = auto()
    DAY = auto()
    WEEK = auto()
    MONTH = auto()
    MONTH_ROLLING = auto()


@dataclass(frozen=True, slots=True)
class SubscriptionUser:
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


@dataclass(frozen=True, slots=True)
class SubscriptionInfo:
    is_found: bool
    user: SubscriptionUser | None
    links: list[str]
    subscription_url: str | None
