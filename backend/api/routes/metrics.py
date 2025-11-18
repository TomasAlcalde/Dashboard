from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..schemas.metrics import (
    AvailablePains,
    AutomatizationOutcomeSeries,
    ConversionMetrics,
    MetricsFunnel,
    MetricsOverview,
    OriginDistribution,
    PainDistribution,
    SellerConversionResponse,
    SentimentConversionSeries,
    UrgencyBudgetHeatmap,
    UseCaseDistribution,
)
from ..services.metrics import (
    automatization_outcomes,
    conversion_metrics,
    funnel,
    list_pains,
    origin_distribution,
    pain_distribution,
    seller_conversion_stats,
    overview,
    sentiment_conversion_breakdown,
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


@router.get("/pains/distribution", response_model=PainDistribution)
def metrics_pain_distribution(db: Session = Depends(get_db)) -> PainDistribution:
    return pain_distribution(db)


@router.get("/sentiment-conversion", response_model=SentimentConversionSeries)
def metrics_sentiment_conversion(
    db: Session = Depends(get_db),
) -> SentimentConversionSeries:
    return sentiment_conversion_breakdown(db)


@router.get("/seller-conversion", response_model=SellerConversionResponse)
def metrics_seller_conversion(db: Session = Depends(get_db)) -> SellerConversionResponse:
    return seller_conversion_stats(db)


@router.get("/origins", response_model=OriginDistribution)
def metrics_origins(db: Session = Depends(get_db)) -> OriginDistribution:
    return origin_distribution(db)


@router.get("/automatization-outcomes", response_model=AutomatizationOutcomeSeries)
def metrics_automatization_outcomes(
    db: Session = Depends(get_db),
) -> AutomatizationOutcomeSeries:
    return automatization_outcomes(db)
