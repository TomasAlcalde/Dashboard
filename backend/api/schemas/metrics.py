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


class AvailablePains(BaseModel):
    pains: list[str]


class AvailableObjections(BaseModel):
    objections: list[str]
