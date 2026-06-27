from pydantic import BaseModel


class SubscriptionUserOut(BaseModel):
    username: str
    days_left: int
    is_active: bool
    user_status: str
    expires_at: str
    traffic_used: str
    traffic_limit: str
    traffic_used_bytes: int
    traffic_limit_bytes: int


class SubscriptionInfoOut(BaseModel):
    user: SubscriptionUserOut | None
    links: list[str]
    subscription_url: str | None
