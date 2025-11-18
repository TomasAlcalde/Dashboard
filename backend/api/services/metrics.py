from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from ..models.classification import Classification
from ..models.client import Client
from ..models.transcript import Transcript
from ..schemas.metrics import (
    AvailableObjections,
    AvailablePains,
    ConversionMetrics,
    MetricsFunnel,
    MetricsOverview,
    MonthlyConversion,
    UrgencyBudgetCell,
    UrgencyBudgetHeatmap,
    UseCaseDistribution,
    UseCaseStat,
)


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


def conversion_metrics(db: Session) -> ConversionMetrics:
    result = db.execute(
        select(Transcript.meeting_date, Transcript.closed)
        .where(Transcript.meeting_date.is_not(None))
        .order_by(Transcript.meeting_date.desc())
    ).all()

    monthly_counter: dict[str, dict[str, int]] = defaultdict(
        lambda: {"closed": 0, "total": 0}
    )
    for meeting_date, closed in result:
        if meeting_date is None:
            continue
        label = meeting_date.strftime("%Y-%m")
        stats = monthly_counter[label]
        stats["total"] += 1
        if closed:
            stats["closed"] += 1

    monthly: list[MonthlyConversion] = []
    for label in sorted(monthly_counter.keys()):
        stats = monthly_counter[label]
        total = stats["total"]
        closed_count = stats["closed"]
        conversion = closed_count / total if total else 0.0
        monthly.append(
            MonthlyConversion(
                month=label,
                closed=closed_count,
                total=total,
                conversion=conversion,
            )
        )

    return ConversionMetrics(monthly=monthly)


def urgency_budget_heatmap(db: Session) -> UrgencyBudgetHeatmap:
    closed_case = func.sum(
        case((Transcript.closed.is_(True), 1), else_=0)
    ).label("closed_count")

    query = (
        select(
            Classification.urgency,
            Classification.budget_tier,
            func.count(Classification.id).label("total"),
            closed_case,
        )
        .join(Transcript, Transcript.id == Classification.transcript_id)
        .group_by(Classification.urgency, Classification.budget_tier)
    )

    rows = db.execute(query).all()
    cells: list[UrgencyBudgetCell] = []
    for urgency, budget, total, closed in rows:
        if budget is None:
            budget = "Unknown"
        closed_value = int(closed or 0)
        total_value = int(total or 0)
        conversion = closed_value / total_value if total_value else 0.0
        cells.append(
            UrgencyBudgetCell(
                urgency=int(urgency or 0),
                budget_tier=budget,
                total=total_value,
                closed=closed_value,
                conversion=conversion,
            )
        )

    return UrgencyBudgetHeatmap(cells=cells)


def use_case_distribution(db: Session, status: str = "all") -> UseCaseDistribution:
    query = (
        select(Classification.use_case, func.count(Classification.id).label("total"))
        .join(Transcript, Transcript.id == Classification.transcript_id)
        .group_by(Classification.use_case)
    )

    if status == "closed":
        query = query.where(Transcript.closed.is_(True))
    elif status == "open":
        query = query.where(Transcript.closed.is_(False))

    rows = db.execute(query).all()
    items: list[UseCaseStat] = []
    for use_case, total in rows:
        name = use_case or "Desconocido"
        items.append(UseCaseStat(use_case=name, total=int(total or 0)))

    items.sort(key=lambda item: item.total, reverse=True)
    return UseCaseDistribution(items=items)


def list_pains(db: Session) -> AvailablePains:
    rows = db.execute(select(Classification.pains)).scalars().all()
    pains_set: set[str] = set()
    for row in rows:
        if not row:
            continue
        for pain in row:
            if pain:
                pains_set.add(pain)
    return AvailablePains(pains=sorted(pains_set))


def list_objections(db: Session) -> AvailableObjections:
    rows = db.execute(select(Classification.objections)).scalars().all()
    objections_set: set[str] = set()
    for row in rows:
        if not row:
            continue
        for objection in row:
            if objection:
                objections_set.add(objection)
    return AvailableObjections(objections=sorted(objections_set))
