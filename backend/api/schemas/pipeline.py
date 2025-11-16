from __future__ import annotations

from pydantic import BaseModel, Field

from .classification import ClassificationRead


class CSVIngestResponse(BaseModel):
    processed_rows: int
    inserted_clients: int
    inserted_transcripts: int
    classified_transcripts: int


class ClassifyResponse(BaseModel):
    transcript_id: int
    created: bool
    classification: ClassificationRead | None = None


class ClassifyBatchRequest(BaseModel):
    transcript_ids: list[int] = Field(default_factory=list, description="Transcript IDs to classify")
