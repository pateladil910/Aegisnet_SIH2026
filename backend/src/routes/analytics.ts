import { Router, Request, Response } from 'express';
import { store } from '../store/dataStore';
import { aiClient } from '../services/aiClient';
import { HazardType } from '../types';

export const analyticsRouter = Router();

// GET /api/analytics/flood-index - Area Flood Probability Index
analyticsRouter.get('/flood-index', (req: Request, res: Response) => {
  const { region } = req.query;

  // Calculate weighted flood index across all river nodes
  const riverNodes = Array.from(store.nodes.values()).filter(n => n.hazardTypes.includes('flood'));
  let totalScore = 0;
  let activeWarningCount = 0;

  riverNodes.forEach(node => {
    const floodScore = node.currentRisk?.flood || 10;
    totalScore += floodScore;
    if (floodScore >= 50) activeWarningCount++;
  });

  const avgScore = riverNodes.length ? Math.round(totalScore / riverNodes.length) : 0;
  // Spatial correlation multiplier: if multiple nodes elevated, boost area index
  const correlationMultiplier = activeWarningCount >= 2 ? 1.25 : activeWarningCount === 1 ? 1.1 : 1.0;
  const areaProbabilityIndex = Math.min(100, Math.round(avgScore * correlationMultiplier));

  res.json({
    success: true,
    region: region || 'Tapi-Basin',
    monitoredNodes: riverNodes.length,
    elevatedNodesCount: activeWarningCount,
    areaProbabilityIndex,
    riskBand: areaProbabilityIndex >= 75 ? 'Critical Danger' : areaProbabilityIndex >= 50 ? 'Warning' : 'Normal',
    timestamp: new Date().toISOString()
  });
});

// GET /api/analytics/forecast/:nodeId - 3 to 6-hour forecast
analyticsRouter.get('/forecast/:nodeId', async (req: Request, res: Response) => {
  const nodeId = req.params.nodeId as string;
  const hazard = (req.query.hazard as HazardType) || 'flood';

  const node = store.nodes.get(nodeId);
  if (!node) {
    return res.status(404).json({ success: false, message: 'Node not found' });
  }

  try {
    const series = await aiClient.getForecast(nodeId, hazard);
    res.json({
      success: true,
      nodeId,
      hazard,
      forecastWindowHours: 6,
      series
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/analytics/summary - High level stats for disaster-ops dashboard
analyticsRouter.get('/summary', (req: Request, res: Response) => {
  const nodes = Array.from(store.nodes.values());
  const activeAlerts = Array.from(store.alerts.values()).filter(a => a.status === 'confirmed');

  const onlineNodes = nodes.filter(n => n.status === 'online' || n.status === 'warning' || n.status === 'alert').length;
  const offlineNodes = nodes.length - onlineNodes;

  const avgBattery = nodes.length
    ? Math.round(nodes.reduce((acc, n) => acc + n.battery, 0) / nodes.length)
    : 100;

  res.json({
    success: true,
    data: {
      totalNodes: nodes.length,
      onlineNodes,
      offlineNodes,
      activeAlertsCount: activeAlerts.length,
      criticalAlertsCount: activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length,
      avgBatteryPercent: avgBattery,
      meshHealth: 'Optimal (LoRa Flood-Routing Active)',
      lastSync: new Date().toISOString()
    }
  });
});
