import './style/style.scss';
import * as mqtt from 'mqtt/dist/mqtt';
import ColorPicker from 'simple-color-picker';
import { v4 as uuidv4 } from 'uuid';
import rgbHex from 'rgb-hex';

var colorPicker = new ColorPicker({
  el: document.body,
  background: '#656565',
  width: '400',
  height: '400',
});

let color = '#000000';
let isCoolDown = false;

const MQTT_TEMP = 'redes/esp32/temp';
const MQTT_HUM = 'redes/esp32/hum';
const MQTT_R = 'redes/esp32/r';
const MQTT_G = 'redes/esp32/g';
const MQTT_B = 'redes/esp32/b';
const MQTT_A = 'redes/esp32/a';
const MQTT_RGB = 'redes/esp32/rgb';

const options = {
  clientId: uuidv4(),
};

// const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', options);
const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', options);

const rgbToHex = (rgb) => `#${rgbHex(rgb)}`;
const rgbCompToHex = (val, comp) => {
  let d = [];
  if (comp === 'r') d = [1, 2];
  if (comp === 'g') d = [3, 4];
  if (comp === 'b') d = [5, 6];
  const hex = parseInt(val, 10).toString(16);
  const hexArray = hex.split('');
  let newColor = color.split('');
  newColor.splice(d[0], 1, hexArray[0]);
  newColor.splice(d[1], 1, hexArray[1]);
  return newColor.join('');
};

client.on('connect', () => {
  console.log('Connected!');
});

client.on('error', (error) => {
  console.log('Error:', error);
});

client.on('message', function (topic, message) {
  handleMessage(topic, String.fromCharCode.apply(null, message));
});

client.subscribe(MQTT_R);
client.subscribe(MQTT_G);
client.subscribe(MQTT_B);
client.subscribe(MQTT_RGB);

const handleMessage = (topic, message) => {
  if (topic === MQTT_R) colorPicker.setColor(rgbCompToHex(message, 'r'));
  if (topic === MQTT_G) colorPicker.setColor(rgbCompToHex(message, 'g'));
  if (topic === MQTT_B) colorPicker.setColor(rgbCompToHex(message, 'b'));
  if (topic === MQTT_RGB) {
    if (message.length > 7) colorPicker.setColor(rgbToHex(message));
    else colorPicker.setColor(message);
  }
  console.log(topic, message);
};

const sendColor = () => {
  if (!isCoolDown) {
    isCoolDown = true;
    client.publish('redes/esp32/rgb', color);
    console.log('redes/esp32/rgb', color);
    setTimeout(() => (isCoolDown = false), 300);
  }
};
window.addEventListener('mouseup', () => {
  sendColor();
});

window.addEventListener(
  'touchend',
  () => {
    sendColor();
  },
  false
);

window.addEventListener(
  'touchcancel',
  () => {
    sendColor();
  },
  false
);

colorPicker.onChange((getHexString) => {
  color = getHexString;
  document.body.style.background = color;
});
