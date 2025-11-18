from __future__ import annotations

from pathlib import Path
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from ..settings import settings

DEFAULT_DB_PATH = Path(__file__).resolve().parents[2] / "data" / "vambe.db"


def _resolve_database_url() -> str:
    """
    Allow overriding the default SQLite file with DATABASE_URL.

    Vercel no soporta archivos SQLite, por lo que en producción debe
    entregarse un URL de Postgres (Neon, Supabase, Railway, etc.).
    """
    if settings.database_url:
        return _normalize_database_url(settings.database_url)

    DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"


def _normalize_database_url(url: str) -> str:
    """Ensure Postgres URLs explicitly use the psycopg driver."""
    if "://" not in url:
        return url

    scheme, rest = url.split("://", 1)
    if scheme in {"postgres", "postgresql"}:
        return f"postgresql+psycopg://{rest}"
    if scheme.startswith("postgresql+") or scheme.startswith("postgres+"):
        return url
    return url


DATABASE_URL = _resolve_database_url()

engine_kwargs: dict[str, object] = {}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    from . import classification, client, transcript

    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
