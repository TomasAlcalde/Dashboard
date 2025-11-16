from __future__ import annotations

from pydantic import BaseModel, Field


class ClassificationBase(BaseModel):
    sentiment: int = Field(description="Sentiment assigned by the classifier", ge=-2, le=2)
    urgency: int = Field(ge=0, le=3)
    budget_tier: str | None = Field(default=None)
    buyer_role: str | None = Field(default=None)
    use_case: str | None = Field(default=None)
    pains: list[str] | None = Field(default_factory=list)
    objections: list[str] | None = Field(default_factory=list)
    competitors: list[str] | None = Field(default_factory=list)
    risks: list[str] | None = Field(default_factory=list)
    next_step_clarity: int = Field(ge=0, le=3)
    fit_score: float = Field(ge=0, le=1)
    close_probability: float = Field(ge=0, le=1)


class ClassificationCreate(ClassificationBase):
    transcript_id: int


class ClassificationRead(ClassificationBase):
    transcript_id: int

    class Config:
        from_attributes = True

class ClassificationListResponse(BaseModel):
    total: int
    items: list[ClassificationRead]
