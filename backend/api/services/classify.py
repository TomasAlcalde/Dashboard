from typing import Iterable

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from ..models.classification import Classification
from ..models.transcript import Transcript
from ..schemas.classification import ClassificationBase, ClassificationRead
from ..schemas.pipeline import ClassifyResponse
from .transcripts import get_transcript
from .llm_classifier import call_api

def get_classification(transcript: Transcript):
    return getattr(transcript, "classification", None)

def save_classification(db: Session, transcript_id: int, payload: ClassificationBase) -> Classification:
    transcript = get_transcript(db, transcript_id)
    if not transcript:
        raise ValueError("Transcrito no encontrado para guardar la clasificación")

    classification = db.scalar(
        select(Classification).where(Classification.transcript_id == transcript_id)
    )
    mapping = payload.model_dump()
    if classification:
        for field, value in mapping.items():
            setattr(classification, field, value)
    else:
        classification = Classification(transcript=transcript, **mapping)
        db.add(classification)
    transcript.classification = classification
    db.commit()
    db.refresh(classification)
    return classification

def classify_transcript(db: Session, transcript_id: int) -> ClassifyResponse:
    transcript = get_transcript(db, transcript_id)
    if not transcript:
        raise ValueError("Transcrito no encontrado")
    classification = get_classification(transcript)
    api_call = False
    if not classification:
        api_call = True
        classification_payload = call_api(transcript.transcript)
        classification_payload = ClassificationBase.model_validate(classification_payload)
        classification = save_classification(db, transcript.id, classification_payload)
    classification_data = ClassificationRead.model_validate(classification, from_attributes=True)
    return ClassifyResponse(transcript_id=transcript.id, created=api_call, classification=classification_data)


def classify_batch(db: Session, transcript_ids: Iterable[int]) -> list[ClassifyResponse]:
    responses: list[ClassifyResponse] = []
    for transcript_id in transcript_ids:
        try:
            responses.append(classify_transcript(db, transcript_id))
        except ValueError:
            continue
    return responses

def list_classifications(db: Session, skip: int = 0, limit: int = 50) -> tuple[list[Classification], int]:
    total = db.scalar(select(func.count()).select_from(Classification)) or 0
    items = list(db.scalars(select(Classification).offset(skip).limit(limit)).all())
    return items, total
