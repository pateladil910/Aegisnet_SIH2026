export type HazardType = 'flood' | 'fire' | 'pollution';
export type NodeStatus = 'online' | 'warning' | 'alert' | 'offline';
export type AlertSeverity = 'watch' | 'warning' | 'critical' | 'high';
export type AlertStatus = 'active' | 'confirmed' | 'resolved' | 'suppressed';
export type UserRole = 'public' | 'viewer' | 'authority' | 'admin';

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface SensorHardware {
  sensors: string[];
  firmwareVersion: string;
}

export interface AegisNode {
  _id: string;
  label: string;
  location: GeoLocation;
  hazardTypes: HazardType[];
  hardware: SensorHardware;
  status: NodeStatus;
  battery: number;
  solarCharging: boolean;
  rssi: number;
  lastSeen: string;
  createdAt: string;
  currentRisk?: {
    flood: number;
    fire: number;
    pollution: number;
  };
}

export interface SensorReading {
  nodeId: string;
  timestamp: string;
  waterLevelCm: number;
  flame: boolean;
  smokePpm: number;
  aqi: number;
  tempC: number;
  humidity: number;
  soilMoisture: number;
  riskScores: {
    flood: number;
    fire: number;
    pollution: number;
  };
}

export interface AlertItem {
  _id: string;
  nodeId: string;
  hazardType: HazardType;
  riskScore: number;
  severity: AlertSeverity;
  status: AlertStatus;
  correlatedNodes: string[];
  areaProbabilityIndex: number;
  notified: string[];
  createdAt: string;
  resolvedAt?: string | null;
  rawReading?: Partial<SensorReading>;
  aiValidation?: {
    isLikelyFalsePositive: boolean;
    reason: string;
    confidence?: number;
  };
}

export interface HazardThreshold {
  hazard: HazardType;
  region: string;
  watchLevel: number;
  warningLevel: number;
  criticalLevel: number;
  updatedAt: string;
  auditLog: Array<{
    changedBy: string;
    oldValue: any;
    newValue: any;
    timestamp: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  region: string;
  name: string;
}

export interface ForecastPoint {
  timestamp: string;
  predictedValue: number;
  confidenceLow: number;
  confidenceHigh: number;
}
