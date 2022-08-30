#include <Arduino.h>

void serialPrintMQTT(const char* topic, char* msg, String unit = "", byte colorNum = 9) {
  String colorCode = "\033[0;3" + String(colorNum) + "m";
  String colorCodeBold = "\033[1;3" + String(colorNum) + "m";

  Serial.println("");
  Serial.print("\033[1;39m");  // Default color bold
  Serial.print("TOPIC:  ");
  Serial.print(colorCode);
  Serial.println(topic);
  Serial.print("\033[1;39m");  // Default color bold
  Serial.print("VALUE:  ");
  Serial.print(colorCodeBold);
  Serial.print(msg);
  Serial.println(unit);
  Serial.print("\033[0;39m");  // Default color
}

String frames[6] = {"⠯", "⠟", "⠻", "⠽", "⠾", "⠷"};
unsigned long lastLoaderMillis = 0;
bool isFirstLoop = true;
int i;

void serialPrintLoading(String target) {
  if (isFirstLoop) {
    isFirstLoop = false;
    Serial.print("\033[1;36m");  // Cyan color bold
    Serial.print("Conectado " + target + " ");
  }
  if (millis() > lastLoaderMillis + 100) {
    i++;
    lastLoaderMillis = millis();
    Serial.print(frames[i]);  // Imprime un frame
    Serial.print("\033[1D");  // Mueve el cursor 1 lugar a la izquierda
    if (i == 5) i = 0;
  }
}

void serialPrintSuccess(String target) {
  isFirstLoop = true;
  lastLoaderMillis = 0;
  Serial.print("\033[2K");     // Borra la línea
  Serial.print("\r");          // Mueve el cursor al principio de la línea
  Serial.print("\033[1;32m");  // Green color bold
  Serial.print(target + " conectado ✔");
  Serial.println("\033[0;39m");  // Default color
}

/*
0 - Black
1 - Red
2 - Green
3 - Yellow
4 - Blue
5 - Magenta
6 - Cyan
7 - White
*/