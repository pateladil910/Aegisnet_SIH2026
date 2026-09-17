import { Router, Request, Response } from 'express';
import { store } from '../store/dataStore';
import { AlertItem } from '../types';
import { broadcastAlertResolution } from '../websocket';
import { ingestionService } from '../services/mqttIngestion';

export const alertsRouter = Router();

// GET /api/alerts - Filterable list of alerts
alertsRouter.get('/', (req: Request, res: Response) => {
  const { status, hazard, from, to } = req.query;

  let alerts = Array.from(store.alerts.values());

  if (status) {
    alerts = alerts.filter(a => a.status === status);
  }
  if (hazard) {
    alerts = alerts.filter(a => a.hazardType === hazard);
  }
  if (from) {
    const fromTime = new Date(from as string).getTime();
    alerts = alerts.filter(a => new Date(a.createdAt).getTime() >= fromTime);
  }
  if (to) {
    const toTime = new Date(to as string).getTime();
    alerts = alerts.filter(a => new Date(a.createdAt).getTime() <= toTime);
  }

  // Newest first
  alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    count: alerts.length,
    data: alerts
  });
});

// PATCH /api/alerts/:id/resolve - Mark alert resolved
alertsRouter.patch('/:id/resolve', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const alert = store.alerts.get(id);
  if (!alert) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }

  const resolvedAt = new Date().toISOString();
  alert.status = 'resolved';
  alert.resolvedAt = resolvedAt;

  // If node has no other active alerts, revert status to online
  const activeAlertsForNode = Array.from(store.alerts.values()).filter(
    a => a.nodeId === alert.nodeId && a.status === 'confirmed' && a._id !== alert._id
  );

  const node = store.nodes.get(alert.nodeId);
  if (node && activeAlertsForNode.length === 0) {
    node.status = 'online';
  }

  broadcastAlertResolution(alert._id, resolvedAt);

  res.json({
    success: true,
    message: 'Alert marked as resolved',
    data: alert
  });
});

// POST /api/alerts/simulate - Trigger a simulated alert packet (convenient test API)
alertsRouter.post('/simulate', async (req: Request, res: Response) => {
  try {
    const { nodeId, hazardType, riskScore, severity, reading } = req.body;
    if (!nodeId || !hazardType || riskScore === undefined) {
      return res.status(400).json({ success: false, message: 'nodeId, hazardType, riskScore required' });
    }

    const alert = await ingestionService.processAlertPacket({
      packetId: `sim_${Date.now()}`,
      nodeId,
      hazardType,
      riskScore,
      severity: severity || (riskScore >= 75 ? 'critical' : 'warning'),
      timestamp: new Date().toISOString(),
      reading: reading || { waterLevelCm: 85, tempC: 28, humidity: 80 }
    });

    res.status(201).json({ success: true, data: alert });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
