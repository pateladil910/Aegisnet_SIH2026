import mqtt, { MqttClient } from 'mqtt';
import { config } from '../config';
import { store } from '../store/dataStore';
import { SensorReading, AlertItem, HazardType, AlertSeverity } from '../types';
import { broadcastTelemetry, broadcastNodeStatus, broadcastAlert } from '../websocket';
import { aiClient } from './aiClient';
import { notificationService } from './notificationService';

export class IngestionService {
  private client: MqttClient | null = null;

  public init() {
    try {
      console.log(`[MQTT] Attempting connection to ${config.mqttBrokerUrl}...`);
      this.client = mqtt.connect(config.mqttBrokerUrl, {
        reconnectPeriod: 5000,
        connectTimeout: 4000
      });

      this.client.on('connect', () => {
        console.log('[MQTT] Connected to MQTT broker successfully.');
        this.client?.subscribe(['aegisnet/+/telemetry', 'aegisnet/+/alert', 'aegisnet/gateway/+/status'], (err) => {
          if (err) console.error('[MQTT] Subscription error:', err);
          else console.log('[MQTT] Subscribed to aegisnet topics');
        });
      });

      this.client.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          this.handleIncomingMessage(topic, data);
        } catch (e: any) {
          console.error('[MQTT] Failed to parse JSON message:', e.message);
        }
      });

      this.client.on('error', (err) => {
        console.warn(`[MQTT Broker Notice] ${err.message} (Will auto-reconnect or use HTTP ingestion fallback)`);
      });
    } catch (err: any) {
      console.warn(`[MQTT Init Warning] Could not start MQTT client: ${err.message}`);
    }
  }

  public handleIncomingMessage(topic: string, data: any) {
    const parts = topic.split('/');
    if (parts[2] === 'telemetry') {
      this.processTelemetryPacket(data);
    } else if (parts[2] === 'alert') {
      this.processAlertPacket(data);
    } else if (parts[1] === 'gateway') {
      console.log(`[Gateway Status] Gateway ${parts[2]}:`, data);
    }
  }

  public processTelemetryPacket(data: any) {
    const { packetId, nodeId, timestamp, battery, rssi, solarCharging, ...readings } = data;

    // 1. Packet Deduplication (Mesh flood routing can produce duplicate relays)
    if (packetId) {
      const dedupeKey = `${nodeId}:${packetId}`;
      if (store.seenPacketIds.has(dedupeKey)) {
        return; // drop duplicate mesh packet
      }
      store.seenPacketIds.add(dedupeKey);
      // Bound the set size to prevent memory leak
      if (store.seenPacketIds.size > 5000) {
        const first = store.seenPacketIds.values().next().value;
        if (first) store.seenPacketIds.delete(first);
      }
    }

    // 2. Fetch or initialize node
    let node = store.nodes.get(nodeId);
    const nowIso = timestamp || new Date().toISOString();
    if (!node) {
      node = {
        _id: nodeId,
        label: `Sensor Node ${nodeId.replace('node_', '')}`,
        location: { type: 'Point', coordinates: [72.83, 21.20] },
        hazardTypes: ['flood'],
        hardware: { sensors: ['HC-SR04', 'DHT22'], firmwareVersion: '1.0.0' },
        status: 'online',
        battery: battery ?? 90,
        solarCharging: solarCharging ?? false,
        rssi: rssi ?? -70,
        lastSeen: nowIso,
        createdAt: nowIso,
        currentRisk: readings.riskScores || { flood: 10, fire: 5, pollution: 10 }
      };
      store.nodes.set(nodeId, node);
    } else {
      node.lastSeen = nowIso;
      if (battery !== undefined) node.battery = battery;
      if (rssi !== undefined) node.rssi = rssi;
      if (solarCharging !== undefined) node.solarCharging = solarCharging;
      if (readings.riskScores) node.currentRisk = readings.riskScores;
    }

    // 3. Create & Store Sensor Reading
    const reading: SensorReading = {
      nodeId,
      timestamp: nowIso,
      waterLevelCm: readings.waterLevelCm ?? 0,
      flame: readings.flame ?? false,
      smokePpm: readings.smokePpm ?? 0,
      aqi: readings.aqi ?? 0,
      tempC: readings.tempC ?? 25,
      humidity: readings.humidity ?? 50,
      soilMoisture: readings.soilMoisture ?? 30,
      riskScores: readings.riskScores || {
        flood: 0,
        fire: 0,
        pollution: 0
      }
    };
    store.readings.push(reading);
    if (store.readings.length > 10000) {
      store.readings.shift(); // keep sliding window
    }

    // 4. Update Node Status pill based on max risk
    const maxRisk = Math.max(
      reading.riskScores.flood,
      reading.riskScores.fire,
      reading.riskScores.pollution
    );
    if (maxRisk >= 75) node.status = 'alert';
    else if (maxRisk >= 50) node.status = 'warning';
    else node.status = 'online';

    // 5. Broadcast to WebSocket clients
    broadcastTelemetry(reading, node);
    broadcastNodeStatus(node);
  }

  public async processAlertPacket(data: any) {
    const { packetId, nodeId, hazardType, riskScore, severity, timestamp, reading } = data;

    // Deduplicate
    if (packetId) {
      const dedupeKey = `${nodeId}:alert:${packetId}`;
      if (store.seenPacketIds.has(dedupeKey)) return;
      store.seenPacketIds.add(dedupeKey);
    }

    const node = store.nodes.get(nodeId);
    const nodeCoords: [number, number] = node?.location.coordinates || [72.83, 21.20];

    // Asynchronous AI microservice validation & correlation
    const [correlation, validation] = await Promise.all([
      aiClient.correlateAlert(nodeId, hazardType as HazardType, riskScore, nodeCoords),
      aiClient.validateAlert(nodeId, hazardType as HazardType, reading || {})
    ]);

    const alertId = `alert_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newAlert: AlertItem = {
      _id: alertId,
      nodeId,
      hazardType: hazardType as HazardType,
      riskScore,
      severity: (severity || (riskScore >= 80 ? 'critical' : 'warning')) as AlertSeverity,
      status: validation.isLikelyFalsePositive ? 'suppressed' : 'confirmed',
      correlatedNodes: correlation.confirmingNodes,
      areaProbabilityIndex: correlation.areaProbabilityIndex,
      notified: ['dashboard:live'],
      createdAt: timestamp || new Date().toISOString(),
      resolvedAt: null,
      rawReading: reading,
      aiValidation: validation
    };

    // Evaluate notifications
    const nodeLabel = node ? node.label : nodeId;
    const notificationEval = notificationService.evaluateNotification(newAlert, nodeLabel);
    newAlert.notified = notificationEval.channels;

    store.alerts.set(alertId, newAlert);

    // Update node status
    if (node) {
      node.status = 'alert';
      broadcastNodeStatus(node);
    }

    // Fan-out via WebSocket
    broadcastAlert(newAlert);
    console.log(`[Alert Ingestion] Generated alert ${alertId} for ${nodeId} (${hazardType}) - Score: ${riskScore}, Area Prob: ${correlation.areaProbabilityIndex}%`);

    return newAlert;
  }
}

export const ingestionService = new IngestionService();
