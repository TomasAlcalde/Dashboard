from hashlib import sha256

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..models.client import Client
from ..schemas.client import ClientCreate


def _hash_identifier(value: str | None) -> str | None:
    if value is None:
        return None
    normalized = value.strip().lower()
    if not normalized:
        return None
    return sha256(normalized.encode("utf-8")).hexdigest()


def upsert_client(db: Session, payload: ClientCreate) -> tuple[Client, bool]:
    email_hash = _hash_identifier(payload.email)
    phone_hash = _hash_identifier(payload.phone)

    client = None
    if email_hash or phone_hash:
        query = select(Client).where(Client.name == payload.name)
        query = query.where(Client.email_hash == email_hash)
        client = db.scalar(query)

    created = False
    if client is None:
        client = Client(name=payload.name, email_hash=email_hash, phone_hash=phone_hash)
        db.add(client)
        created = True
    else:
        # Keep stored hashes up to date if new info arrives
        client.email_hash = email_hash or client.email_hash
        client.phone_hash = phone_hash or client.phone_hash
    db.commit()
    db.refresh(client)
    return client, created


def get_client(db: Session, client_id: int) -> Client | None:
    return db.get(Client, client_id)


def list_clients(db: Session, skip: int = 0, limit: int = 50) -> tuple[list[Client], int]:
    total = db.scalar(select(func.count()).select_from(Client)) or 0
    items = list(db.scalars(select(Client).offset(skip).limit(limit)).all())
    return items, total