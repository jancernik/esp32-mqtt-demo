#include <Arduino.h>
#include <FastLED.h>

void nblendU8TowardU8(uint8_t& cur, const uint8_t target, uint8_t amount) {
  if (cur == target) return;
  if (cur < target) {
    uint8_t delta = target - cur;
    delta = scale8_video(delta, amount);
    cur += delta;
  } else {
    uint8_t delta = cur - target;
    delta = scale8_video(delta, amount);
    cur -= delta;
  }
}

CRGB fadeColor(CRGB& cur, const CRGB& target, uint8_t amount) {
  nblendU8TowardU8(cur.red, target.red, amount);
  nblendU8TowardU8(cur.green, target.green, amount);
  nblendU8TowardU8(cur.blue, target.blue, amount);
  return cur;
}

int j = 0;
bool direction = true;
unsigned long lastLedsMillis = 0;

void ledsShowLoading(CRGB* leds, byte num, CRGB color) {
  uint16_t sinBeat = beatsin16(80, 0, num - 1, 0, 0);
  leds[sinBeat] = color;
  fadeToBlackBy(leds, num, 6);
  FastLED.show();
}

unsigned long animationMillis = 0;
bool isFirstLedLoop = true;
void ledsShowSuccess(CRGB* leds, byte num) {
  if (isFirstLedLoop) {
    animationMillis = millis();
    isFirstLedLoop = false;
  }
  while (millis() < animationMillis + 400) {
    for (int k = 0; k < num; k++) {
      fadeColor(leds[k], CRGB(0, 0, 0), 3);
    }
    FastLED.show();
  }
  while (millis() < animationMillis + 800) {
    for (int k = 0; k < num; k++) {
      fadeColor(leds[k], CRGB(0, 255, 0), 3);
    }
    FastLED.show();
  }
  while (millis() < animationMillis + 1200) {
    for (int k = 0; k < num; k++) {
      fadeColor(leds[k], CRGB(0, 0, 0), 3);
    }
    FastLED.show();
  }
  isFirstLedLoop = true;
}