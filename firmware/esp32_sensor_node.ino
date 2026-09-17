/**
 * AegisNet — ESP32 Edge Environmental Sensor Node
 * Problem Statement: SIH26178 (Qualcomm Edge-AI/IoT)
 *
 * Hardware:
 * - ESP32 DevKit v1
 * - LoRa SX1278 (SPI: CS=18, RST=14, DIO0=26)
 * - Ultrasonic HC-SR04 (Trig=5, Echo=19)
 * - DHT22 Temperature & Humidity (Pin 4)
 * - MQ135 Air Quality / Gas (Analog Pin 34)
 * - Optical Flame Sensor (Digital Pin 27)
 */

#include <SPI.h>
#include <LoRa.h>
#include <DHT.h>
#include "include/edge_model_weights.h"

#define LORA_CS    18
#define LORA_RST   14
#define LORA_DIO0  26

#define TRIG_PIN   5
#define ECHO_PIN   19
#define DHT_PIN    4
#define DHT_TYPE   DHT22
#define MQ135_PIN  34
#define FLAME_PIN  27

DHT dht(DHT_PIN, DHT_TYPE);

const char* NODE_ID = "node_002";
uint32_t packetSequence = 0;

// Rolling window for rate-of-change computation
float lastWaterLevel = 35.0f;
float lastTemp = 28.0f;
float lastSmoke = 65.0f;
unsigned long lastSampleTime = 0;

// LoRa Packet Struct (compact binary payload)
struct __attribute__((packed)) AegisPacket {
    char nodeId[10];
    uint32_t packetId;
    uint8_t battery;
    int8_t rssi;
    float waterLevelCm;
    float tempC;
    float humidity;
    float smokePpm;
    uint8_t flameDetected;
    uint8_t floodRiskScore;
    uint8_t fireRiskScore;
    uint8_t pollutionRiskScore;
    uint8_t isAlert;
};

void setup() {
    Serial.begin(115200);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(FLAME_PIN, INPUT);
    
    dht.begin();
    
    LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
    if (!LoRa.begin(433E6)) { // 433MHz LoRa
        Serial.println("[AegisNet Edge] LoRa initialization failed!");
    } else {
        LoRa.setSyncWord(0xA5); // AegisNet Mesh sync word
        Serial.println("[AegisNet Edge] LoRa Mesh Node Online.");
    }
}

float measureWaterDistanceCm() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    long duration = pulseIn(ECHO_PIN, HIGH, 30000);
    if (duration == 0) return lastWaterLevel;
    float distance = (duration * 0.0343f) / 2.0f;
    return distance;
}

void loop() {
    unsigned long now = millis();
    float dt_minutes = (now - lastSampleTime) / 60000.0f;
    if (dt_minutes <= 0.01f) dt_minutes = 0.1f;

    // 1. Read Sensors
    float waterLevel = measureWaterDistanceCm();
    float temp = dht.readTemperature();
    float humidity = dht.readHumidity();
    float smokeRaw = analogRead(MQ135_PIN);
    float smokePpm = (smokeRaw / 4095.0f) * 500.0f;
    bool flame = (digitalRead(FLAME_PIN) == LOW); // Active LOW on typical module

    if (isnan(temp)) temp = 28.5f;
    if (isnan(humidity)) humidity = 65.0f;

    // 2. Feature Extraction: Rate of Change (Δval / Δt)
    float deltaWater = (waterLevel - lastWaterLevel) / dt_minutes;
    float deltaTemp = (temp - lastTemp) / dt_minutes;
    float deltaSmoke = (smokePpm - lastSmoke) / dt_minutes;

    // 3. Level 1 TinyML Edge Inference (0-100 Risk Scoring)
    int floodRisk = calculate_flood_risk(waterLevel, deltaWater);
    int fireRisk = calculate_fire_risk(temp, deltaTemp, smokePpm, deltaSmoke, flame);
    int pollutionRisk = (int)min(100.0f, (smokePpm / 200.0f) * 100.0f);

    bool isAlert = (floodRisk >= 70 || fireRisk >= 65 || pollutionRisk >= 75);

    // 4. Pack LoRa Mesh Packet
    AegisPacket pkt;
    strncpy(pkt.nodeId, NODE_ID, sizeof(pkt.nodeId));
    pkt.packetId = ++packetSequence;
    pkt.battery = 88; // Read ADC battery divider
    pkt.rssi = LoRa.packetRssi();
    pkt.waterLevelCm = waterLevel;
    pkt.tempC = temp;
    pkt.humidity = humidity;
    pkt.smokePpm = smokePpm;
    pkt.flameDetected = flame ? 1 : 0;
    pkt.floodRiskScore = floodRisk;
    pkt.fireRiskScore = fireRisk;
    pkt.pollutionRiskScore = pollutionRisk;
    pkt.isAlert = isAlert ? 1 : 0;

    // 5. Transmit over LoRa Mesh
    LoRa.beginPacket();
    LoRa.write((uint8_t*)&pkt, sizeof(pkt));
    LoRa.endPacket();

    Serial.printf("[TX Node %s] Water: %.1fcm (Risk: %d), Fire Risk: %d, Poll: %d -> Alert: %d\n",
                  NODE_ID, waterLevel, floodRisk, fireRisk, pollutionRisk, isAlert);

    // Update state
    lastWaterLevel = waterLevel;
    lastTemp = temp;
    lastSmoke = smokePpm;
    lastSampleTime = now;

    // Fast loop if in danger, sleep longer during normal condition (battery saving)
    delay(isAlert ? 2000 : 8000);
}
