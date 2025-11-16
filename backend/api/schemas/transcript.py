from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from .classification import ClassificationRead


class TranscriptBase(BaseModel):
    assigned_seller: str | None = None
    meeting_date: datetime | None = None
    closed: bool
    transcript: str | None = None


class TranscriptCreate(TranscriptBase):
    pass


class TranscriptRead(TranscriptBase):
    id: int
    client_id: int
    closed: bool = False
    classification: ClassificationRead | None = None

    class Config:
        from_attributes = True

class TranscriptListResponse(BaseModel):
    total: int
    items: list[TranscriptRead]
