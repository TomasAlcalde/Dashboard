from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..schemas.client import ClientCreate, ClientListResponse, ClientRead
from ..services.clients import get_client, list_clients, upsert_client

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("/", response_model=ClientListResponse)
def read_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> ClientListResponse:
    items, total = list_clients(db, skip=skip, limit=limit)
    items=[ClientRead.model_validate(c, from_attributes=True) for c in items]
    return ClientListResponse(total=total, items=items)


@router.get("/{client_id}", response_model=ClientRead)
def read_client(client_id: int, db: Session = Depends(get_db)) -> ClientRead:
    client = get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return ClientRead.model_validate(client, from_attributes=True)


@router.post("/", response_model=ClientRead)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)) -> ClientRead:
    client, _ = upsert_client(db, payload)
    return ClientRead.model_validate(client, from_attributes=True)
