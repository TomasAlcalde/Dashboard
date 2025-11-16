from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = '.env'


class Settings(BaseSettings):
    app_secret: str = "change-me"
    google_api_key: str | None = None
    frontend_origin: str | None = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore")


def get_settings() -> Settings:
    return Settings()


settings = get_settings()

def run() -> None:
    """Local entrypoint used by the pip script."""
    import uvicorn

    print(f"S:{settings}")

if __name__ == "__main__":
    run()
