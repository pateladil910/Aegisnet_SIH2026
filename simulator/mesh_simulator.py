"""
AegisNet Multi-Node IoT Mesh Simulator
Simulates multi-hop LoRa nodes across river catchments and enables scenario triggers:
  - normal: regular periodic telemetry heartbeat
  - flood: flash-flood upstream surge triggering edge AI scoring and spatial correlation
  - fire: wildfire ignition at forest perimeter node
  - false_positive: localized cooking smoke to test AI false-positive filter
"""

import time
import json
import random
import argparse
import requests

DEFAULT_BACKEND = "http://127.0.0.1:5001"

NODES_METADATA = [
    {
        "nodeId": "node_001",
        "label": "Tapi Riverbank North",
        "base_water": 32.0,
        "base_temp": 28.5,
        "base_smoke": 55.0,
        "hazardTypes": ["flood"]
    },
    {
        "nodeId": "node_002",
        "label": "Weir Causeway Checkpoint",
        "base_water": 44.0,
        "base_temp": 29.0,
        "base_smoke": 65.0,
        "hazardTypes": ["flood", "pollution"]
    },
    {
        "nodeId": "node_003",
        "label": "Singanpore Downstream Sluice",
        "base_water": 28.0,
        "base_temp": 28.0,
        "base_smoke": 50.0,
        "hazardTypes": ["flood"]
    },
    {
        "nodeId": "node_004",
        "label": "Sachin Industrial Buffer",
        "base_water": 15.0,
        "base_temp": 31.0,
        "base_smoke": 110.0,
        "hazardTypes": ["pollution", "fire"]
    },
    {
        "nodeId": "node_005",
        "label": "Mandvi Forest Perimeter",
        "base_water": 12.0,
        "base_temp": 33.0,
        "base_smoke": 40.0,
        "hazardTypes": ["fire"]
    }
]

def send_telemetry(backend_url, payload):
    try:
        url = f"{backend_url}/api/ingest/telemetry"
        res = requests.post(url, json=payload, timeout=2.5)
        return res.status_code == 200
    except Exception as e:
        print(f"[Sim Error] Backend not reachable: {e}")
        return False

def send_alert(backend_url, payload):
    try:
        url = f"{backend_url}/api/ingest/alert"
        res = requests.post(url, json=payload, timeout=3.5)
        print(f"[Sim Alert Dispatched] Response: {res.json()}")
        return res.status_code == 200
    except Exception as e:
        print(f"[Sim Alert Error] {e}")
        return False

def run_simulation(backend_url, scenario, duration_cycles=30, interval=3.0):
    print("================================================================")
    print(f"🌊 AegisNet IoT Mesh Simulator Starting")
    print(f"🎯 Target Backend: {backend_url}")
    print(f"🎬 Scenario:       {scenario.upper()}")
    print("================================================================")

    packet_counter = 1000

    for cycle in range(duration_cycles):
        print(f"\n--- Cycle {cycle+1}/{duration_cycles} ---")
        
        for n in NODES_METADATA:
            packet_counter += 1
            node_id = n["nodeId"]

            # Baseline calculations
            water = n["base_water"] + random.uniform(-1.5, 1.5)
            temp = n["base_temp"] + random.uniform(-0.4, 0.4)
            smoke = n["base_smoke"] + random.uniform(-5.0, 5.0)
            flame = False
            
            flood_risk = random.randint(15, 30)
            fire_risk = random.randint(5, 20)
            pollution_risk = random.randint(15, 40)

            # Scenario Injections:
            if scenario == "flood" and cycle >= 2:
                if node_id in ["node_001", "node_002"]:
                    # Flash flood surge!
                    surge_level = 50.0 + (cycle * 8.0)
                    water = min(110.0, surge_level)
                    flood_risk = min(100, int(35 + (cycle * 14)))
                    print(f"🚨 [SURGE DETECTED] {n['label']} ({node_id}) Water: {water:.1f}cm | Edge Risk: {flood_risk}")

                    # Trigger alert packet when risk crosses threshold
                    if flood_risk >= 70:
                        send_alert(backend_url, {
                            "packetId": f"pkt_{packet_counter}",
                            "nodeId": node_id,
                            "hazardType": "flood",
                            "riskScore": flood_risk,
                            "severity": "critical" if flood_risk >= 85 else "warning",
                            "reading": {
                                "waterLevelCm": round(water, 1),
                                "tempC": round(temp, 1),
                                "humidity": 88
                            }
                        })

            elif scenario == "fire" and cycle >= 2:
                if node_id == "node_005":
                    temp = 48.5 + (cycle * 2.5)
                    smoke = 190.0 + (cycle * 25.0)
                    flame = True
                    fire_risk = min(100, 75 + cycle * 5)
                    print(f"🔥 [WILDFIRE IGNITION] {n['label']} Temp: {temp:.1f}°C, Smoke: {smoke:.1f}ppm | Risk: {fire_risk}")
                    
                    if fire_risk >= 70:
                        send_alert(backend_url, {
                            "packetId": f"pkt_{packet_counter}",
                            "nodeId": node_id,
                            "hazardType": "fire",
                            "riskScore": fire_risk,
                            "severity": "critical",
                            "reading": {
                                "flame": True,
                                "smokePpm": round(smoke, 1),
                                "tempC": round(temp, 1),
                                "humidity": 22
                            }
                        })

            elif scenario == "false_positive" and cycle >= 1:
                if node_id == "node_004":
                    # Smoke spike without heat or flame (cooking / localized exhaust)
                    smoke = 220.0
                    temp = 28.5
                    flame = False
                    fire_risk = 68
                    print(f"⚠️ [SMOKE DETECTED] {n['label']} Smoke: {smoke}ppm (Normal Temp: {temp}°C, No Flame)")
                    
                    send_alert(backend_url, {
                        "packetId": f"pkt_{packet_counter}",
                        "nodeId": node_id,
                        "hazardType": "fire",
                        "riskScore": fire_risk,
                        "severity": "warning",
                        "reading": {
                            "flame": False,
                            "smokePpm": smoke,
                            "tempC": temp,
                            "humidity": 60
                        }
                    })

            # Send regular telemetry packet
            telemetry_pkt = {
                "packetId": f"pkt_{packet_counter}",
                "nodeId": node_id,
                "battery": random.randint(85, 96),
                "rssi": random.randint(-75, -60),
                "solarCharging": True,
                "waterLevelCm": round(water, 1),
                "flame": flame,
                "smokePpm": round(smoke, 1),
                "aqi": round(smoke * 0.9, 1),
                "tempC": round(temp, 1),
                "humidity": random.randint(60, 75),
                "soilMoisture": random.randint(35, 55),
                "riskScores": {
                    "flood": flood_risk,
                    "fire": fire_risk,
                    "pollution": pollution_risk
                }
            }
            send_telemetry(backend_url, telemetry_pkt)

        time.sleep(interval)

    print("\n✅ Simulation cycle completed.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AegisNet IoT Mesh Simulator")
    parser.add_argument("--backend", default=DEFAULT_BACKEND, help="Backend URL")
    parser.add_argument("--scenario", choices=["normal", "flood", "fire", "false_positive"], default="normal")
    parser.add_argument("--cycles", type=int, default=15)
    parser.add_argument("--interval", type=float, default=2.5)
    args = parser.parse_args()

    run_simulation(args.backend, args.scenario, args.cycles, args.interval)
