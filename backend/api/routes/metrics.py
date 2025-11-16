from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..schemas.metrics import MetricsFunnel, MetricsOverview
from ..services.metrics import funnel, overview

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/overview", response_model=MetricsOverview)
def metrics_overview(db: Session = Depends(get_db)) -> MetricsOverview:
    return overview(db)


@router.get("/funnel", response_model=MetricsFunnel)
def metrics_funnel(db: Session = Depends(get_db)) -> MetricsFunnel:
    return funnel(db)
