from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer, JSON, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING

from .database import Base

if TYPE_CHECKING: from .transcript import Transcript

class Classification(Base):
    __tablename__ = "classifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    transcript_id: Mapped[int] = mapped_column(
        ForeignKey("transcripts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    sentiment: Mapped[int] = mapped_column(Integer, nullable=False)
    urgency: Mapped[int] = mapped_column(Integer, nullable=False)
    budget_tier: Mapped[str | None] = mapped_column(String(20), nullable=True)
    buyer_role: Mapped[str | None] = mapped_column(String(50), nullable=True)
    use_case: Mapped[str | None] = mapped_column(String(120), nullable=True)
    pains: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    risks: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    automatization: Mapped[bool] = mapped_column(Boolean, nullable=True)
    origin: Mapped[str] = mapped_column(String(30), nullable=False)
    fit_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    close_probability: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    summary: Mapped[str] = mapped_column(String(120), nullable=False)

    transcript: Mapped["Transcript"] = relationship("Transcript", back_populates="classification")
