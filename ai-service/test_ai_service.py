import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "online"
    print("[PASS] /health check passed")

def test_correlate():
    payload = {
        "nodeId": "node_002",
        "hazard": "flood",
        "riskScore": 82.0,
        "location": [72.8311, 21.1959],
        "timestamp": "2026-09-17T10:00:00Z"
    }
    res = client.post("/correlate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "areaProbabilityIndex" in data
    assert "confirmingNodes" in data
    print("[PASS] /correlate test passed: API Score =", data["areaProbabilityIndex"], "Confirming =", data["confirmingNodes"])

def test_false_positive_filter():
    # Smoke spike with normal temp and no flame
    cooking_payload = {
        "nodeId": "node_004",
        "hazard": "fire",
        "reading": {
            "flame": False,
            "smokePpm": 180.0,
            "tempC": 27.5,
            "humidity": 65
        }
    }
    res = client.post("/validate-alert", json=cooking_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["isLikelyFalsePositive"] is True
    print("[PASS] /validate-alert false-positive suppression test passed:", data["reason"])

def test_forecast():
    res = client.get("/forecast/node_002?hazard=flood")
    assert res.status_code == 200
    data = res.json()
    assert len(data["series"]) == 6
    print("[PASS] /forecast test passed: 6-hour forecast generated")

if __name__ == "__main__":
    print("Running AegisNet AI Microservice Verification Tests...")
    test_health()
    test_correlate()
    test_false_positive_filter()
    test_forecast()
    print("All AI microservice tests passed!")
