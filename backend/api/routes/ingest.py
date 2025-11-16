from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..schemas.pipeline import CSVIngestResponse
from ..services.pipeline import ingest_csv

router = APIRouter(prefix="/ingest", tags=["ingest"])


@router.post("/csv", response_model=CSVIngestResponse)
async def ingest_clients(upload: UploadFile = File(...), db: Session = Depends(get_db)) -> CSVIngestResponse:
    return await ingest_csv(db, upload)
