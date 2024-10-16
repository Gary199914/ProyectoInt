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
void WiFiEvent(WiFiEvent_t event) {
  Serial.printf("[WiFi] evento: %d\n", event);
  switch(event) {
    case ARDUINO_EVENT_WIFI_STA_GOT_IP:
      Serial.println("WiFi - conectado");
      Serial.println("Dirección IP: ");
      Serial.println(WiFi.localIP());
      connectToMqtt();
      break;
    case ARDUINO_EVENT_WIFI_STA_DISCONNECTED:
      Serial.println("WiFi - conexión perdida");
      xTimerStop(mqttReconnectTimer, 0);
      xTimerStart(wifiReconnectTimer, 0);
      break;
  }
}

void onMqttConnect(bool sessionPresent) {
  Serial.println("Conectado al server MQTT.");
  Serial.print("Sesion presente: ");
  Serial.println(sessionPresent);
  uint16_t packetIdSub = mqttClient.subscribe(MQTT_PUB_CON, 2);
  Serial.print("Subscrito con QoS 2, packetId: ");
  Serial.println(packetIdSub);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
  Serial.println("Desconectado del server MQTT.");
  if (WiFi.isConnected()) {
    xTimerStart(mqttReconnectTimer, 0);
  }
}

void onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
  Serial.println("Publicación recibidad.");
  Serial.print("  topic: ");
  Serial.println(topic);
  Serial.print("  qos: ");
  Serial.println(properties.qos);
  Serial.print("  Mensaje: ");
  Serial.println(payload);
  String comando = payload;
  //if(!comando.compareTo("1")){
  if(!comando.indexOf("0")){
    Serial.println("Luz OFF");
    digitalWrite(relayPin, HIGH);
  }
  else if(!comando.indexOf("1")){
    Serial.println("Luz ON");
    digitalWrite(relayPin, LOW);
  }
}


void onMqttPublish(uint16_t packetId) {
  Serial.print("Publicando datos.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}

void setup() {
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);
  Serial.begin(115200);
  Serial.println();

  mqttReconnectTimer = xTimerCreate("mqttTimer", pdMS_TO_TICKS(2000), pdFALSE, (void*)0, reinterpret_cast<TimerCallbackFunction_t>(connectToMqtt));
  wifiReconnectTimer = xTimerCreate("wifiTimer", pdMS_TO_TICKS(2000), pdFALSE, (void*)0, reinterpret_cast<TimerCallbackFunction_t>(connectToWifi));

  WiFi.onEvent(WiFiEvent);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  mqttClient.onPublish(onMqttPublish);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  connectToWifi();
}

