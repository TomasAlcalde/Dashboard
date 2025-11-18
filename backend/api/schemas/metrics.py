from __future__ import annotations

from pydantic import BaseModel


class MetricsOverview(BaseModel):
    total_clients: int
    classified_clients: int
    open_opportunities: int
    closed_wins: int


class MetricsFunnel(BaseModel):
    discovery: int
    evaluation: int
    negotiation: int
    closed: int


class MonthlyConversion(BaseModel):
    month: str
    closed: int
    total: int
    conversion: float


class ConversionMetrics(BaseModel):
    monthly: list[MonthlyConversion]


class UrgencyBudgetCell(BaseModel):
    urgency: int
    budget_tier: str
    total: int
    closed: int
    conversion: float


class UrgencyBudgetHeatmap(BaseModel):
    cells: list[UrgencyBudgetCell]


class UseCaseStat(BaseModel):
    use_case: str
    total: int


class UseCaseDistribution(BaseModel):
    items: list[UseCaseStat]


class PainStat(BaseModel):
    pain: str
    total: int


class PainDistribution(BaseModel):
    items: list[PainStat]


class SentimentConversion(BaseModel):
    sentiment: int
    closed: int
    open: int


class SentimentConversionSeries(BaseModel):
    items: list[SentimentConversion]


class SellerConversionStat(BaseModel):
    seller: str
    closed: int
    total: int
    conversion: float


class SellerConversionResponse(BaseModel):
    items: list[SellerConversionStat]


class AvailablePains(BaseModel):
    pains: list[str]


class OriginStat(BaseModel):
    origin: str
    total: int


class OriginDistribution(BaseModel):
    items: list[OriginStat]


class AutomatizationOutcome(BaseModel):
    automatization: bool
    closed: int
    open: int


class AutomatizationOutcomeSeries(BaseModel):
    items: list[AutomatizationOutcome]
