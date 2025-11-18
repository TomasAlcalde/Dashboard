from hashlib import sha256
from datetime import timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..models.client import Client
from ..models.transcript import Transcript
from ..schemas.client import ClientCreate, ClientFilters


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


RANGE_MAP = {
    "7d": timedelta(days=7),
    "30d": timedelta(days=30),
    "90d": timedelta(days=90),
}


def list_clients(
    db: Session,
    filters: ClientFilters,
) -> tuple[list[Client], int]:
    query = select(Client)

    if filters.seller:
        latest = (
            select(Transcript.client_id, func.max(Transcript.meeting_date).label("latest"))
            .group_by(Transcript.client_id)
            .cte("latest_transcripts")
        )
        query = query.join(latest, latest.c.client_id == Client.id)
        transcript_alias = select(Transcript).where(
            Transcript.client_id == Client.id,
            Transcript.meeting_date == latest.c.latest,
        ).subquery()
        query = query.join(transcript_alias, transcript_alias.c.client_id == Client.id)
        query = query.where(transcript_alias.c.assigned_seller == filters.seller)

    if filters.date_range and filters.date_range != "all":
        if filters.date_range in RANGE_MAP:
            latest_meeting_date = db.scalar(
                select(func.max(Transcript.meeting_date)).where(
                    Transcript.meeting_date.is_not(None)
                )
            )
            if latest_meeting_date is not None:
                # ensure timezone-aware datetime for subtraction
                if latest_meeting_date.tzinfo is None:
                    latest_meeting_date = latest_meeting_date.replace(
                        tzinfo=timezone.utc
                    )
                threshold = latest_meeting_date - RANGE_MAP[filters.date_range]
                query = query.join(Transcript, Transcript.client_id == Client.id)
                query = query.where(Transcript.meeting_date >= threshold)

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = list(db.scalars(query.offset(filters.skip).limit(filters.limit)).all())
    return items, total
