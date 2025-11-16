from __future__ import annotations

from sqlalchemy import Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

from .database import Base

if TYPE_CHECKING: from .transcript import Transcript


class Client(Base):
    __tablename__ = "clients"
    __table_args__ = (UniqueConstraint("name", "email_hash", name="uq_client_name_email"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    phone_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)

    transcripts: Mapped[list["Transcript"]] = relationship(
        "Transcript",
        back_populates="client",
        cascade="all, delete-orphan",
        order_by="Transcript.meeting_date",
    )
