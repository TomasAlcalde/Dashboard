from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

from .database import Base

if TYPE_CHECKING: 
    from .client import Client
    from .classification import Classification

class Transcript(Base):
    __tablename__ = "transcripts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    assigned_seller: Mapped[str | None] = mapped_column(String(100), nullable=True)
    meeting_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    closed: Mapped[bool] = mapped_column(Boolean, default=False)
    transcript: Mapped[str] = mapped_column(Text, nullable=False)

    classification: Mapped["Classification | None"] = relationship(
        "Classification",
        back_populates="transcript",
        uselist=False,
        cascade="all, delete-orphan",
    )
    client: Mapped["Client"] = relationship("Client", back_populates="transcripts")

    def touch_meeting_date(self) -> None:
        if self.meeting_date is None:
            self.meeting_date = datetime.now(timezone.utc)
