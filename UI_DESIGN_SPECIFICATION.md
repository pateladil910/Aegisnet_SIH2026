# AegisNet — Complete UI & Dashboard Design Specification
**AI-Powered Edge Environmental Monitoring Network for Floods, Fires & Pollution (SIH26178)**

---

## 1. Design Philosophy & Aesthetic Standards

AegisNet's interface is engineered as an **Incident Command & Disaster-Ops Control Room Tool**, not a generic administrative dashboard. In a crisis event (such as sudden flash flooding in river catchments or runaway forest fires), operators and authorities require instant visual comprehension under high cognitive load.

### Core Principles
1. **Dark-Mode First**: High-contrast dark backgrounds (`#020617` / `#0f172a`) optimized for ops-room displays and low-light field coordination centers.
2. **Zero-Fatigue Signal Architecture**: Animated pulsing indicators (`animate-pulse` / `animate-ping`) are **exclusively reserved for active critical threats**. Normal and standby nodes remain stable to prevent operator desensitization.
3. **Sub-Second Telemetry Reactivity**: Bidirectional WebSocket stream (Socket.IO) pushes incoming edge-node telemetry and AI correlation scores with zero full-page reload or layout shift.
4. **Dual Audience Segmentation**:
   - **Public Community Portal (`/`)**: Simplified visual iconography, plain-language advisories, and color-coded zones without confusing raw hardware telemetry.
   - **Command Operations Portal (`/dashboard`)**: Full-fidelity data density, sensor voltage/battery %, LoRa mesh RSSI, multi-sensor raw frames, and AI spatial correlation indices.

---

## 2. Design Tokens & Visual Hierarchy

### 2.1 Color Palette
| Token | Hex Code | UI Role | Meaning / Threshold |
|---|---|---|---|
| **Emergency Critical** | `#dc2626` | Red alert badges, pulsing rings, critical alerts | Risk Score $\ge 75/100$, immediate action |
| **Elevated Watch** | `#eab308` | Amber warnings, threshold caution bands | Risk Score $50–74/100$, active tracking |
| **Normal / Safe** | `#16a34a` | Emerald badges, nominal sensor readings | Risk Score $< 50/100$, baseline condition |
| **Offline / Inactive** | `#6b7280` | Gray pills, disconnected mesh node status | Heartbeat expired ($> 15$ min) |
| **Canvas Background** | `#020617` | Root application background (Slate-950) | Control room canvas |
| **Card Surface** | `#0f172a` | Panels, card containers, dialog modals | Elevated surface layer |
| **Border Accent** | `#1e293b` | Structural dividers, data card boundaries | Subtle separation |
| **Brand Primary** | `#2563eb` | Primary buttons, active tabs, breadcrumbs | Actionable elements |

### 2.2 Typography & Iconography
- **Display & Interface Font**: Clean sans-serif (`Inter`, `system-ui`) with tight tracking (`tracking-wide` / `tracking-wider`).
- **Telemetry & Metrics Font**: Fixed-width font (`JetBrains Mono`, `font-mono`) used for all coordinates, sensor numeric readings, timestamps, battery %, and RSSI signal values.
- **Icon System**: Lucide Icons (`Waves` for flood, `Flame` for wildfire, `Wind` for pollution/AQI, `ShieldAlert` for emergency incidents, `Sun` for solar charging, `Wifi` for LoRa RSSI).

---

## 3. Screen-by-Screen Layout & Wireframe Specifications

### Screen 1: Command Operations Dashboard (`/dashboard`)
The mission-critical screen used by disaster response authorities.

