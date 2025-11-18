from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BASE_DIR / '.env'

class Settings(BaseSettings):
    app_secret: str = "change-me"
    google_api_key: str | None = None
    frontend_origin: str | None = "http://localhost:5173"
    database_url: str | None = None

    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore")


def get_settings() -> Settings:
    return Settings()


settings = get_settings()
