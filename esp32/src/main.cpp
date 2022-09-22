#include <Adafruit_AHTX0.h>
#include <Arduino.h>
#include <FastLED.h>
#include <PubSubClient.h>
#include <WiFi.h>

#include "led_utils.h"
#include "serial_utils.h"
// #include <Adafruit_AHT10.h>

const char* LOCAL_SSID = "";
const char* LOCAL_PASS = "";

const char* MQTT_SERVER = "broker.emqx.io";
const int MQTT_PORT = 1883;

const char* MQTT_PUB_TEMP = "redes/esp32/temp";
const char* MQTT_PUB_HUM = "redes/esp32/hum";
const char* MQTT_SUB_R = "redes/esp32/r";
const char* MQTT_SUB_G = "redes/esp32/g";
const char* MQTT_SUB_B = "redes/esp32/b";
const char* MQTT_SUB_A = "redes/esp32/a";
const char* MQTT_SUB_RGB = "redes/esp32/rgb";

float readTemp = 0;
float lastTemp = 0;
float readHum = 0;
float lastHum = 0;

int r, g, b;
int a = 255;

unsigned long lastConenctionCheck = 0;
bool connected = false;

unsigned long lastSensorMillis = 0;
#define SENSOR_READ_INTERVAL 1000
#define TEMP_ERROR 0.3  // 0.3°C
#define HUM_ERROR 2     // 2%

#define NUM_LEDS 3
#define LED_PIN 23

CRGB leds[NUM_LEDS];
WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_AHTX0 aht;
// Adafruit_AHT10 aht;

char* stringToChar(String str) {
  return &*str.begin();
}

#define MAX_UUID 10

const char * generateUUID(){
  const char possible[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  static char uuid[MAX_UUID + 1];
  for(int p = 0, i = 0; i < MAX_UUID; i++){
    int r = random(0, strlen(possible));
    uuid[p++] = possible[r];
  }
  uuid[MAX_UUID] = '\0';
  return uuid;
}

void callback(char* topic, byte* payload, unsigned int length) {
  String content = "";
  for (size_t i = 0; i < length; i++) {
    content.concat((char)payload[i]);
  }

  if (strcmp(topic, MQTT_SUB_R) == 0) {
    serialPrintMQTT(MQTT_SUB_R, stringToChar(content), "", 1);
    r = content.toInt();
  }

  if (strcmp(topic, MQTT_SUB_G) == 0) {
    serialPrintMQTT(MQTT_SUB_G, stringToChar(content), "", 2);
    g = content.toInt();
  }

  if (strcmp(topic, MQTT_SUB_B) == 0) {
    serialPrintMQTT(MQTT_SUB_B, stringToChar(content), "", 4);
    b = content.toInt();
  }

  if (strcmp(topic, MQTT_SUB_A) == 0) {
    serialPrintMQTT(MQTT_SUB_A, stringToChar(content), "", 7);
    a = content.toInt();
  }

  if (strcmp(topic, MQTT_SUB_RGB) == 0) {
    serialPrintMQTT(MQTT_SUB_RGB, stringToChar(content), "", 7);
    if (length > 7) {
      // Convierte texto en formato "rgb( 255, 255, 255 )" en enteros
      content.remove(0, 4);
      content.remove(content.length() - 1);
      char contentArray[50];
      content.toCharArray(contentArray, 25);
      char* rgb[9];
      char* ptr = NULL;
      byte index = 0;
      ptr = strtok(contentArray, ", ");
      while (ptr != NULL) {
        rgb[index] = ptr;
        index++;
        ptr = strtok(NULL, ", ");
      }
      r = atoi(rgb[0]);
      g = atoi(rgb[1]);
      b = atoi(rgb[2]);
    } else {
      // Convierte texto en formato "#FFFFFF" en enteros
      int number = (int)strtol(&content[1], NULL, 16);
      r = number >> 16;
      g = number >> 8 & 0xFF;
      b = number & 0xFF;
    }
  }
}

void setup() {
  Serial.begin(115200);
  aht.begin();

  FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, NUM_LEDS);
  FastLED.setBrightness(10);

  Serial.print("\033[2J");  // Limpia el monitor serie
  Serial.print("\033[H");   // Mueve el cursor a 0,0

  //* ============== WIFI ============== *//
  connected = false;
  WiFi.begin(LOCAL_SSID, LOCAL_PASS);
  while (!connected) {
    if (millis() > lastConenctionCheck + 500) {
      lastConenctionCheck = millis();
      connected = WiFi.status() == WL_CONNECTED;
    }
    serialPrintLoading("WiFi");
    ledsShowLoading(leds, NUM_LEDS, CRGB(0, 255, 255));
  }
  serialPrintSuccess("WiFi");

  //* ============== MQTT ============== *//
  connected = false;
  client.setServer(MQTT_SERVER, MQTT_PORT);
  while (!connected) {
    if (millis() > lastConenctionCheck + 500) {
      lastConenctionCheck = millis();
      connected = client.connect(generateUUID());
    }
    serialPrintLoading("Broker");
    ledsShowLoading(leds, NUM_LEDS, CRGB(0, 0, 255));
  }
  serialPrintSuccess("Broker");
  ledsShowSuccess(leds, NUM_LEDS);

  client.setCallback(callback);
  client.subscribe(MQTT_SUB_R);
  client.subscribe(MQTT_SUB_G);
  client.subscribe(MQTT_SUB_B);
  client.subscribe(MQTT_SUB_A);
  client.subscribe(MQTT_SUB_RGB);
  FastLED.setBrightness(255);
}

void loop() {
  //* ============== LECTURA DEL SENSOR ============== *//
  if (millis() > lastSensorMillis + SENSOR_READ_INTERVAL) {
    lastSensorMillis = millis();
    sensors_event_t humidity, temp;
    aht.getEvent(&humidity, &temp);
    readTemp = temp.temperature;
    readHum = humidity.relative_humidity;
  }

  //* ============== PUBLICACIÓN DE TEMPERATURA ============== *//
  if (readTemp > lastTemp + TEMP_ERROR || readTemp < lastTemp - TEMP_ERROR) {
    lastTemp = readTemp;

    char tempChar[5];
    dtostrf(readTemp, 5, 2, tempChar);  // Asigna el valor de la temperatura a la variable con solo dos decimales
    client.publish(MQTT_PUB_TEMP, tempChar);
    serialPrintMQTT(MQTT_PUB_TEMP, tempChar, "°C", 5);
  }

  //* ============== PUBLICACIÓN DE HUMEDAD ============== *//
  if (readHum > lastHum + HUM_ERROR || readHum < lastHum - HUM_ERROR) {
    lastHum = readHum;

    char humChar[5];
    dtostrf(readHum, 5, 2, humChar);  // Asigna el valor de la humedad a la variable con solo dos decimales
    client.publish(MQTT_PUB_HUM, humChar);
    serialPrintMQTT(MQTT_PUB_HUM, humChar, "%", 6);
  }

  //* ============== CONTROL DE LEDS RGB ============== *//
  for (int i = 0; i < NUM_LEDS; i++) {
    fadeColor(leds[i], CRGB(r, g, b), 3);
    // leds[i] = CRGB(r, g, b);
  }
  FastLED.setBrightness(a);
  FastLED.show();
  client.loop();
}
