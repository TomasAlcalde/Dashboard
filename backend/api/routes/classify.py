from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..schemas.pipeline import ClassifyBatchRequest, ClassifyResponse
from ..schemas.classification import ClassificationRead, ClassificationListResponse
from ..services.classify import classify_batch, classify_transcript, list_classifications

router = APIRouter(prefix="/classify", tags=["classification"])


@router.post("/{transcript_id}", response_model=ClassifyResponse)
def classify_single(transcript_id: int, db: Session = Depends(get_db)) -> ClassifyResponse:
    try:
        return classify_transcript(db, transcript_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/batch", response_model=list[ClassifyResponse])
def classify_many(payload: ClassifyBatchRequest, db: Session = Depends(get_db)) -> list[ClassifyResponse]:
    if not payload.transcript_ids:
        raise HTTPException(status_code=400, detail="transcript_ids cannot be empty")
    return classify_batch(db, payload.transcript_ids)

@router.get("/", response_model=ClassificationListResponse)
def read_classifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> ClassificationListResponse:
    items, total = list_classifications(db, skip=skip, limit=limit)
    items=[ClassificationRead.model_validate(c, from_attributes=True) for c in items]
    return ClassificationListResponse(total=total, items=items)

