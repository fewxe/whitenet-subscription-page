import base64
import json

from loguru import logger

from src.api.mappers import to_subscription_info_out
from src.domain.models import SubscriptionInfo
from src.setup.config import AppConfig


class PageRenderer:
    def __init__(self, config: AppConfig) -> None:
        self._index_path = config.frontend_index
        self._page_config = {
            "supportUrl": str(config.support_url),
            "subscriptionUrl": str(config.redirect_base_url),
        }
        self._template: str | None = None

    def _load_template(self) -> str:
        if self._template is None:
            try:
                self._template = self._index_path.read_text(encoding="utf-8")
            except FileNotFoundError:
                logger.error(f"Frontend index.html not found at {self._index_path}")
                raise
        return self._template

    def render(self, info: SubscriptionInfo | None) -> str:
        try:
            template = self._load_template()
        except FileNotFoundError:
            return "<html><body>Service temporarily unavailable</body></html>"

        panel_data = None
        if info is not None:
            panel_data = base64.b64encode(
                json.dumps(to_subscription_info_out(info).model_dump()).encode()
            ).decode()

        script = (
            f"<script>"
            f"window.__PANEL_DATA__ = {json.dumps(panel_data)};"
            f"window.__PAGE_CONFIG__ = {json.dumps(self._page_config)};"
            f"</script>"
        )
        return template.replace("</head>", f"{script}\n</head>", 1)
