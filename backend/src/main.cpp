#include <Arduino.h>
#include <WiFi.h>
#include <AsyncMqttClient.h>

#define WIFI_SSID "Galaxy6"
#define WIFI_PASSWORD "12345678"

#define MQTT_HOST "broker.hivemq.com"
#define MQTT_PORT 1883

#define MQTT_PUB_POT "EnchufeSmart/hab01/potencia"
#define MQTT_PUB_CON "EnchufeSmart/hab01/control"

float potencia;
float valAnterior=-1;

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;

const int relayPin = 27;
const int sensorPin = 35;

unsigned long previousMillis = 0;
const long interval = 5000;

void connectToWifi() {
  Serial.println("Conectando a la red WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void connectToMqtt() {
  Serial.println("Conectando al servidor MQTT...");
  mqttClient.connect();
}
