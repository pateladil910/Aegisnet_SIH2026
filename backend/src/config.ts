import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001',
  mqttBrokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://127.0.0.1:1883',
  jwtSecret: process.env.JWT_SECRET || 'aegisnet-dev-secret-key-sih-2026',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  environment: process.env.NODE_ENV || 'development',
  smsCooldownMinutes: parseInt(process.env.SMS_COOLDOWN_MINUTES || '10', 10)
};
