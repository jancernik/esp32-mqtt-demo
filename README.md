# MQTT on ESP32

This is a small project to demonstrate bidirectional communication between a microcontroller and a browser through a public MQTT broker.

![project breadboard](https://i.imgur.com/gJe4f3k.jpg)

One of the two clients is an ESP32. Alongside it, the breadboard has a temperature and humidity sensor and an RGB led strip.
- The sensor readings are **published** by the μC into a topic.
- The LED color is set from a topic the μC is **subscribed** to.

The other client (or clients) is a browser. On the website, there is a section with the values of temperature and humidity and a color picker.
- The sensor readings are obtained from a topic the browser is **subscribed** to.
- The color from the color picker is **published** into a topic

## Components
- NodeMCU-32S Microcontroller
- AHT10 Temperature and humidity sensor
- WS2812B Addressable led strip

## Connections
`ESP32 GPIO21 --- AHT10 SDA`

`ESP32 GPIO22 --- AHT10 SCL`

`ESP32 GPIO23 --- LED PIN`

## Web Client
A live version of the web client is live at https://mqtt-esp32.pages.dev

**To run it locally:**

1.  Clone this repo

`$ git clone git@github.com:cernikkk/esp32-mqtt-demo.git`

2. Change directory

`$ cd esp32-mqtt-demo/browser/`

3. Install dependencies

`$ npm install`

3. Run as development

`$ npm start`

> Since the broker uses different ports to connect over HTTP and HTTPS, the broker URL is dependent on the environment. If you wish to change them, they are located inside `webpack.prod.js` and `webpack.dev.js`
