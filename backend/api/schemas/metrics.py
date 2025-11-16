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
