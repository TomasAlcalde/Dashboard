from __future__ import annotations

from random import randint
from typing import Literal

from sqlalchemy.orm import Session

from ..models.task import Task
from ..schemas.dashboard import DashboardSummary

Timeframe = Literal['7d', '30d']


def ensure_seed_data(db: Session) -> None:
    """Populate the SQLite database with demo rows when empty."""
    if db.query(Task).count():
        return

    seed_tasks = [
        Task(name="Marketing report", status="active", conversion_rate=2.5),
        Task(name="Social media push", status="active", conversion_rate=3.1),
        Task(name="Client onboarding", status="completed", conversion_rate=4.0),
        Task(name="Reactivation", status="pending", conversion_rate=1.1)
    ]
    db.add_all(seed_tasks)
    db.commit()


def retrieve_dashboard_summary(db: Session, timeframe: Timeframe) -> DashboardSummary:
    ensure_seed_data(db)

    tasks = db.query(Task).all()
    task_count = len(tasks)
    total_users = task_count * (4 if timeframe == '30d' else 1)
    active_sessions = len([task for task in tasks if task.status == "active"]) * randint(3, 6)
    avg_conversion = sum(task.conversion_rate for task in tasks) / max(task_count, 1)

    return DashboardSummary(
        totalUsers=total_users,
        activeSessions=active_sessions,
        conversionRate=round(avg_conversion, 2)
    )