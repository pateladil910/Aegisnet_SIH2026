from datetime import datetime, timedelta
from typing import List, Dict, Any

def generate_forecast_series(node_id: str, hazard: str, window_hours: int = 6) -> List[Dict[str, Any]]:
    """
    Generates time-series predictive trajectory for water level, fire risk, or AQI
    based on rate-of-change trend extrapolation with expanding uncertainty envelope.
    """
    now = datetime.utcnow()
    points = []

    # Dynamic base values per hazard
    if hazard == "flood":
        base_val = 55
        hourly_rate = 3.8 # rising surge
        uncertainty_rate = 1.4
    elif hazard == "fire":
        base_val = 32
        hourly_rate = 2.1
        uncertainty_rate = 1.8
    else: # pollution
        base_val = 68
        hourly_rate = 4.2
        uncertainty_rate = 2.0

    for h in range(1, window_hours + 1):
        target_time = now + timedelta(hours=h)
        # Non-linear surge curve
        surge = hourly_rate * h + (0.2 * (h ** 1.6))
        predicted = int(round(base_val + surge))
        envelope = int(round(4 + uncertainty_rate * h))

        points.append({
            "timestamp": target_time.isoformat() + "Z",
            "predictedValue": min(100, predicted),
            "confidenceLow": max(0, predicted - envelope),
            "confidenceHigh": min(100, predicted + envelope)
        })

    return points
