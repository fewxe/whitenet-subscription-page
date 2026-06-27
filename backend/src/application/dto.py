from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class RawSubscriptionPayload:
    content: bytes
    content_type: str
    status_code: int
    extra_headers: dict[str, str]
