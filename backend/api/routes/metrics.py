from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..schemas.metrics import (
    AvailableObjections,
    AvailablePains,
    ConversionMetrics,
    MetricsFunnel,
    MetricsOverview,
    UrgencyBudgetHeatmap,
    UseCaseDistribution,
)
from ..services.metrics import (
    conversion_metrics,
    funnel,
    list_objections,
    list_pains,
    overview,
    urgency_budget_heatmap,
    use_case_distribution,
)

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/overview", response_model=MetricsOverview)
def metrics_overview(db: Session = Depends(get_db)) -> MetricsOverview:
    return overview(db)


@router.get("/funnel", response_model=MetricsFunnel)
def metrics_funnel(db: Session = Depends(get_db)) -> MetricsFunnel:
    return funnel(db)


@router.get("/conversions", response_model=ConversionMetrics)
def metrics_conversions(db: Session = Depends(get_db)) -> ConversionMetrics:
    return conversion_metrics(db)


@router.get("/urgency-budget", response_model=UrgencyBudgetHeatmap)
def metrics_urgency_budget(db: Session = Depends(get_db)) -> UrgencyBudgetHeatmap:
    return urgency_budget_heatmap(db)


@router.get("/use-cases", response_model=UseCaseDistribution)
def metrics_use_cases(
    status: str = Query("all", enum=["all", "closed", "open"]),
    db: Session = Depends(get_db),
) -> UseCaseDistribution:
    return use_case_distribution(db, status=status)


@router.get("/pains", response_model=AvailablePains)
def metrics_pains(db: Session = Depends(get_db)) -> AvailablePains:
    return list_pains(db)


@router.get("/objections", response_model=AvailableObjections)
def metrics_objections(db: Session = Depends(get_db)) -> AvailableObjections:
    return list_objections(db)
