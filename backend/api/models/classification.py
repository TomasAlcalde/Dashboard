from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer, JSON, String
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
    objections: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    competitors: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    risks: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    next_step_clarity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fit_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    close_probability: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    transcript: Mapped["Transcript"] = relationship("Transcript", back_populates="classification")
