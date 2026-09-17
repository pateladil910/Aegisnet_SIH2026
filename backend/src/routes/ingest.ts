import { Router, Request, Response } from 'express';
import { ingestionService } from '../services/mqttIngestion';

export const ingestRouter = Router();

// POST /api/ingest/telemetry - Direct ingestion of sensor reading
ingestRouter.post('/telemetry', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload.nodeId) {
      return res.status(400).json({ success: false, message: 'nodeId is required' });
    }
    ingestionService.processTelemetryPacket(payload);
    res.json({ success: true, message: 'Telemetry packet ingested' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ingest/alert - Direct ingestion of edge-AI alert packet
ingestRouter.post('/alert', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload.nodeId || !payload.hazardType || payload.riskScore === undefined) {
      return res.status(400).json({ success: false, message: 'nodeId, hazardType, and riskScore are required' });
    }
    const alert = await ingestionService.processAlertPacket(payload);
    res.json({ success: true, data: alert });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
