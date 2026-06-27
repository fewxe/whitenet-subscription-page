from dotenv import find_dotenv
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppConfig(BaseSettings):
    app_port: int = 3010
    remnawave_panel_url: AnyHttpUrl
    frontend_base_url: AnyHttpUrl
    sub_prefix: str = ""
    debug: bool = True

    @property
    def normalized_sub_prefix(self) -> str:
        return self.sub_prefix.strip("/")

    model_config = SettingsConfigDict(
        env_file=find_dotenv(),
        env_file_encoding="utf-8",
    )


config = AppConfig()
