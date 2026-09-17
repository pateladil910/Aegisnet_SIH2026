import { AegisNode, AlertItem, HazardThreshold, SensorReading, ForecastPoint } from '../types';

const API_BASE = 'http://localhost:5001/api';

export const apiClient = {
  // Nodes
  getNodes: async (): Promise<AegisNode[]> => {
    const res = await fetch(`${API_BASE}/nodes`);
    const data = await res.json();
    return data.data;
  },

  getNodeDetail: async (id: string): Promise<AegisNode> => {
    const res = await fetch(`${API_BASE}/nodes/${id}`);
    const data = await res.json();
    return data.data;
  },

  getNodeReadings: async (id: string, limit = 50): Promise<SensorReading[]> => {
    const res = await fetch(`${API_BASE}/nodes/${id}/readings?limit=${limit}`);
    const data = await res.json();
    return data.data;
  },

  // Alerts
  getAlerts: async (params?: { status?: string; hazard?: string }): Promise<AlertItem[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.hazard) searchParams.append('hazard', params.hazard);
    const res = await fetch(`${API_BASE}/alerts?${searchParams.toString()}`);
    const data = await res.json();
    return data.data;
  },

  resolveAlert: async (id: string): Promise<AlertItem> => {
    const res = await fetch(`${API_BASE}/alerts/${id}/resolve`, { method: 'PATCH' });
    const data = await res.json();
    return data.data;
  },

  simulateAlert: async (payload: any): Promise<AlertItem> => {
    const res = await fetch(`${API_BASE}/alerts/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.data;
  },

  // Thresholds
  getThresholds: async (): Promise<HazardThreshold[]> => {
    const res = await fetch(`${API_BASE}/thresholds`);
    const data = await res.json();
    return data.data;
  },

  updateThreshold: async (hazard: string, values: any): Promise<HazardThreshold> => {
    const res = await fetch(`${API_BASE}/thresholds/${hazard}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    const data = await res.json();
    return data.data;
  },

  // Analytics
  getFloodIndex: async (region = 'Tapi-Basin') => {
    const res = await fetch(`${API_BASE}/analytics/flood-index?region=${region}`);
    return await res.json();
  },

  getForecast: async (nodeId: string, hazard = 'flood'): Promise<{ series: ForecastPoint[] }> => {
    const res = await fetch(`${API_BASE}/analytics/forecast/${nodeId}?hazard=${hazard}`);
    return await res.json();
  },

  getSummary: async () => {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    const data = await res.json();
    return data.data;
  }
};
