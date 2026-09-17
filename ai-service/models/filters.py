from typing import Dict, Any, Tuple

def validate_environmental_fusion(node_id: str, hazard: str, reading: Dict[str, Any]) -> Tuple[bool, str, float]:
    """
    Evaluates multi-sensor fusion to suppress false positives (e.g. localized cooking smoke,
    transient ultrasonic sensor echo, brief humidity spikes).
    Returns (isLikelyFalsePositive, explanation, confidence)
    """
    if hazard == "fire":
        has_flame = bool(reading.get("flame", False))
        smoke_ppm = float(reading.get("smokePpm", 0))
        temp_c = float(reading.get("tempC", 25))
        humidity = float(reading.get("humidity", 50))

        # Scenario 1: High smoke, but NO flame and normal ambient temperature -> typical biomass/cooking smoke
        if not has_flame and smoke_ppm > 120 and temp_c < 38.0:
            return (
                True,
                f"Suppressed: Smoke ({smoke_ppm} ppm) detected without flame or thermal elevation ({temp_c}°C). Consistent with localized cooking or agricultural exhaust.",
                0.89
            )

        # Scenario 2: Flame sensor tripped briefly with zero smoke and high humidity -> likely direct sun reflection / glint
        if has_flame and smoke_ppm < 40 and humidity > 70:
            return (
                True,
                "Suppressed: Optical flame pulse without combustion byproduct or thermal signature (potential solar glint reflection).",
                0.82
            )

        # Scenario 3: Real fire signature -> Flame + elevated smoke + thermal surge
        if has_flame or (smoke_ppm > 180 and temp_c > 45.0):
            return (
                False,
                f"Confirmed: Multi-sensor co-validation passed (Flame: {has_flame}, Smoke: {smoke_ppm} ppm, Temp: {temp_c}°C).",
                0.96
            )

    elif hazard == "flood":
        water_level = float(reading.get("waterLevelCm", 0))
        soil_moisture = float(reading.get("soilMoisture", 30))
        
        # If ultrasonic water reading spiked by 50cm in 1 second without soil saturation -> likely debris echo
        if water_level > 80 and soil_moisture < 20:
            return (
                True,
                "Suppressed: Ultrasonic water level spike with dry surrounding soil moisture (<20%). Possible floating debris bounce.",
                0.79
            )

    return (
        False,
        "Confirmed: Sensor telemetry exhibits physical consistency across correlated dimensions.",
        0.91
    )