```
+---------------------------------------------------------------------------------------------------------------+
| [Shield] AEGISNET [SIH26178]    [Ops] [Public Map] [Alert Feed] [Analytics] [Thresholds]  [Demo: Flood|Fire] [Online] |
+---------------------------------------------------------------------------------------------------------------+
| 🚨 ACTIVE INCIDENT MONITORING: 1 CRITICAL ALERT IN PROGRESS (LoRa Mesh Active)      [ESCALATION TIER 3: SMS+PUSH]     |
+------------------------------------+---------------------------------------------+----------------------------+
| SENSOR NODES (5/5 Online)          | INTERACTIVE CATCHMENT RISK MAP              | EMERGENCY ALERT FEED       |
| [All] [Flood] [Fire] [Pollution]   | +-----------------------------------------+ | [Active (1)]  [All (4)]    |
|                                    | | [Legend]                                | | +------------------------+ |
| +--------------------------------+ | | (●) Normal (●) Watch (🔴) Critical Alert| | | 🌊 FLOOD ALERT [CRITICAL]| |
| | node_002: Weir Causeway Check  | | |                                         | | | Origin: node_002 (10:14) | |
| | [CRITICAL ALERT]               | | |         [node_001]                      | | | Risk: 88/100  Prob: 92%  | |
| | 🌊 88% | 🔥 8% | 💨 32%        | | |             \                         | | | Corroborating: node_001| |
| | 🔋 84%  📶 -71dBm  5s ago      | | |             (🔴 node_002 PULSING)       | | | [Inspect Telemetry]    | |
| +--------------------------------+ | |            /                            | | | [Mark Resolved]        | |
| +--------------------------------+ | |      [node_003]                         | | +------------------------+ |
| | node_001: Tapi Riverbank North | | |                                         | |                            |
| | [NORMAL]                       | | +-----------------------------------------+ | +------------------------+ |
| | 🌊 22% | 🔥 5% | 💨 18%        | | SELECTED NODE QUICK BAR                   | | 💨 SMOKE NOTICE [SUPPR]  | |
| | 🔋 92%  📶 -65dBm  2s ago      | | [Radio] Weir Causeway Checkpoint          | | | False-positive cooking | |
| +--------------------------------+ | | Location: [72.83, 21.19] | Batt: 84%      | | | smoke filtered by AI   | |
|                                    | | [Full Telemetry Details ->]               | | +------------------------+ |
+------------------------------------+---------------------------------------------+----------------------------+
```

#### Key Layout Zones:
1. **Top Incident Alert Banner**: Dynamically switches between emerald nominal banner and high-visibility red crisis banner with pulse glow during active breaches.
2. **Left Panel — Live Fleet Health List (`NodeList.tsx`)**:
   - Filter pills (`All`, `Flood`, `Fire`, `Pollution`, `Alert`).
   - Dynamic health cards showing hardware battery %, solar charging sun indicator, LoRa RSSI dBm, and multi-hazard risk mini-bars.
3. **Center Panel — Real-Time Catchment Map (`RiskMap.tsx`)**:
   - Carto dark-mode basemap tiles.
   - SVG markers colored by status with animated expansion rings (`animate-ping`) on alert nodes.
   - Selected node quick-action bar with 1-click deep link to full historical telemetry charts.
4. **Right Panel — Real-Time Alert Feed (`AlertFeed.tsx`)**:
   - Chronological incident feed updating over WebSocket.
   - Shows Edge AI Risk Score, Cloud AI Area Probability Index, corroborating nearby nodes, and AI false-positive rationale.
   - One-click expandable raw sensor inspection and disaster officer **"Mark Resolved"** action.

---

### Screen 2: Public Community Risk Map (`/`)
The citizen-facing safety portal accessible without authentication.

```
+---------------------------------------------------------------------------------------------------------------+
| [Shield] AEGISNET [Community Advisory]                                        [Community Portal] [Login/Ops]   |
+---------------------------------------------------------------------------------------------------------------+
| (●) Community Environmental Safety Advisory: Real-time public hazard monitoring     [STATUS: 1 ACTIVE ADVISORY] |
+---------------------------------------------------------------------------------------------------------------+
|                                                                                                               |
|                                     CATCHMENT AREA SAFETY MAP                                                 |
|                                                                                                               |
|                                     [Tapi River Sector]                                                       |
|                                                                                                               |
|                         🟢 Upstream Weir             🟡 Causeway Low-Lying                                    |
|                         (Normal Flow)                 (Water Level Rising)                                    |
|                                                                                                               |
|                                                                                                               |
|                                     🟢 City Embankment                                                        |
|                                     (Safe Buffer)                                                             |
|                                                                                                               |
+---------------------------------------------------------------------------------------------------------------+
| [i] Public Guidance: Official safety advisories are broadcast directly via regional SMS alert networks.       |
|     For emergency evacuation assistance, dial State Disaster Management Authority Helpline (1077).            |
+---------------------------------------------------------------------------------------------------------------+
```

