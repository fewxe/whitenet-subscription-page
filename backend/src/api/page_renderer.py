import base64
import json
from pathlib import Path

from loguru import logger

from src.api.mappers import to_subscription_info_out
from src.domain.models import SubscriptionInfo


class PageRenderer:
    def __init__(self, index_path: Path) -> None:
        self._index_path = index_path
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

        script = f"<script>window.__PANEL_DATA__ = {json.dumps(panel_data)};</script>"
        return template.replace("</head>", f"{script}\n</head>", 1)
