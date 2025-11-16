from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..models.classification import Classification
from ..models.client import Client
from ..models.transcript import Transcript
from ..schemas.metrics import MetricsFunnel, MetricsOverview


def overview(db: Session) -> MetricsOverview:
    total_clients = db.scalar(select(func.count(Client.id))) or 0
    classified_transcripts = db.scalar(select(func.count(Classification.id))) or 0
    closed_wins = db.scalar(select(func.count(Transcript.id)).where(Transcript.closed.is_(True))) or 0
    open_opps = db.scalar(select(func.count(Transcript.id)).where(Transcript.closed.is_(False))) or 0
    return MetricsOverview(
        total_clients=total_clients,
        classified_clients=classified_transcripts,
        open_opportunities=open_opps,
        closed_wins=closed_wins,
    )


def funnel(db: Session) -> MetricsFunnel:
    discovery = db.scalar(select(func.count(Transcript.id)).where(~Transcript.classification.has())) or 0
    evaluation = (
        db.scalar(
            select(func.count(Classification.id)).where(Classification.fit_score < 0.6)
        )
        or 0
    )
    negotiation = (
        db.scalar(
            select(func.count(Classification.id)).where(
                Classification.fit_score >= 0.6, Classification.fit_score < 0.8
            )
        )
        or 0
    )
    closed = db.scalar(select(func.count(Transcript.id)).where(Transcript.closed.is_(True))) or 0
    return MetricsFunnel(
        discovery=discovery,
        evaluation=evaluation,
        negotiation=negotiation,
        closed=closed,
    )
