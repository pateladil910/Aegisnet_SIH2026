import { Router, Request, Response } from 'express';
import { store } from '../store/dataStore';
import { AegisNode } from '../types';
import { broadcastNodeStatus } from '../websocket';

export const nodesRouter = Router();

// GET /api/nodes - List all nodes with current status
nodesRouter.get('/', (req: Request, res: Response) => {
  const nodes = Array.from(store.nodes.values());
  res.json({ success: true, count: nodes.length, data: nodes });
});

// GET /api/nodes/:id - Node detail
nodesRouter.get('/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const node = store.nodes.get(id);
  if (!node) {
    return res.status(404).json({ success: false, message: 'Node not found' });
  }
  res.json({ success: true, data: node });
});

// GET /api/nodes/:id/readings - Historical readings
nodesRouter.get('/:id/readings', (req: Request, res: Response) => {
  const { id } = req.params;
  const { from, to, limit } = req.query;

  let nodeReadings = store.readings.filter(r => r.nodeId === id);

  if (from) {
    const fromDate = new Date(from as string).getTime();
    nodeReadings = nodeReadings.filter(r => new Date(r.timestamp).getTime() >= fromDate);
  }
  if (to) {
    const toDate = new Date(to as string).getTime();
    nodeReadings = nodeReadings.filter(r => new Date(r.timestamp).getTime() <= toDate);
  }

  // Sort by timestamp ascending
  nodeReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const maxPoints = limit ? parseInt(limit as string, 10) : 100;
  if (nodeReadings.length > maxPoints) {
    nodeReadings = nodeReadings.slice(-maxPoints);
  }

  res.json({
    success: true,
    nodeId: id,
    count: nodeReadings.length,
    data: nodeReadings
  });
});

// POST /api/nodes - Register new node
nodesRouter.post('/', (req: Request, res: Response) => {
  const { label, location, hazardTypes, hardware } = req.body;
  if (!label || !location || !location.coordinates) {
    return res.status(400).json({ success: false, message: 'label and location.coordinates required' });
  }

  const newNodeId = `node_${String(store.nodes.size + 1).padStart(3, '0')}`;
  const newNode: AegisNode = {
    _id: newNodeId,
    label,
    location,
    hazardTypes: hazardTypes || ['flood'],
    hardware: hardware || { sensors: ['HC-SR04', 'DHT22'], firmwareVersion: '1.0.0' },
    status: 'online',
    battery: 100,
    solarCharging: true,
    rssi: -60,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    currentRisk: { flood: 10, fire: 5, pollution: 10 }
  };

  store.nodes.set(newNodeId, newNode);
  broadcastNodeStatus(newNode);
  res.status(201).json({ success: true, data: newNode });
});

// PATCH /api/nodes/:id - Update metadata
nodesRouter.patch('/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const node = store.nodes.get(id);
  if (!node) {
    return res.status(404).json({ success: false, message: 'Node not found' });
  }

  const { label, location, hazardTypes, hardware } = req.body;
  if (label) node.label = label;
  if (location) node.location = location;
  if (hazardTypes) node.hazardTypes = hazardTypes;
  if (hardware) node.hardware = { ...node.hardware, ...hardware };

  broadcastNodeStatus(node);
  res.json({ success: true, data: node });
});