#### Public Features:
- Plain-language advisories (e.g. "Water Level Rising — Stay clear of low-lying causeways").
- No overwhelming technical telemetry (removes raw ultrasonic cm, baud rates, packet IDs).
- Clear public safety emergency contact information.

---

### Screen 3: Node Telemetry & Historical Analytics (`/nodes/:id`)
Comprehensive hardware and environmental inspection page for any individual sensor node.

```
+---------------------------------------------------------------------------------------------------------------+
| [<- Return to Dashboard]   Weir Causeway Checkpoint (node_002) [CRITICAL ALERT]         [Refresh Telemetry]   |
| Firmware: v1.2.0 | Sensors: HC-SR04, MQ135, DHT22 | Catchment: Tapi River Basin Sector 1                     |
+---------------------------------------------------------------------------------------------------------------+
|  +---------------------------+  +---------------------------+  +---------------------------+                  |
|  |    FLOOD RISK GAUGE       |  |     FIRE RISK GAUGE       |  |   AIR POLLUTION GAUGE     |                  |
|  |        (  88  )           |  |        (   8  )           |  |        (  32  )           |                  |
|  |         / 100             |  |         / 100             |  |         / 100             |                  |
|  |     [CRITICAL DANGER]     |  |         [NORMAL]          |  |         [NORMAL]          |                  |
|  +---------------------------+  +---------------------------+  +---------------------------+                  |
+---------------------------------------------------------------------------------------------------------------+
|  +-------------------------------------------+  +-------------------------------------------+                 |
|  | ULTRASONIC WATER LEVEL (cm)               |  | AIR QUALITY INDEX (MQ135 ppm)             |                 |
|  | 90|        _/\_                           |  | 100|      __                               |                 |
|  | 60|    _.-'    \                          |  |  60|  _.-'  `-._                           |                 |
|  | 30| __/         \                         |  |  20| /          `---                       |                 |
|  |   +--------------------------             |  |    +--------------------------             |                 |
|  +-------------------------------------------+  +-------------------------------------------+                 |
|  +-------------------------------------------+  +-------------------------------------------+                 |
|  | AMBIENT TEMPERATURE (DHT22 °C)            |  | SOIL MOISTURE SATURATION (%)              |                 |
|  | 35|      _.-._                            |  | 80|       _/\_                             |                 |
|  | 25| ____/     `---                        |  | 50| _____/    \___                         |                 |
|  |   +--------------------------             |  |   +--------------------------              |                 |
|  +-------------------------------------------+  +-------------------------------------------+                 |
+---------------------------------------------------------------------------------------------------------------+
| 3 TO 6-HOUR AI PREDICTIVE SURGE FORECAST (FASTAPI ENSEMBLE MODEL)                                             |
| 100|                                                  ...---""" (Upper Confidence Bound)                      |
|  80|                                       _...---""""                                                        |
|  60|                         __...---"""" (Predicted Water Level Trend)                                      |
|  40|           __...---"""" ...---""" (Lower Confidence Bound)                                                |
|   0+-----------+-----------+-----------+-----------+-----------+-----------+                                  |
|        Now        +1h         +2h         +3h         +4h         +5h         +6h                                 |
+---------------------------------------------------------------------------------------------------------------+
```

#### Analytical Components:
- **Trio of Radial Risk Gauges**: 0–100 circular visual score with dynamic color transitions.
- **Sensor Time-Series Charts (Recharts Area Charts)**: Water Level (cm), AQI (ppm), Ambient Temperature (°C), and Soil Moisture (%).
- **AI Forecasting Envelope Chart**: Predicted trend line accompanied by shaded 95% confidence bounds up to 6 hours ahead.

---

### Screen 4: Incident Log & Alert History (`/alerts`)
Searchable and exportable audit trail of all historical and active events.

```
+---------------------------------------------------------------------------------------------------------------+
| [Bell] Disaster Incident Log & Alert History                                         [Download Export to CSV] |
+---------------------------------------------------------------------------------------------------------------+
| [Search by Node ID or Hazard...]  | Status: [All] [Confirmed] [Resolved] [Suppressed] | Hazard: [All] [Flood] |
+---------------------------------------------------------------------------------------------------------------+
| +--------------------------------+  +--------------------------------+  +--------------------------------+    |
| | 🌊 FLOOD ALERT [CRITICAL]      |  | 🔥 WILDFIRE NOTICE [WARNING]   |  | 💨 SMOKE INCIDENT [SUPPRESSED] |    |
| | Node: node_002 (10:14:02)      |  | Node: node_005 (09:45:10)      |  | Node: node_004 (08:30:15)      |    |
| | Edge Risk: 88 | Area Prob: 92% |  | Edge Risk: 74 | Area Prob: 76% |  | Edge Risk: 68 | Area Prob: 45% |    |
| | Confirmed by: node_001         |  | Confirmed by: node_004         |  | AI: Localized cooking exhaust  |    |
| | Status: Active [Mark Resolved] |  | Status: Resolved               |  | Status: Suppressed (No Alarm)  |    |
| +--------------------------------+  +--------------------------------+  +--------------------------------+    |
+---------------------------------------------------------------------------------------------------------------+
```

---

### Screen 5: Disaster Risk Threshold Management (`/settings/thresholds`)
Authority configuration screen to adjust edge scoring trigger thresholds with full audit trails.

```
+---------------------------------------------------------------------------------------------------------------+
| [Sliders] Disaster Risk Threshold Management                   [✓ Thresholds Saved & Dispatched via Mesh]     |
+-----------------------------------------------------+---------------------------------------------------------+
| CONFIGURE HAZARD TRIGGER BANDS                      | AUDIT TRAIL HISTORY (FLOOD)                             |
| [ 🌊 Flood Surge ]  [ 🔥 Wildfire ]  [ 💨 AQI ]     | +-----------------------------------------------------+ |
|                                                     | | admin@aegisnet.org — 2026-09-17 10:00:00            | |
| Tier 1: Watch Level (Dashboard Only)                | | New Limits: Watch=50 | Warn=70 | Crit=85            | |
| [==========o------------------------]  50/100       | +-----------------------------------------------------+ |
|                                                     | +-----------------------------------------------------+ |
| Tier 2: Warning Level (Dashboard + Push)            | | officer@ddma.gov.in — 2026-08-12 14:22:10           | |
| [===================o---------------]  70/100       | | New Limits: Watch=45 | Warn=65 | Crit=80            | |
|                                                     | +-----------------------------------------------------+ |
| Tier 3: Critical Level (Push + SMS + Local Siren)   |                                                         |
| [=========================o---------]  85/100       |                                                         |
|                                                     |                                                         |
| [ Commit Threshold Updates ]                        |                                                         |
+-----------------------------------------------------+---------------------------------------------------------+
```

---

### Screen 6: Regional Risk Analytics & AI Forecasting (`/analytics`)
High-level overview of network-wide indices and cross-node correlations.

```
+---------------------------------------------------------------------------------------------------------------+
| [BarChart] Regional Risk Analytics & AI Forecasting                             [Refresh Network Analysis]    |
+---------------------------------------------------------------------------------------------------------------+
| +-------------------------+ +-------------------------+ +-------------------------+ +-----------------------+ |
| | AREA FLOOD PROBABILITY  | | ONLINE MESH NODES       | | CRITICAL ALERTS         | | FLEET BATTERY AVERAGE | |
| | 82%                     | | 5/5 Active              | | 1 Active Escalation     | | 88%                   | |
| | (Critical Surge)        | | LoRa Flood-Routing OK   | | Total Ingested: 4       | | Solar-Assisted Fleet  | |
| +-------------------------+ +-------------------------+ +-------------------------+ +-----------------------+ |
+---------------------------------------------------------------------------------------------------------------+
| TAPI CATCHMENT SECTOR — 6-HOUR INUNDATION & PREDICTIVE TRAJECTORY                                             |
| [ Interactive Composed Forecast Chart with Rate-of-Change Slope and Upper/Lower Envelope Bands ]              |
+---------------------------------------------------------------------------------------------------------------+
```

---

## 4. UI Component Architecture & Tree

```
frontend/src/
├── App.tsx                     # Top-level Socket.IO listeners, state store, routing
├── main.tsx                    # React root render
├── index.css                   # Tailwind CSS v4 directives + Dark Leaflet map styles
├── lib/
│   ├── apiClient.ts            # Typed REST client for /nodes, /alerts, /thresholds, /analytics
│   ├── socket.ts               # Socket.IO connection singleton
│   └── riskColor.ts            # Scoring & status badge color mapping utilities
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Branding, navigation links, live status, 1-click demo buttons
│   │   └── AppShell.tsx        # Shell wrapping navbar and dynamic page outlet
│   ├── map/
│   │   └── RiskMap.tsx         # Leaflet container, Carto dark tiles, SVG pulsing markers
│   ├── nodes/
│   │   ├── NodeList.tsx        # Searchable/filterable list of sensor node cards
│   │   └── NodeHealthBadge.tsx # Battery %, solar sun indicator, RSSI dBm, last-seen timer
│   ├── alerts/
│   │   ├── AlertFeed.tsx       # Live feed container with tabs for active vs all
│   │   └── AlertCard.tsx       # Alert card with spatial correlation, AI validation, & actions
│   └── charts/
│       ├── TimeSeriesChart.tsx # Recharts area chart for sensor timeseries
│       ├── ForecastChart.tsx   # Recharts composed chart for 3-6h predictive bands
│       └── RiskGauge.tsx       # Circular SVG radial gauge for 0-100 hazard risk
└── pages/
    ├── CommandDashboard.tsx    # 3-column ops control center
    ├── PublicMap.tsx           # Citizen safety portal
    ├── NodeDetailPage.tsx      # Comprehensive timeseries & forecast graphs
    ├── AlertHistoryPage.tsx    # Incident log with CSV export
    ├── ThresholdConfigPage.tsx # Threshold sliders with audit trail
    └── AnalyticsPage.tsx       # Regional KPI cards and macro forecast curves
