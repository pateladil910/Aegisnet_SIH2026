import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from './config';
import { initWebSocket } from './websocket';
import { ingestionService } from './services/mqttIngestion';
import { nodesRouter } from './routes/nodes';
import { alertsRouter } from './routes/alerts';
import { thresholdsRouter } from './routes/thresholds';
import { analyticsRouter } from './routes/analytics';
import { authRouter } from './routes/auth';
import { ingestRouter } from './routes/ingest';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Initialize Socket.IO
initWebSocket(server, config.corsOrigin);

// Mount API routes
app.use('/api/nodes', nodesRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/thresholds', thresholdsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/auth', authRouter);
app.use('/api/ingest', ingestRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'aegisnet-backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start Ingestion Service (MQTT listener)
ingestionService.init();

// Start HTTP + WebSocket Server
server.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🛡️  AegisNet Backend Engine Running on Port ${config.port}`);
  console.log(`📡 WebSocket Gateway: ws://localhost:${config.port}`);
  console.log(`⚡ Ingestion API:     http://localhost:${config.port}/api/ingest`);
  console.log(`=======================================================`);
});
