from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..schemas.dashboard import DashboardSummary
from ..services.dashboard import retrieve_dashboard_summary, Timeframe

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardSummary)
async def read_dashboard(
    timeframe: Timeframe = Query(default="7d", pattern="^(7d|30d)$"),
    db: Session = Depends(get_db)
) -> DashboardSummary:
    """Return aggregated dashboard metrics for the requested timeframe."""
    return retrieve_dashboard_summary(db, timeframe)