from __future__ import annotations

from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_metrics_conversions_endpoint() -> None:
    response = client.get("/api/metrics/conversions")
    assert response.status_code == 200
    payload = response.json()
    assert "monthly" in payload
    assert isinstance(payload["monthly"], list)


def test_metrics_seller_conversion_endpoint() -> None:
    response = client.get("/api/metrics/seller-conversion")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)


def test_metrics_origins_endpoint() -> None:
    response = client.get("/api/metrics/origins")
    assert response.status_code == 200
    payload = response.json()
    assert "items" in payload
    assert isinstance(payload["items"], list)
