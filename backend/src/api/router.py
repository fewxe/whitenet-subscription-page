from dishka.integrations.fastapi import DishkaRoute, FromDishka
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse, PlainTextResponse, Response
from loguru import logger

from src.api.page_renderer import PageRenderer
from src.application.dto import RawSubscriptionPayload
from src.application.use_cases import GetSubscription, GetSubscriptionInfo
from src.domain.exceptions import (
    SubscriptionNotFoundError,
    SubscriptionProviderResponseError,
    SubscriptionProviderUnavailableError,
)
from src.domain.services import extract_client_ip, filter_forwarded_headers, is_vpn_client

router = APIRouter(route_class=DishkaRoute)


@router.get("/robots.txt", include_in_schema=False)
async def robots_txt() -> PlainTextResponse:
    return PlainTextResponse("User-agent: *\nDisallow: /\n")


@router.get("/{short_uuid}", response_model=None)
async def entrypoint(
    short_uuid: str,
    request: Request,
    subscription_use_case: FromDishka[GetSubscription],
    info_use_case: FromDishka[GetSubscriptionInfo],
    renderer: FromDishka[PageRenderer],
) -> HTMLResponse | Response:
    raw_headers = dict(request.headers)
    headers = filter_forwarded_headers(raw_headers)

    if not is_vpn_client(headers.get("user-agent", "")):
        logger.debug(f"Browser request for short_uuid={short_uuid}")
        info = None
        try:
            info = await info_use_case.execute(short_uuid)
        except SubscriptionNotFoundError:
            pass
        except (SubscriptionProviderUnavailableError, SubscriptionProviderResponseError) as exc:
            logger.error(f"Failed to fetch subscription info for short_uuid={short_uuid}: {exc}")
        return HTMLResponse(content=renderer.render(info))

    client_ip = extract_client_ip(request.client.host if request.client else None, raw_headers)
    headers["x-remnawave-real-ip"] = client_ip

    try:
        result = await subscription_use_case.execute(short_uuid, headers)
    except SubscriptionProviderUnavailableError as exc:
        logger.error(f"Provider unavailable: short_uuid={short_uuid}, reason={exc.reason}")
        raise HTTPException(status_code=503, detail="Subscription provider is unavailable") from exc
    except SubscriptionProviderResponseError as exc:
        logger.error(f"Bad provider response: short_uuid={short_uuid}, reason={exc.reason}")
        raise HTTPException(
            status_code=502, detail="Subscription provider returned an invalid response"
        ) from exc

    return _to_response(result)


def _to_response(payload: RawSubscriptionPayload) -> Response:
    return Response(
        content=payload.content,
        status_code=payload.status_code,
        media_type=payload.content_type,
        headers=payload.extra_headers,
    )
