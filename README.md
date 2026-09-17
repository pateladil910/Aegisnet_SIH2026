# AegisNet — AI-Powered Edge Environmental Monitoring Network for Floods, Fires & Pollution

**Problem Statement:** SIH26178 (Qualcomm — Hardware/Edge-AI/IoT)  
**Catchment Area Focus:** Tapi River Basin & Forest Perimeter (Surat / South Gujarat)

---

## System Architecture

```
[ESP32 Edge Sensor Nodes ×N] --LoRa SX1278 Mesh--> [Gateway Node] --WiFi/4G--> [Express + Socket.IO Backend] --> [React 18 Dashboard]
          │                                                                                 │
   On-device TinyML                                                                 FastAPI AI Service
(Rate-of-Change Risk Scoring)                                                  (Spatial Correlation & Forecast)
                                                                                            │
                                                                                 Emergency SMS & Push
```

---

## Monorepo Layout

```
e:\Aegisnet_SIH2026\
├── backend/             # Node.js, Express, Socket.IO, MQTT ingestion, REST API
├── ai-service/          # Python, FastAPI (Spatial correlation, 3-6h forecasting, false-positive filter)
├── frontend/            # React 18, Vite, TypeScript, Tailwind CSS, Leaflet, Recharts
├── ml-training/         # Synthetic environmental generator, TinyML training & C header exporter
├── firmware/            # ESP32 C++ code (HC-SR04, MQ135, DHT22, LoRa packet packing) & Gateway bridge
├── simulator/           # Multi-node IoT mesh simulator with scenario triggers (flood, fire, false-positive)
├── infra/               # docker-compose.yml & Mosquitto broker config
└── start_all.ps1        # One-click full-stack launcher
```

---

## ⚡ Quick Start

### 1. Launch All Microservices
Run the automated launcher:
```powershell
.\start_all.ps1
```
Or start each service individually:
- **AI Microservice**:
  ```bash
  cd ai-service
  python -m uvicorn main:app --host 127.0.0.1 --port 8000
  ```
- **Backend API & Ingestion Engine**:
  ```bash
  cd backend
  npm start
  ```
- **Frontend Command Ops Dashboard**:
  ```bash
  cd frontend
  npm run dev
  ```

### 2. Access the Application
- **Command Dashboard:** [http://localhost:5180/dashboard](http://localhost:5180/dashboard)
- **Public Community Map:** [http://localhost:5180/](http://localhost:5180/)
- **Incident & Alert Feed:** [http://localhost:5180/alerts](http://localhost:5180/alerts)
- **Risk Analytics & Forecasts:** [http://localhost:5180/analytics](http://localhost:5180/analytics)
- **Thresholds & Auditing:** [http://localhost:5180/settings/thresholds](http://localhost:5180/settings/thresholds)
- **AI Microservice Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🎬 Interactive Disaster Demonstrations

You can trigger live disaster simulations directly from the dashboard navbar buttons (**"Flood Surge"**, **"Wildfire"**, **"Toxic AQI"**) or via the terminal simulator:

### Flash Flood Upstream Surge
```bash
python simulator/mesh_simulator.py --scenario flood
```
- Rapid water level rise at river nodes (`node_001`, `node_002`).
- Edge AI risk score spikes above 75/100.
- LoRa mesh packet relayed to gateway -> backend -> FastAPI correlation engine.
- Area Probability Index escalates; map marker pulses in red; alert feed pops in real-time.

### Wildfire Ignition
```bash
python simulator/mesh_simulator.py --scenario fire
```
- Temperature spike and flame sensor trigger at forest perimeter node (`node_005`).
- Fast escalation to Tier 3 emergency (Push + SMS).

### False-Positive Cooking Smoke Filter
```bash
python simulator/mesh_simulator.py --scenario false_positive
```
- Smoke sensor spikes at industrial buffer (`node_004`) with normal temperature and no flame.
- FastAPI multi-sensor fusion classifies and suppresses the nuisance alarm automatically with clear audit rationale.

---

## AI / Machine Learning Implementation

### Level 1: On-Node Edge AI (TinyML)
- Implemented in `firmware/include/edge_model_weights.h` and `ml-training/train_edge_model.py`.
- Computes rolling mean, standard deviation, and rate of change ($\Delta\text{value}/\Delta t$) on-device.
- Emits real-time 0–100 risk vector for flood, fire, and pollution.

### Level 2: Cloud-Side Correlation AI
- **Spatial Correlation Engine (`ai-service/models/correlation.py`)**: Computes inverse distance weighted correlation across catchment nodes to determine the Area Probability Index.
- **Time-Series Forecasting (`ai-service/models/forecast.py`)**: Predicts 3–6 hour risk trajectories with 95% confidence bounds.
- **False-Positive Filter (`ai-service/models/filters.py`)**: Evaluates multi-sensor physical co-validation (flame + smoke + temperature rise) to eliminate nuisance alarms.