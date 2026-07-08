import json

import httpx
from loguru import logger

from src.application.dto import RawSubscriptionPayload
from src.domain.exceptions import (
    SubscriptionProviderResponseError,
    SubscriptionProviderUnavailableError,
)
from src.domain.models import SubscriptionInfo
from src.domain.value_objects import ShortUuid
from src.infrastructure.mappers import parse_subscription_info
from src.setup.config import AppConfig

_PASSTHROUGH_HEADERS = (
    "subscription-userinfo",
    "profile-update-interval",
    "profile-title",
    "profile-web-page-url",
    "support-url",
)


class RemnawaveGateway:
    def __init__(self, http_client: httpx.AsyncClient, settings: AppConfig):
        self._http = http_client
        self._settings = settings

    async def fetch_info(self, short_uuid: ShortUuid) -> SubscriptionInfo:
        logger.debug(f"Fetching subscription info for short_uuid={short_uuid}")

        try:
            r = await self._http.get(f"/api/sub/{short_uuid}/info")
            r.raise_for_status()
            payload = r.json()
        except httpx.TimeoutException as exc:
            logger.warning(f"Timeout fetching info for short_uuid={short_uuid}: {exc}")
            raise SubscriptionProviderUnavailableError(short_uuid, "timeout") from exc
        except httpx.HTTPStatusError as exc:
            logger.warning(f"Remnawave returned {exc.response.status_code} for info, short_uuid={short_uuid}")
            raise SubscriptionProviderResponseError(short_uuid, f"status {exc.response.status_code}") from exc
        except httpx.HTTPError as exc:
            logger.error(f"Network error fetching info for short_uuid={short_uuid}: {exc}")
            raise SubscriptionProviderUnavailableError(short_uuid, str(exc)) from exc
        except json.JSONDecodeError as exc:
            logger.error(f"Invalid JSON from remnawave for short_uuid={short_uuid}: body={r.text!r}")
            raise SubscriptionProviderResponseError(short_uuid, "invalid JSON response") from exc

        return parse_subscription_info(payload, short_uuid)

    async def fetch_subscription(
        self,
        short_uuid: ShortUuid,
        *,
        headers: dict[str, str] | None = None,
    ) -> RawSubscriptionPayload:
        logger.debug(f"Proxying subscription request for short_uuid={short_uuid}, headers={headers}")

        try:
            r = await self._http.get(f"/api/sub/{short_uuid}", headers=headers or {})
        except httpx.TimeoutException as exc:
            logger.warning(f"Timeout proxying subscription for short_uuid={short_uuid}: {exc}")
            raise SubscriptionProviderUnavailableError(short_uuid, "timeout") from exc
        except httpx.HTTPError as exc:
            logger.error(f"Network error proxying subscription for short_uuid={short_uuid}: {exc}")
            raise SubscriptionProviderUnavailableError(short_uuid, str(exc)) from exc

        if r.status_code >= 400:
            logger.warning(
                f"Remnawave returned {r.status_code} proxying subscription, short_uuid={short_uuid}"
            )

        return self._to_payload(r)

    @staticmethod
    def _to_payload(r: httpx.Response) -> RawSubscriptionPayload:
        return RawSubscriptionPayload(
            content=r.content,
            content_type=r.headers.get("content-type", "application/octet-stream"),
            status_code=r.status_code,
            extra_headers={k: v for k, v in r.headers.items() if k.lower() in _PASSTHROUGH_HEADERS},
        )
