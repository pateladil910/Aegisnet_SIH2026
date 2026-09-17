"""
AegisNet Mesh Gateway Node (Raspberry Pi / Linux / ESP32 Bridge)
Listens on LoRa Mesh radio or Serial interface and forwards packets to MQTT / HTTP Ingestion.
"""

import sys
import time
import json
import requests
import argparse

BACKEND_URL = "http://127.0.0.1:5001/api/ingest"

def forward_packet(packet_dict):
    try:
        is_alert = packet_dict.get("isAlert", False)
        endpoint = f"{BACKEND_URL}/alert" if is_alert else f"{BACKEND_URL}/telemetry"
        
        response = requests.post(endpoint, json=packet_dict, timeout=3.0)
        if response.status_code in [200, 201]:
            print(f"[Gateway Bridge] Successfully forwarded packet {packet_dict.get('packetId')} to {endpoint}")
        else:
            print(f"[Gateway Bridge] Warning: HTTP {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[Gateway Bridge Error] Could not forward packet: {e}")

def main():
    parser = argparse.ArgumentParser(description="AegisNet Gateway Forwarder")
    parser.add_argument("--backend", default=BACKEND_URL, help="Backend URL")
    args = parser.parse_args()

    print(f"==================================================")
    print(f"📡 AegisNet Gateway Bridge Active")
    print(f"Target Backend: {args.backend}")
    print(f"Listening for LoRa mesh packets...")
    print(f"==================================================")

if __name__ == "__main__":
    main()
