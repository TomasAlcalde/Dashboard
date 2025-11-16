from __future__ import annotations

from hashlib import sha256

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..models.classification import Classification
from ..models.client import Client
from ..models.transcript import Transcript
from ..schemas.classification import ClassificationBase
from ..schemas.client import ClientCreate
from ..schemas.transcript import TranscriptCreate


from .clients import upsert_client


def get_transcript(db: Session, transcript_id: int) -> Transcript | None:
    return db.get(Transcript, transcript_id)


def list_transcripts(db: Session, skip: int = 0, limit: int = 50) -> tuple[list[Transcript], int]:
    total = db.scalar(select(func.count()).select_from(Transcript)) or 0
    items = list(db.scalars(select(Transcript).offset(skip).limit(limit)).all())
    return items, total


def upsert_transcript(
    db: Session, client_payload: ClientCreate, payload: TranscriptCreate
) -> tuple[Transcript, bool, bool]:
    client, client_created = upsert_client(db, client_payload)
    transcript = None
    if payload.meeting_date:
        transcript = db.scalar(
            select(Transcript).where(
                Transcript.client_id == client.id, Transcript.meeting_date == payload.meeting_date
            )
        )
    if transcript is None and payload.transcript:
        transcript = db.scalar(
            select(Transcript).where(
                Transcript.client_id == client.id, Transcript.transcript == payload.transcript
            )
        )
    transcript_created = False
    data = payload.model_dump()
    if transcript:
        for field, value in data.items():
            if value is not None:
                setattr(transcript, field, value)
    else:
        create_data = {field: value for field, value in data.items() if value is not None}
        if create_data.get("closed") is None:
            create_data["closed"] = False
        transcript = Transcript(client_id=client.id, **create_data)
        db.add(transcript)
        transcript_created = True
    db.commit()
    db.refresh(transcript)
    return transcript, client_created, transcript_created