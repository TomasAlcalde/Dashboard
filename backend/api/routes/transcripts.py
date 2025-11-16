from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..schemas.transcript import TranscriptListResponse, TranscriptRead
from ..services.transcripts import get_transcript, list_transcripts

router = APIRouter(prefix="/transcripts", tags=["transcripts"])


@router.get("/", response_model=TranscriptListResponse)
def read_transcripts(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> TranscriptListResponse:
    items, total = list_transcripts(db, skip=skip, limit=limit)
    items=[TranscriptRead.model_validate(c, from_attributes=True) for c in items]
    return TranscriptListResponse(total=total, items=items)


@router.get("/{transcript_id}", response_model=TranscriptRead)
def read_transcript(transcript_id: int, db: Session = Depends(get_db)) -> TranscriptRead:
    transcript = get_transcript(db, transcript_id)
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")
    return TranscriptRead.model_validate(transcript, from_attributes=True)
