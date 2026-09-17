// store/useStore.js — AegisNet (EcoMonitor) v2.0 Global Zustand Store
// Supporting Light Command Center UI, GSDMA 4-Tier Severity, Multi-Agency Dispatch Kanban, 5 Scenarios & Multilingual Citizen Portal

import { create } from 'zustand'

// ─── 5 Sensor Categories ──────────────────────────────────────────────────────
export const SENSOR_CATEGORIES = [
  {
    id: 'flood',
    name: 'Flood & Water Level',
    icon: '🌊',
    color: '#0B84C9',
    unit: 'm',
    metrics: ['Water Depth', 'Flow Rate', 'Rainfall'],
    desc: 'Ultrasonic depth, Doppler flow rate, and digital tipping-bucket rain gauge.',
  },
  {
    id: 'fire',
    name: 'Fire & Thermal IR',
    icon: '🔥',
    color: '#E0621A',
    unit: '°C',
    metrics: ['Flame IR', 'Temperature', 'Smoke Density'],
    desc: 'Optical IR flame detector, thermal array, and optical smoke particulate.',
  },
  {
    id: 'air',
    name: 'Air Quality (AQI)',
    icon: '🌫️',
    color: '#6B4FA0',
    unit: 'AQI',
    metrics: ['PM2.5', 'PM10', 'NO2', 'CO', 'SO2'],
    desc: 'Laser scattering PM sensor and multi-channel electrochemical gas cells.',
  },
  {
    id: 'chem',
    name: 'Chemical & Toxic Gas',
    icon: '☣️',
    color: '#B58900',
    unit: 'ppm',
    metrics: ['VOC', 'LPG/CH4', 'H2S', 'Ammonia'],
    desc: 'Photoionization detector (PID) and electrochemical industrial leak cells.',
  },
  {
    id: 'seismic',
    name: 'Seismic & Vibration',
    icon: '🌐',
    color: '#475569',
    unit: 'mm/s²',
    metrics: ['Peak Ground Accel', 'Frequency', 'Displacement'],
    desc: 'Tri-axial MEMS accelerometer for dam abutments, bridges, and fault lines.',
  },
]

// ─── Gujarat Regional Preset Boundaries ───────────────────────────────────────
export const REGIONS = [
  { id: 'all', name: 'All Gujarat Grid', center: [22.70, 71.80], zoom: 8 },
  { id: 'gandhinagar', name: '🏛️ Gandhinagar (Capital)', center: [23.22, 72.65], zoom: 13 },
  { id: 'ahmedabad', name: '🏙️ Ahmedabad Metro', center: [23.03, 72.58], zoom: 13 },
  { id: 'surat', name: '🏭 Surat Industrial', center: [21.19, 72.83], zoom: 12 },
  { id: 'vadodara', name: '⚙️ Vadodara Petrochem', center: [22.38, 73.12], zoom: 12 },
]

// ─── Known Gujarat Landmarks for Auto-Detection ──────────────────────────────
export const GUJARAT_LANDMARKS = [
  { name: 'Sant Sarovar Dam / Sabarmati, Gandhinagar', region: 'gandhinagar', category: 'flood', lat: 23.2385, lng: 72.6710, isWater: true },
  { name: 'Indroda Nature Park & Deer Forest, Gandhinagar', region: 'gandhinagar', category: 'fire', lat: 23.1950, lng: 72.6520, isWater: false },
  { name: 'Narmada Main Canal Siphon, Gandhinagar', region: 'gandhinagar', category: 'flood', lat: 23.1670, lng: 72.6010, isWater: true },
  { name: 'Sector 24 GIDC Electronics Estate, Gandhinagar', region: 'gandhinagar', category: 'air', lat: 23.2500, lng: 72.6300, isWater: false },
  { name: 'GIFT City River Corridor, Gandhinagar', region: 'gandhinagar', category: 'flood', lat: 23.1590, lng: 72.6840, isWater: true },
  { name: 'Punit Van Botanical Reserve, Gandhinagar', region: 'gandhinagar', category: 'fire', lat: 23.2100, lng: 72.6400, isWater: false },

  { name: 'Vasna Barrage & Riverfront, Ahmedabad', region: 'ahmedabad', category: 'flood', lat: 23.0010, lng: 72.5570, isWater: true },
  { name: 'Kankaria Lake Reservoir, Ahmedabad', region: 'ahmedabad', category: 'flood', lat: 23.0063, lng: 72.6026, isWater: true },
  { name: 'Vastrapur Lake Catchment, Ahmedabad', region: 'ahmedabad', category: 'flood', lat: 23.0360, lng: 72.5290, isWater: true },
  { name: 'Chandola Lake Basin, Ahmedabad', region: 'ahmedabad', category: 'flood', lat: 22.9868, lng: 72.5892, isWater: true },
  { name: 'Thol Lake Bird Sanctuary & Wetland, Ahmedabad', region: 'ahmedabad', category: 'flood', lat: 23.1412, lng: 72.3980, isWater: true },
  { name: 'Narol-Vatva GIDC Industrial Corridor, Ahmedabad', region: 'ahmedabad', category: 'chem', lat: 22.9734, lng: 72.5898, isWater: false },
  { name: 'Kalupur Commercial Corridor, Ahmedabad', region: 'ahmedabad', category: 'air', lat: 23.0305, lng: 72.6000, isWater: false },

  { name: 'Tapi River Weir Causeway, Surat', region: 'surat', category: 'flood', lat: 21.1959, lng: 72.8302, isWater: true },
  { name: 'Hazira Petrochemical Industrial Belt, Surat', region: 'surat', category: 'chem', lat: 21.1020, lng: 72.6510, isWater: false },
  { name: 'Dumas Coastal Tidal Station, Surat', region: 'surat', category: 'flood', lat: 21.0870, lng: 72.7120, isWater: true },
  { name: 'Pandesara GIDC Textile Cluster, Surat', region: 'surat', category: 'air', lat: 21.1550, lng: 72.8250, isWater: false },

  { name: 'Nandesari Chemical & Pesticide Estate, Vadodara', region: 'vadodara', category: 'chem', lat: 22.4110, lng: 73.0980, isWater: false },
  { name: 'Vishwamitri River Urban Basin, Vadodara', region: 'vadodara', category: 'flood', lat: 22.3110, lng: 73.1890, isWater: true },
  { name: 'Sayaji Baug Botanical Belt, Vadodara', region: 'vadodara', category: 'fire', lat: 22.3130, lng: 73.1930, isWater: false },
  { name: 'Makarpura GIDC Heavy Engineering, Vadodara', region: 'vadodara', category: 'air', lat: 22.2530, lng: 73.1970, isWater: false },
]

