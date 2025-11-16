from __future__ import annotations

from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_clients_endpoint_returns_empty_payload() -> None:
    response = client.get("/api/clients")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 0
    assert isinstance(data["items"], list)


def test_metrics_overview_endpoint() -> None:
    response = client.get("/api/metrics/overview")
    assert response.status_code == 200
    payload = response.json()
    assert {"total_clients", "classified_clients", "open_opportunities", "closed_wins"} <= payload.keys()
