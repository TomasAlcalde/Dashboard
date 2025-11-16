from __future__ import annotations

from pydantic import BaseModel, Field

from .transcript import TranscriptRead


class ClientBase(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None


class ClientCreate(ClientBase):
    pass


class ClientRead(BaseModel):
    id: int
    name: str
    email_hash: str | None = None
    phone_hash: str | None = None
    transcripts: list[TranscriptRead] = Field(default_factory=list)

    class Config:
        from_attributes = True


class ClientListResponse(BaseModel):
    total: int
    items: list[ClientRead]
