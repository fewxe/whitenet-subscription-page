from pathlib import Path

from dotenv import find_dotenv
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent

FRONTEND_DIR = PROJECT_ROOT / "frontend"


class AppConfig(BaseSettings):
    app_port: int = 3010
    remnawave_panel_url: AnyHttpUrl
    sub_prefix: str = ""
    debug: bool = True

    frontend_index_path: Path = Path("index.html")
    frontend_assets_path: Path = Path("assets")

    @property
    def frontend_index(self) -> Path:
        return FRONTEND_DIR / self.frontend_index_path

    @property
    def frontend_assets(self) -> Path:
        return FRONTEND_DIR / self.frontend_assets_path

    support_url: AnyHttpUrl
    redirect_base_url: AnyHttpUrl

    model_config = SettingsConfigDict(
        env_file=find_dotenv(),
        env_file_encoding="utf-8",
    )


config = AppConfig()
