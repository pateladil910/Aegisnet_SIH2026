import { AegisNode, SensorReading, AlertItem, HazardThreshold, User } from '../types';

class DataStore {
  public nodes: Map<string, AegisNode> = new Map();
  public readings: SensorReading[] = []; // In-memory time-series
  public alerts: Map<string, AlertItem> = new Map();
  public thresholds: Map<string, HazardThreshold> = new Map();
  public users: Map<string, User> = new Map();
  public seenPacketIds: Set<string> = new Set(); // For mesh deduplication

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Nodes (Tapi River Basin / Surat Area)
    const seedNodes: AegisNode[] = [
      {
        _id: 'node_001',
        label: 'Tapi Riverbank North',
        location: { type: 'Point', coordinates: [72.8258, 21.2014] },
        hazardTypes: ['flood'],
        hardware: { sensors: ['HC-SR04', 'DHT22', 'SoilMoisture'], firmwareVersion: '1.2.0' },
        status: 'online',
        battery: 92,
        solarCharging: true,
        rssi: -65,
        lastSeen: new Date().toISOString(),
        createdAt: '2026-06-01T00:00:00Z',
        currentRisk: { flood: 22, fire: 5, pollution: 18 }
      },
      {
        _id: 'node_002',
        label: 'Weir Causeway Checkpoint',
        location: { type: 'Point', coordinates: [72.8311, 21.1959] },
        hazardTypes: ['flood', 'pollution'],
        hardware: { sensors: ['HC-SR04', 'MQ135', 'DHT22'], firmwareVersion: '1.2.0' },
        status: 'online',
        battery: 84,
        solarCharging: true,
        rssi: -71,
        lastSeen: new Date().toISOString(),
        createdAt: '2026-06-01T00:00:00Z',
        currentRisk: { flood: 35, fire: 8, pollution: 32 }
      },
      {
        _id: 'node_003',
        label: 'Singanpore Downstream Sluice',
        location: { type: 'Point', coordinates: [72.8122, 21.2188] },
        hazardTypes: ['flood'],
        hardware: { sensors: ['HC-SR04', 'DHT22'], firmwareVersion: '1.2.0' },
        status: 'online',
        battery: 78,
        solarCharging: false,
        rssi: -79,
        lastSeen: new Date().toISOString(),
        createdAt: '2026-06-02T00:00:00Z',
        currentRisk: { flood: 28, fire: 4, pollution: 20 }
      },
      {
        _id: 'node_004',
        label: 'Sachin Industrial Buffer',
        location: { type: 'Point', coordinates: [72.8845, 21.0890] },
        hazardTypes: ['pollution', 'fire'],
        hardware: { sensors: ['MQ135', 'Flame-IR', 'DHT22'], firmwareVersion: '1.2.0' },
        status: 'online',
        battery: 95,
        solarCharging: true,
        rssi: -68,
        lastSeen: new Date().toISOString(),
        createdAt: '2026-06-03T00:00:00Z',
        currentRisk: { flood: 10, fire: 15, pollution: 48 }
      },
      {
        _id: 'node_005',
        label: 'Mandvi Forest Perimeter',
        location: { type: 'Point', coordinates: [73.2980, 21.2580] },
        hazardTypes: ['fire'],
        hardware: { sensors: ['Flame-IR', 'MQ135', 'DHT22', 'SoilMoisture'], firmwareVersion: '1.2.0' },
        status: 'online',
        battery: 88,
        solarCharging: true,
        rssi: -82,
        lastSeen: new Date().toISOString(),
        createdAt: '2026-06-05T00:00:00Z',
        currentRisk: { flood: 5, fire: 25, pollution: 12 }
      }
    ];

    for (const node of seedNodes) {
      this.nodes.set(node._id, node);
      // Generate 24 hours of 1-hour interval historical readings
      const now = Date.now();
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now - i * 3600 * 1000).toISOString();
        const baseWater = node._id === 'node_002' ? 45 : 30;
        const waterFluctuation = Math.sin(i / 3) * 6 + (Math.random() * 4 - 2);
        const reading: SensorReading = {
          nodeId: node._id,
          timestamp: time,
          waterLevelCm: Math.round(Math.max(10, baseWater + waterFluctuation)),
          flame: false,
          smokePpm: Math.round(50 + Math.random() * 30 + (node._id === 'node_004' ? 60 : 0)),
          aqi: Math.round(60 + Math.random() * 25 + (node._id === 'node_004' ? 50 : 0)),
          tempC: Math.round((28 + Math.sin(i / 4) * 4 + Math.random()) * 10) / 10,
          humidity: Math.round(65 + Math.cos(i / 4) * 15),
          soilMoisture: Math.round(40 + Math.random() * 10),
          riskScores: {
            flood: Math.round(Math.min(100, Math.max(0, 20 + waterFluctuation * 2))),
            fire: Math.round(Math.min(100, Math.max(0, 10 + (32 - (28 + Math.sin(i / 4) * 4)) * 3))),
            pollution: Math.round(node._id === 'node_004' ? 45 + Math.random() * 10 : 20 + Math.random() * 5)
          }
        };
        this.readings.push(reading);
      }
    }

    // 2. Seed Thresholds
    this.thresholds.set('flood', {
      hazard: 'flood',
      region: 'Tapi-Basin',
      watchLevel: 50,
      warningLevel: 70,
      criticalLevel: 85,
      updatedAt: new Date().toISOString(),
      auditLog: [
        {
          changedBy: 'admin@aegisnet.org',
          oldValue: { watch: 45, warning: 65, critical: 80 },
          newValue: { watch: 50, warning: 70, critical: 85 },
          timestamp: '2026-08-01T10:00:00Z'
        }
      ]
    });

    this.thresholds.set('fire', {
      hazard: 'fire',
      region: 'Tapi-Basin',
      watchLevel: 45,
      warningLevel: 65,
      criticalLevel: 80,
      updatedAt: new Date().toISOString(),
      auditLog: []
    });

    this.thresholds.set('pollution', {
      hazard: 'pollution',
      region: 'Tapi-Basin',
      watchLevel: 55,
      warningLevel: 75,
      criticalLevel: 90,
      updatedAt: new Date().toISOString(),
      auditLog: []
    });

    // 3. Seed Seed Alert
    const sampleAlert: AlertItem = {
      _id: 'alert_1001',
      nodeId: 'node_002',
      hazardType: 'flood',
      riskScore: 72,
      severity: 'warning',
      status: 'confirmed',
      correlatedNodes: ['node_001'],
      areaProbabilityIndex: 76,
      notified: ['push:authority_dashboard'],
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      resolvedAt: null,
      rawReading: {
        waterLevelCm: 68,
        tempC: 27.5,
        humidity: 82
      },
      aiValidation: {
        isLikelyFalsePositive: false,
        reason: 'Corroborated by rapid water level climb (+14cm/hr) and neighboring catchment node_001 uptick'
      }
    };
    this.alerts.set(sampleAlert._id, sampleAlert);

    // 4. Seed Default Users
    this.users.set('authority@aegisnet.org', {
      id: 'usr_01',
      email: 'authority@aegisnet.org',
      role: 'authority',
      region: 'Tapi-Basin',
      name: 'District Disaster Management Officer'
    });
    this.users.set('admin@aegisnet.org', {
      id: 'usr_00',
      email: 'admin@aegisnet.org',
      role: 'admin',
      region: 'All',
      name: 'AegisNet Root Administrator'
    });
  }
}

export const store = new DataStore();
