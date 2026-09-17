import { Router, Request, Response } from 'express';
import { store } from '../store/dataStore';
import { HazardType } from '../types';

export const thresholdsRouter = Router();

// GET /api/thresholds - Current thresholds
thresholdsRouter.get('/', (req: Request, res: Response) => {
  const list = Array.from(store.thresholds.values());
  res.json({ success: true, data: list });
});

// PUT /api/thresholds/:hazard - Update threshold
thresholdsRouter.put('/:hazard', (req: Request, res: Response) => {
  const hazard = req.params.hazard as HazardType;
  const current = store.thresholds.get(hazard);
  if (!current) {
    return res.status(404).json({ success: false, message: `Threshold for hazard '${hazard}' not found` });
  }

  const { watchLevel, warningLevel, criticalLevel, changedBy } = req.body;
  const user = changedBy || 'authority@aegisnet.org';

  const oldValues = {
    watchLevel: current.watchLevel,
    warningLevel: current.warningLevel,
    criticalLevel: current.criticalLevel
  };

  if (watchLevel !== undefined) current.watchLevel = Number(watchLevel);
  if (warningLevel !== undefined) current.warningLevel = Number(warningLevel);
  if (criticalLevel !== undefined) current.criticalLevel = Number(criticalLevel);

  current.updatedAt = new Date().toISOString();
  current.auditLog.unshift({
    changedBy: user,
    oldValue: oldValues,
    newValue: {
      watchLevel: current.watchLevel,
      warningLevel: current.warningLevel,
      criticalLevel: current.criticalLevel
    },
    timestamp: current.updatedAt
  });

  res.json({
    success: true,
    message: `Threshold for ${hazard} updated successfully`,
    data: current
  });
});
