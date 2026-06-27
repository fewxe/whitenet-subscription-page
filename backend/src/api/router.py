from dishka.integrations.fastapi import DishkaRoute, FromDishka
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import PlainTextResponse, RedirectResponse, Response
from loguru import logger

from src.api.mappers import to_subscription_info_out
from src.api.schemas import SubscriptionInfoOut
from src.application.dto import RawSubscriptionPayload
from src.application.use_cases import GetSubscriptionInfo, ResolveEntrypoint
from src.domain.exceptions import (
    SubscriptionNotFoundError,
    SubscriptionProviderResponseError,
    SubscriptionProviderUnavailableError,
)
from src.domain.services import extract_client_ip, filter_forwarded_headers

router = APIRouter(route_class=DishkaRoute)


@router.get("/robots.txt", include_in_schema=False)
async def robots_txt() -> PlainTextResponse:
    return PlainTextResponse("User-agent: *\nDisallow: /\n")


@router.get("/{short_uuid}", response_model=None)
async def entrypoint(
    short_uuid: str,
    request: Request,
    use_case: FromDishka[ResolveEntrypoint],
) -> RedirectResponse | Response:
    raw_headers = dict(request.headers)
    headers = filter_forwarded_headers(raw_headers)
    client_ip = extract_client_ip(
        request.client.host if request.client else None,
        raw_headers,
    )
    headers["x-remnawave-real-ip"] = client_ip

    try:
        result = await use_case.execute(short_uuid, headers)
    except SubscriptionProviderUnavailableError as exc:
        logger.error(
            f"Entrypoint failed, provider unavailable: short_uuid={short_uuid}, reason={exc.reason}"
        )
        raise HTTPException(status_code=503, detail="Subscription provider is unavailable") from exc
    except SubscriptionProviderResponseError as exc:
        logger.error(
            f"Entrypoint failed, bad provider response: short_uuid={short_uuid}, reason={exc.reason}"
        )
        raise HTTPException(
            status_code=502, detail="Subscription provider returned an invalid response"
        ) from exc

    if isinstance(result, str):
        return RedirectResponse(url=result, status_code=302)
    return _to_response(result)


@router.get("/api/sub/{short_uuid}/info", response_model=SubscriptionInfoOut)
async def info(short_uuid: str, use_case: FromDishka[GetSubscriptionInfo]) -> SubscriptionInfoOut:
    try:
        result = await use_case.execute(short_uuid)
    except SubscriptionNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Subscription not found") from exc
    except SubscriptionProviderUnavailableError as exc:
        logger.error(
            f"Info request failed, provider unavailable: short_uuid={short_uuid}, reason={exc.reason}"
        )
        raise HTTPException(status_code=503, detail="Subscription provider is unavailable") from exc
    except SubscriptionProviderResponseError as exc:
        logger.error(
            f"Info request failed, bad provider response: short_uuid={short_uuid}, reason={exc.reason}"
        )
        raise HTTPException(
            status_code=502, detail="Subscription provider returned an invalid response"
        ) from exc

    return to_subscription_info_out(result)


def _to_response(payload: RawSubscriptionPayload) -> Response:
    return Response(
        content=payload.content,
        status_code=payload.status_code,
        media_type=payload.content_type,
        headers=payload.extra_headers,
    )