```

---

## 5. Live Simulation Trigger Architecture

To enable instant evaluator demonstrations during hackathon presentations or judge inspections, the UI features embedded trigger controls in [`Navbar.tsx`](file:///e:/Aegisnet_SIH2026/frontend/src/components/layout/Navbar.tsx):

1. **Flood Surge Button (`🌊 Flood Surge`)**:
   - Injects a simulated flash surge packet at `node_002` (Water: 92 cm, Risk: 88/100).
   - Instant visual effect: Node turns red on the map, displays an animated ping ripple, and pushes a Tier 3 Critical Alert into the feed.
2. **Wildfire Button (`🔥 Wildfire`)**:
   - Injects a simulated ignition at `node_005` (Flame: True, Smoke: 240 ppm, Temp: 49.5°C, Risk: 92/100).
3. **Toxic AQI Button (`💨 Toxic AQI`)**:
   - Injects an industrial pollution event at `node_004` (Smoke: 180 ppm, Risk: 78/100).
4. **AI False-Positive Rejection (via Simulator)**:
   - When localized cooking smoke occurs (smoke high, temperature normal, no flame), the AI service flags it as `Suppressed` in amber, preventing false alarm fatigue.

---

## 6. Access & Port Information

| Surface | Port | URL |
|---|---|---|
| **Ops Dashboard** | `5180` | [http://localhost:5180/dashboard](http://localhost:5180/dashboard) |
| **Public Map** | `5180` | [http://localhost:5180/](http://localhost:5180/) |
| **Backend REST & WebSocket** | `5001` | [http://localhost:5001](http://localhost:5001) |
| **AI Microservice Swagger** | `8001` | [http://localhost:8001/docs](http://localhost:8001/docs) |
