import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { AegisNode, AlertItem, SensorReading } from './types';

let io: SocketIOServer | null = null;

export function initWebSocket(server: HTTPServer, corsOrigin: string = '*'): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    socket.on('subscribe:node', (nodeId: string) => {
      socket.join(`node:${nodeId}`);
      console.log(`[WebSocket] Client ${socket.id} subscribed to node:${nodeId}`);
    });

    socket.on('unsubscribe:node', (nodeId: string) => {
      socket.leave(`node:${nodeId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function broadcastTelemetry(reading: SensorReading, node: AegisNode) {
  if (!io) return;
  io.emit('telemetry:update', { reading, node });
  io.to(`node:${reading.nodeId}`).emit('node:telemetry', reading);
}

export function broadcastNodeStatus(node: AegisNode) {
  if (!io) return;
  io.emit('node:status', node);
}

export function broadcastAlert(alert: AlertItem) {
  if (!io) return;
  io.emit('alert:new', alert);
}

export function broadcastAlertResolution(alertId: string, resolvedAt: string) {
  if (!io) return;
  io.emit('alert:resolved', { alertId, resolvedAt });
}