export function detectGujaratLandmark(lat, lng) {
  let closest = null
  let minDistance = Infinity

  for (const lm of GUJARAT_LANDMARKS) {
    const dLat = (lat - lm.lat) * 111.0
    const dLng = (lng - lm.lng) * 111.0 * Math.cos((lat * Math.PI) / 180.0)
    const dist = Math.sqrt(dLat * dLat + dLng * dLng)
    if (dist < minDistance) {
      minDistance = dist
      closest = { ...lm, distanceKm: dist }
    }
  }

  if (closest && minDistance <= 4.0) {
    return {
      name: closest.name,
      region: closest.region,
      category: closest.category,
      isNearby: true,
      distanceKm: closest.distanceKm,
      distanceText: `${(closest.distanceKm * 1000).toFixed(0)}m from ${closest.name.split(',')[0]}`,
    }
  }

  return {
    name: `Custom Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
    region: 'ahmedabad',
    category: 'flood',
    isNearby: false,
    distanceKm: 99,
    distanceText: 'Custom GPS Coordinates',
  }
}

// ─── Initial Simulated Fleet (~24 representative active nodes) ───────────────
const INITIAL_NODES = [
  // Gandhinagar
  {
    node_id: 'NODE-01',
    name: 'Sant Sarovar Dam Upstream',
    region: 'gandhinagar',
    city: 'Gandhinagar',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Sant Sarovar Dam, Sabarmati, Gandhinagar',
    latitude: 23.2385,
    longitude: 72.6710,
    status: 'online',
    connectivity: 'WiFi 6 + LoRa Mesh',
    battery_pct: 94,
    solar_charging: true,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 42,
    flow_rate_m3s: 1.2,
    smoke_aqi: 32,
    temperature_c: 28.4,
    humidity_pct: 64,
    gas_ppm: 14,
    seismic_accel: 0.02,
    flame_detected: false,
    local_siren: false,
    risk_score: 18,
    severity: 'advisory',
    last_update: 'Just now',
  },
  {
    node_id: 'NODE-02',
    name: 'Narmada Main Canal Siphon',
    region: 'gandhinagar',
    city: 'Gandhinagar',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Narmada Main Canal Siphon, Gandhinagar',
    latitude: 23.1670,
    longitude: 72.6010,
    status: 'online',
    connectivity: '4G LTE + LoRa Mesh',
    battery_pct: 88,
    solar_charging: true,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 55,
    flow_rate_m3s: 2.4,
    smoke_aqi: 38,
    temperature_c: 29.1,
    humidity_pct: 62,
    gas_ppm: 18,
    seismic_accel: 0.01,
    flame_detected: false,
    local_siren: false,
    risk_score: 22,
    severity: 'advisory',
    last_update: '1 min ago',
  },
  {
    node_id: 'NODE-03',
    name: 'Indroda Nature Park Perimeter',
    region: 'gandhinagar',
    city: 'Gandhinagar',
    category: 'fire',
    sensor_type: 'Fire & Thermal IR',
    location: 'Indroda Nature Park & Deer Forest, Gandhinagar',
    latitude: 23.1950,
    longitude: 72.6520,
    status: 'online',
    connectivity: 'LoRa Mesh Relay',
    battery_pct: 79,
    solar_charging: true,
    firmware_version: 'v2.4.0-edge',
    water_level_cm: 15,
    flow_rate_m3s: 0.1,
    smoke_aqi: 28,
    temperature_c: 31.8,
    humidity_pct: 48,
    gas_ppm: 12,
    seismic_accel: 0.01,
    flame_detected: false,
    local_siren: false,
    risk_score: 15,
    severity: 'advisory',
    last_update: 'Just now',
  },
  {
    node_id: 'NODE-04',
    name: 'Sector 24 GIDC Industrial Cell',
    region: 'gandhinagar',
    city: 'Gandhinagar',
    category: 'air',
    sensor_type: 'Air Quality (AQI)',
    location: 'Sector 24 GIDC Electronics Estate, Gandhinagar',
    latitude: 23.2500,
    longitude: 72.6300,
    status: 'online',
    connectivity: 'WiFi 6 Primary',
    battery_pct: 98,
    solar_charging: false,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 8,
    flow_rate_m3s: 0.0,
    smoke_aqi: 68,
    temperature_c: 32.4,
    humidity_pct: 54,
    gas_ppm: 34,
    seismic_accel: 0.03,
    flame_detected: false,
    local_siren: false,
    risk_score: 28,
    severity: 'advisory',
    last_update: '2 min ago',
  },
  {
    node_id: 'NODE-05',
    name: 'GIFT City Sabarmati Riverfront',
    region: 'gandhinagar',
    city: 'Gandhinagar',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'GIFT City River Corridor, Gandhinagar',
    latitude: 23.1590,
    longitude: 72.6840,
    status: 'online',
    connectivity: '5G Dedicated Gateway',
    battery_pct: 100,
    solar_charging: true,
    firmware_version: 'v2.4.2-edge',
    water_level_cm: 48,
    flow_rate_m3s: 1.8,
    smoke_aqi: 42,
    temperature_c: 28.7,
    humidity_pct: 65,
    gas_ppm: 16,
    seismic_accel: 0.02,
    flame_detected: false,
    local_siren: false,
    risk_score: 20,
    severity: 'advisory',
    last_update: 'Just now',
  },

  // Ahmedabad
  {
    node_id: 'NODE-06',
    name: 'Vasna Barrage Sluice Gate',
    region: 'ahmedabad',
    city: 'Ahmedabad',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Vasna Barrage & Riverfront, Ahmedabad',
    latitude: 23.0010,
    longitude: 72.5570,
    status: 'online',
    connectivity: '4G LTE + LoRa Mesh',
    battery_pct: 91,
    solar_charging: true,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 62,
    flow_rate_m3s: 3.1,
    smoke_aqi: 58,
    temperature_c: 30.2,
    humidity_pct: 66,
    gas_ppm: 22,
    seismic_accel: 0.04,
    flame_detected: false,
    local_siren: false,
    risk_score: 25,
    severity: 'advisory',
    last_update: 'Just now',
  },
  {
    node_id: 'NODE-07',
    name: 'Kankaria Lake North Reservoir',
    region: 'ahmedabad',
    city: 'Ahmedabad',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Kankaria Lake Reservoir, Ahmedabad',
    latitude: 23.0063,
    longitude: 72.6026,
    status: 'online',
    connectivity: 'WiFi 6 Primary',
    battery_pct: 85,
    solar_charging: true,
    firmware_version: 'v2.4.0-edge',
    water_level_cm: 50,
    flow_rate_m3s: 0.4,
    smoke_aqi: 64,
    temperature_c: 31.0,
    humidity_pct: 68,
    gas_ppm: 19,
    seismic_accel: 0.02,
    flame_detected: false,
    local_siren: false,
    risk_score: 22,
    severity: 'advisory',
    last_update: '1 min ago',
  },
  {
    node_id: 'NODE-08',
    name: 'Narol-Vatva Chemical Corridor',
    region: 'ahmedabad',
    city: 'Ahmedabad',
    category: 'chem',
    sensor_type: 'Chemical & Toxic Gas',
    location: 'Narol-Vatva GIDC Industrial Corridor, Ahmedabad',
    latitude: 22.9734,
    longitude: 72.5898,
    status: 'online',
    connectivity: '4G LTE Gateway',
    battery_pct: 95,
    solar_charging: false,
    firmware_version: 'v2.4.2-edge',
    water_level_cm: 12,
    flow_rate_m3s: 0.0,
    smoke_aqi: 95,
    temperature_c: 33.5,
    humidity_pct: 50,
    gas_ppm: 46,
    seismic_accel: 0.05,
    flame_detected: false,
    local_siren: false,
    risk_score: 36,
    severity: 'advisory',
    last_update: 'Just now',
  },
  {
    node_id: 'NODE-09',
    name: 'Vastrapur Lake Catchment',
    region: 'ahmedabad',
    city: 'Ahmedabad',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Vastrapur Lake Catchment, Ahmedabad',
    latitude: 23.0360,
    longitude: 72.5290,
    status: 'online',
    connectivity: 'WiFi 6 Primary',
    battery_pct: 78,
    solar_charging: true,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 38,
    flow_rate_m3s: 0.2,
    smoke_aqi: 52,
    temperature_c: 29.8,
    humidity_pct: 60,
    gas_ppm: 15,
    seismic_accel: 0.02,
    flame_detected: false,
    local_siren: false,
    risk_score: 18,
    severity: 'advisory',
    last_update: '3 min ago',
  },
  {
    node_id: 'NODE-10',
    name: 'Thol Bird Sanctuary Wetland',
    region: 'ahmedabad',
    city: 'Ahmedabad',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Thol Lake Bird Sanctuary & Wetland, Ahmedabad',
    latitude: 23.1412,
    longitude: 72.3980,
    status: 'online',
    connectivity: 'LoRa Mesh Solar Relay',
    battery_pct: 92,
    solar_charging: true,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 70,
    flow_rate_m3s: 0.6,
    smoke_aqi: 22,
    temperature_c: 27.5,
    humidity_pct: 72,
    gas_ppm: 8,
    seismic_accel: 0.01,
    flame_detected: false,
    local_siren: false,
    risk_score: 24,
    severity: 'advisory',
    last_update: 'Just now',
  },

  // Surat
  {
    node_id: 'NODE-11',
    name: 'Tapi River Weir Causeway',
    region: 'surat',
    city: 'Surat',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Tapi River Weir Causeway, Surat',
    latitude: 21.1959,
    longitude: 72.8302,
    status: 'online',
    connectivity: '4G LTE + LoRa Mesh',
    battery_pct: 86,
    solar_charging: true,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 58,
    flow_rate_m3s: 4.5,
    smoke_aqi: 48,
    temperature_c: 30.8,
    humidity_pct: 75,
    gas_ppm: 20,
    seismic_accel: 0.03,
    flame_detected: false,
    local_siren: false,
    risk_score: 26,
    severity: 'advisory',
    last_update: 'Just now',
  },
  {
    node_id: 'NODE-12',
    name: 'Hazira Petrochem Hazard Sentinel',
    region: 'surat',
    city: 'Surat',
    category: 'chem',
    sensor_type: 'Chemical & Toxic Gas',
    location: 'Hazira Petrochemical Industrial Belt, Surat',
    latitude: 21.1020,
    longitude: 72.6510,
    status: 'online',
    connectivity: 'WiFi 6 + Cellular',
    battery_pct: 97,
    solar_charging: false,
    firmware_version: 'v2.4.2-edge',
    water_level_cm: 10,
    flow_rate_m3s: 0.0,
    smoke_aqi: 88,
    temperature_c: 33.1,
    humidity_pct: 68,
    gas_ppm: 42,
    seismic_accel: 0.06,
    flame_detected: false,
    local_siren: false,
    risk_score: 34,
    severity: 'advisory',
    last_update: '2 min ago',
  },
  {
    node_id: 'NODE-13',
    name: 'Dumas Coastal Surge Station',
    region: 'surat',
    city: 'Surat',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Dumas Coastal Tidal Station, Surat',
    latitude: 21.0870,
    longitude: 72.7120,
    status: 'online',
    connectivity: 'LoRa Mesh Relay',
    battery_pct: 82,
    solar_charging: true,
    firmware_version: 'v2.4.0-edge',
    water_level_cm: 65,
    flow_rate_m3s: 2.1,
    smoke_aqi: 35,
    temperature_c: 29.4,
    humidity_pct: 80,
    gas_ppm: 14,
    seismic_accel: 0.02,
    flame_detected: false,
    local_siren: false,
    risk_score: 25,
    severity: 'advisory',
    last_update: 'Just now',
  },

  // Vadodara
  {
    node_id: 'NODE-14',
    name: 'Nandesari GIDC Toxic VOC Sentinel',
    region: 'vadodara',
    city: 'Vadodara',
    category: 'chem',
    sensor_type: 'Chemical & Toxic Gas',
    location: 'Nandesari Chemical & Pesticide Estate, Vadodara',
    latitude: 22.4110,
    longitude: 73.0980,
    status: 'online',
    connectivity: '4G LTE Primary',
    battery_pct: 90,
    solar_charging: true,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 14,
    flow_rate_m3s: 0.0,
    smoke_aqi: 82,
    temperature_c: 32.0,
    humidity_pct: 58,
    gas_ppm: 40,
    seismic_accel: 0.03,
    flame_detected: false,
    local_siren: false,
    risk_score: 32,
    severity: 'advisory',
    last_update: '1 min ago',
  },
  {
    node_id: 'NODE-15',
    name: 'Vishwamitri River Urban Basin',
    region: 'vadodara',
    city: 'Vadodara',
    category: 'flood',
    sensor_type: 'Flood & Water Level',
    location: 'Vishwamitri River Urban Basin, Vadodara',
    latitude: 22.3110,
    longitude: 73.1890,
    status: 'online',
    connectivity: 'LoRa Mesh Gateway',
    battery_pct: 84,
    solar_charging: true,
    firmware_version: 'v2.4.1-edge',
    water_level_cm: 45,
    flow_rate_m3s: 1.5,
    smoke_aqi: 56,
    temperature_c: 30.5,
    humidity_pct: 64,
    gas_ppm: 21,
    seismic_accel: 0.02,
    flame_detected: false,
    local_siren: false,
    risk_score: 21,
    severity: 'advisory',
    last_update: 'Just now',
  },
]

// ─── Initial Incident Alerts (GSDMA 4-Tier) ──────────────────────────────────
const INITIAL_ALERTS = [
  {
    id: 'ALT-101',
    node_id: 'NODE-08',
    category: 'chem',
    hazard: 'chemical',
    severity: 'warning',
    risk_score: 58,
    title: 'Elevated Volatile Organic Chemical Plume',
    location: 'Narol-Vatva GIDC Industrial Corridor, Ahmedabad',
    landmark_tag: 'Near Vatva GIDC Pumping Station',
    timestamp: '12 min ago',
    acknowledged: false,
    correlated_nodes: 2,
    confidence_pct: 86.4,
    root_cause: 'MQ-135 and PID sensor detected sustained VOC surge (>45 ppm) across 2 adjacent nodes.',
    readings_snapshot: { gas_ppm: 46, smoke_aqi: 95, temp_c: 33.5 },
    dispatch_status: 'Notified',
  },
  {
    id: 'ALT-102',
    node_id: 'NODE-06',
    category: 'flood',
    hazard: 'flood',
    severity: 'watch',
    risk_score: 44,
    title: 'Upstream Discharge Advisory: Sabarmati Vasna',
    location: 'Vasna Barrage & Riverfront, Ahmedabad',
    landmark_tag: 'Vasna Barrage Gate 14',
    timestamp: '28 min ago',
    acknowledged: true,
    acknowledged_by: 'Officer R. Sharma (GSDMA)',
    correlated_nodes: 1,
    confidence_pct: 78.2,
    root_cause: 'Ultrasonic sensor registered steady inflow rate change +8 cm/hr.',
    readings_snapshot: { water_level_cm: 62, flow_rate_m3s: 3.1 },
    dispatch_status: 'Acknowledged',
  },
]

// ─── Initial Multi-Agency Dispatch Board (Kanban) ─────────────────────────────
const INITIAL_DISPATCHES = [
  {
    agency: 'GSDMA (State Disaster Authority)',
    contact: '+91 79 23259283 / alert@gsdma.gov.in',
    status: 'Acknowledged', // 'Not Notified' | 'Notified' | 'Acknowledged' | 'Responding' | 'On Scene'
    sla_min: 2,
    notified_at: '12 min ago',
    acknowledged_at: '10 min ago',
    officer: 'Dy. Collector K. Patel',
    channel: 'Automated SMS + VoIP Bridge',
  },
  {
    agency: 'Fire & Emergency Services (101)',
    contact: 'Ahmedabad Fire HQ (Danilimda)',
    status: 'Responding',
    sla_min: 5,
    notified_at: '12 min ago',
    acknowledged_at: '8 min ago',
    officer: 'Station Officer S. Rathod',
    channel: 'CAD Dispatch Webhook',
  },
  {
    agency: 'Municipal Corporation (AMC)',
    contact: 'Control Room Drainage & Health',
    status: 'Notified',
    sla_min: 10,
    notified_at: '11 min ago',
    acknowledged_at: null,
    officer: 'Pending Duty Engineer',
    channel: 'SMS Gateway + Email',
  },
  {
    agency: 'Gujarat Police Control (100)',
    contact: 'Vatva Police Station & Traffic Cell',
    status: 'Acknowledged',
    sla_min: 5,
    notified_at: '12 min ago',
    acknowledged_at: '9 min ago',
    officer: 'PSI V. Zala',
    channel: 'Police Wireless Terminal',
  },
  {
    agency: 'GVK EMRI Ambulance (108)',
    contact: 'EMS Cluster Unit 14-A',
    status: 'Not Notified',
    sla_min: 5,
    notified_at: null,
    acknowledged_at: null,
    officer: 'Standby Triage',
    channel: 'EMRI Dispatch API',
  },
]

// ─── Initial Public Advisories (Citizen Portal) ──────────────────────────────
const INITIAL_ADVISORIES = [
  {
    id: 'ADV-01',
    zone: 'Narol-Vatva & Isanpur Zone (Ahmedabad)',
    severity: 'watch',
    published_at: '15 min ago',
    published_by: 'GSDMA Emergency Duty Officer',
    en: {
      title: 'Air Quality & Chemical Vapor Watch',
      message: 'Elevated industrial particulate and chemical odor detected in Narol-Vatva. Residents with asthma or respiratory conditions are advised to remain indoors and keep windows closed.',
      action: 'Wear N95 masks outdoors • Avoid heavy outdoor physical activity.',
    },
    gu: {
      title: 'હવાની ગુણવત્તા અને રાસાયણિક વરાળ વોચ',
      message: 'નારોલ-વટવા વિસ્તારમાં ઔદ્યોગિક પ્રદૂષણનું પ્રમાણ વધુ નોંધાયું છે. શ્વાસની તકલીફ ધરાવતા નાગરિકોને ઘરમાં રહેવાની અને બારીઓ બંધ રાખવાની સલાહ આપવામાં આવે છે.',
      action: 'બહાર નીકળતી વખતે N95 માસ્ક પહેરો • બહારની ભારે કસરત ટાળો.',
    },
    hi: {
      title: 'वायु गुणवत्ता एवं रासायनिक वाष्प वॉच',
      message: 'नारोल-वटवा क्षेत्र में औद्योगिक गंध एवं प्रदूषण बढ़ा हुआ दर्ज हुआ है। सांस की परेशानी वाले नागरिक घर के अंदर रहें और खिड़कियां बंद रखें।',
      action: 'बाहर जाते समय N95 मास्क पहनें • भारी बाहरी गतिविधियों से बचें।',
    },
  },
]

// ─── False-Positive Suppression Log ──────────────────────────────────────────
const INITIAL_SUPPRESSIONS = [
  {
    id: 'SUP-401',
    node_id: 'NODE-04',
    time: '24 min ago',
    sensor: 'MQ-135 Gas Cell',
    spike_val: '78 ppm VOC',
    reason: 'Vehicle exhaust transient from passing diesel truck — rate-of-change decayed within 35s. Classified as non-hazard by Qualcomm edge model.',
    action: 'Suppressed on-device (Zero false alarm dispatch)',
  },
  {
    id: 'SUP-402',
    node_id: 'NODE-07',
    time: '1h 14m ago',
    sensor: 'Ultrasonic Depth',
    spike_val: 'Water surge +24 cm',
    reason: 'Transient speed-boat wake at Kankaria lake. Multi-sensor fusion with adjacent flood nodes confirmed no regional reservoir rise.',
    action: 'Suppressed on-device',
  },
  {
    id: 'SUP-403',
    node_id: 'NODE-03',
    time: '3h 05m ago',
    sensor: 'Thermal IR',
    spike_val: '46.2°C IR Spike',
    reason: 'Solar glare reflection off park maintenance vehicle roof. Optical flame channel was negative.',
    action: 'Suppressed on-device',
  },
]

// ─── Main Zustand Store ───────────────────────────────────────────────────────
export const useStore = create((set, get) => ({
  // Active Navigation & Filters
  selectedRegion: 'all', // 'all' | 'gandhinagar' | 'ahmedabad' | 'surat' | 'vadodara'
  setSelectedRegion: (region) => set({ selectedRegion: region }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  scenarioDrawerOpen: false,
  setScenarioDrawerOpen: (open) => set({ scenarioDrawerOpen: open }),

  emergencyModalData: null, // { title, message, onConfirm }
  setEmergencyModalData: (data) => set({ emergencyModalData: data }),

  // Fleet & Telemetry State
  nodes: INITIAL_NODES,
  alerts: INITIAL_ALERTS,
  dispatches: INITIAL_DISPATCHES,
  advisories: INITIAL_ADVISORIES,
  suppressionLog: INITIAL_SUPPRESSIONS,

  // Hardware Mode ('simulated' | 'live')
  hardwareMode: 'simulated',
  setHardwareMode: (mode) => set({ hardwareMode: mode }),

  // Public Portal Language ('en' | 'gu' | 'hi')
  publicLanguage: 'en',
  setPublicLanguage: (lang) => set({ publicLanguage: lang }),

  // Active Simulation Scenario
  activeScenario: null, // 'flood' | 'fire' | 'gas' | 'false_positive' | 'lora_drill' | null

  // System Audit Log
  auditLog: [
    { id: 1, action: 'System Bootstrapped', user: 'System Kernel', time: '1h ago', details: 'AegisNet v2.0 Command Center initialised across 142 nodes.' },
    { id: 2, action: 'Alert Acknowledged', user: 'Officer R. Sharma (GSDMA)', time: '28 min ago', details: 'Sabarmati Vasna Barrage watch verified.' },
    { id: 3, action: 'Advisory Published', user: 'GSDMA Emergency Duty Officer', time: '15 min ago', details: 'Published Narol-Vatva air quality watch in 3 languages.' },
  ],

  addAuditLog: (action, user, details) => {
    set((state) => ({
      auditLog: [
        { id: Date.now(), action, user, time: 'Just now', details },
        ...state.auditLog,
      ],
    }))
  },

  // ─── Sensor Node Actions ───────────────────────────────────────────────────
  addNode: (nodeData) => {
    const newNode = {
      node_id: `NODE-${String(get().nodes.length + 1).padStart(2, '0')}`,
      status: 'online',
      connectivity: nodeData.connectivity || 'WiFi 6 + LoRa Mesh',
      battery_pct: nodeData.battery_pct || 100,
      solar_charging: true,
      firmware_version: 'v2.4.2-edge',
      water_level_cm: 35,
      flow_rate_m3s: 0.8,
      smoke_aqi: 40,
      temperature_c: 28.5,
      humidity_pct: 60,
      gas_ppm: 16,
      seismic_accel: 0.02,
      flame_detected: false,
      local_siren: false,
      risk_score: 18,
      severity: 'advisory',
      last_update: 'Just now',
      ...nodeData,
    }
    set((s) => ({ nodes: [newNode, ...s.nodes] }))
    get().addAuditLog('Node Deployed', 'Command Officer', `Provisioned ${newNode.node_id} at ${newNode.location}`)
  },

  muteNode: (nodeId) => {
    set((s) => ({
      nodes: s.nodes.map((n) => (n.node_id === nodeId ? { ...n, status: n.status === 'muted' ? 'online' : 'muted' } : n)),
    }))
    get().addAuditLog('Node Mute Toggled', 'Operator', `Toggled maintenance mute for ${nodeId}`)
  },

  // ─── Alert Management ──────────────────────────────────────────────────────
  acknowledgeAlert: (alertId, officerName = 'Officer K. Patel (GSDMA)') => {
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === alertId
          ? { ...a, acknowledged: true, acknowledged_by: officerName, dispatch_status: 'Acknowledged' }
          : a
      ),
    }))
    get().addAuditLog('Alert Acknowledged', officerName, `Acknowledged ${alertId} with audit trail`)
  },

  // ─── Multi-Agency Dispatch Actions ─────────────────────────────────────────
  advanceDispatchStage: (agencyName) => {
    const STAGES = ['Not Notified', 'Notified', 'Acknowledged', 'Responding', 'On Scene']
    set((s) => ({
      dispatches: s.dispatches.map((d) => {
        if (d.agency === agencyName) {
          const currentIndex = STAGES.indexOf(d.status)
          const nextStage = currentIndex < STAGES.length - 1 ? STAGES[currentIndex + 1] : STAGES[currentIndex]
          return { ...d, status: nextStage }
        }
        return d
      }),
    }))
    get().addAuditLog('Dispatch Stage Advanced', 'Command Dispatcher', `${agencyName} status updated`)
  },

  escalateAllAgencies: () => {
    set((s) => ({
      dispatches: s.dispatches.map((d) => ({
        ...d,
        status: d.status === 'Not Notified' ? 'Notified' : d.status === 'Notified' ? 'Acknowledged' : d.status,
      })),
    }))
    get().addAuditLog('Mass Agency Escalation', 'GSDMA Duty Chief', 'All agency channels triggered with High Priority')
  },

  // ─── Public Citizen Advisories ─────────────────────────────────────────────
  publishAdvisory: (advisoryDraft) => {
    const newAdv = {
      id: `ADV-${String(get().advisories.length + 1).padStart(2, '0')}`,
      published_at: 'Just now',
      published_by: 'Authorized GSDMA Officer',
      ...advisoryDraft,
    }
    set((s) => ({ advisories: [newAdv, ...s.advisories] }))
    get().addAuditLog('Public Advisory Pushed', 'GSDMA Officer', `Broadcasted advisory ${newAdv.id} to citizen portal`)
  },

  // ─── 5 Scenario Injections ─────────────────────────────────────────────────
  triggerScenario: (scenarioType) => {
    set({ activeScenario: scenarioType })

    if (scenarioType === 'flood') {
      // 1. Sabarmati Flash Flood Surge
      set((s) => ({
        nodes: s.nodes.map((n) => {
          if (n.node_id === 'NODE-01' || n.node_id === 'NODE-02' || n.node_id === 'NODE-05') {
            return {
              ...n,
              water_level_cm: 185,
              flow_rate_m3s: 14.8,
              risk_score: 94,
              severity: 'emergency',
              local_siren: true, // Offline-first local siren fires immediately!
            }
          }
          if (n.node_id === 'NODE-06') {
            // Downstream early warning!
            return {
              ...n,
              risk_score: 65,
              severity: 'warning',
              water_level_cm: 72,
            }
          }
          return n
        }),
        alerts: [
          {
            id: `ALT-EMG-${Date.now()}`,
            node_id: 'NODE-01',
            category: 'flood',
            hazard: 'flood',
            severity: 'emergency',
            risk_score: 94,
            title: '🚨 FLASH FLOOD SURGE: Sabarmati River Basin',
            location: 'Sant Sarovar Dam, Sabarmati, Gandhinagar',
            landmark_tag: 'Sant Sarovar Dam Spillway',
            timestamp: 'Just now',
            acknowledged: false,
            correlated_nodes: 3,
            confidence_pct: 95.8,
            root_cause: 'Instantaneous rate of change +48cm/min across 3 upstream nodes. Sub-5s local siren tripped.',
            readings_snapshot: { water_level_cm: 185, flow_rate_m3s: 14.8 },
            dispatch_status: 'Notified',
          },
          ...s.alerts,
        ],
      }))
      get().addAuditLog('Scenario Injected', 'Scenario Simulator', 'Flash Flood Sabarmati Upstream Surge triggered')
    } else if (scenarioType === 'fire') {
      // 2. Forest Fire Outbreak
      set((s) => ({
        nodes: s.nodes.map((n) => {
          if (n.node_id === 'NODE-03') {
            return {
              ...n,
              flame_detected: true,
              temperature_c: 56.4,
              humidity_pct: 16,
              smoke_aqi: 240,
              risk_score: 92,
              severity: 'emergency',
              local_siren: true,
            }
          }
          return n
        }),
        alerts: [
          {
            id: `ALT-FIRE-${Date.now()}`,
            node_id: 'NODE-03',
            category: 'fire',
            hazard: 'fire',
            severity: 'emergency',
            risk_score: 92,
            title: '🔥 THERMAL EMERGENCY: Indroda Forest Reserve',
            location: 'Indroda Nature Park & Deer Forest, Gandhinagar',
            landmark_tag: 'Indroda Forest Perimeter Sector 9',
            timestamp: 'Just now',
            acknowledged: false,
            correlated_nodes: 2,
            confidence_pct: 93.2,
            root_cause: 'Optical IR flame sensor TRUE + ambient temperature 56.4°C + humidity collapse.',
            readings_snapshot: { temp_c: 56.4, smoke_aqi: 240, humidity_pct: 16 },
            dispatch_status: 'Notified',
          },
          ...s.alerts,
        ],
      }))
      get().addAuditLog('Scenario Injected', 'Scenario Simulator', 'Indroda Forest Fire Outbreak triggered')
    } else if (scenarioType === 'gas') {
      // 3. Industrial Chemical / Toxic Gas Leak
      set((s) => ({
        nodes: s.nodes.map((n) => {
          if (n.node_id === 'NODE-08' || n.node_id === 'NODE-14') {
            return {
              ...n,
              gas_ppm: 145,
              smoke_aqi: 280,
              risk_score: 89,
              severity: 'emergency',
              local_siren: true,
            }
          }
          return n
        }),
        alerts: [
          {
            id: `ALT-GAS-${Date.now()}`,
            node_id: 'NODE-08',
            category: 'chem',
            hazard: 'chemical',
            severity: 'emergency',
            risk_score: 89,
            title: '☣️ TOXIC CHEMICAL CLOUD: Vatva Industrial GIDC',
            location: 'Narol-Vatva GIDC Industrial Corridor, Ahmedabad',
            landmark_tag: 'Chemical Phase-II Buffer',
            timestamp: 'Just now',
            acknowledged: false,
            correlated_nodes: 2,
            confidence_pct: 91.5,
            root_cause: 'Photoionization gas detector registered toxic VOC plume (145 ppm) with prevailing NE wind vector.',
            readings_snapshot: { gas_ppm: 145, smoke_aqi: 280 },
            dispatch_status: 'Notified',
          },
          ...s.alerts,
        ],
      }))
      get().addAuditLog('Scenario Injected', 'Scenario Simulator', 'Vatva Chemical Leak HAZMAT scenario triggered')
    } else if (scenarioType === 'false_positive') {
      // 4. False-Positive Edge Model Suppression Test
      const newSupp = {
        id: `SUP-${Date.now()}`,
        node_id: 'NODE-09',
        time: 'Just now',
        sensor: 'Optical Smoke AQI',
        spike_val: 'Instant 210 AQI (Transient)',
        reason: 'Temporary municipal leaf burning smoke plume drifted over node. Adjacent node NODE-07 and water sensors registered zero corroboration. Edge model suppressed false alarm dispatch.',
        action: 'Suppressed on-device (Zero emergency dispatch)',
      }
      set((s) => ({
        suppressionLog: [newSupp, ...s.suppressionLog],
      }))
      get().addAuditLog('False-Positive Suppressed', 'Qualcomm Edge Model', 'Single-node transient correctly blocked from alerting')
    } else if (scenarioType === 'lora_drill') {
      // 5. Network Degradation / LoRa Mesh Drill
      set((s) => ({
        nodes: s.nodes.map((n) => ({
          ...n,
          connectivity: 'LoRa Mesh Fallback (WAN Outage)',
          status: 'degraded',
        })),
      }))
      get().addAuditLog('Network Drill Initiated', 'System Admin', 'WAN severed: entire fleet switched to LoRa peer-to-peer mesh')
    } else if (scenarioType === 'reset' || scenarioType === null) {
      // Reset to safe baseline
      set({
        activeScenario: null,
        nodes: INITIAL_NODES,
      })
      get().addAuditLog('Simulation Reset', 'Operator', 'Returned fleet to normal baseline state')
    }
  },
}))

// ─── Authentication Store ─────────────────────────────────────────────────────
const savedToken = typeof window !== 'undefined' ? localStorage.getItem('aegisnet_token') : null
const savedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('aegisnet_user') || 'null') : null

export const useAuthStore = create((set) => ({
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aegisnet_token', token)
      localStorage.setItem('aegisnet_user', JSON.stringify(user))
    }
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aegisnet_token')
      localStorage.removeItem('aegisnet_user')
    }
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

// ─── Theme Store ─────────────────────────────────────────────────────────────
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aegisnet_theme', 'light')
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('dark')
  }
  return 'light'
}

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aegisnet_theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('dark')
      }
    }
    set({ theme })
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark'
      if (typeof window !== 'undefined') {
        localStorage.setItem('aegisnet_theme', nextTheme)
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark')
          document.body.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
          document.body.classList.remove('dark')
        }
      }
      return { theme: nextTheme }
    })
  }
}))

