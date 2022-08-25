import './style/style.scss';
import * as mqtt from 'mqtt/dist/mqtt';
import ColorPicker from 'simple-color-picker';
import hexRgb from 'hex-rgb';

let color = 'rgb(0, 0, 0)';
let isCoolDown = false;

const options = {
  clientId: 'u23230rj32w0e4fv346t23wervyauer',
};

// const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', options);
const client = mqtt.connect('tls://broker.emqx.io:8084/mqtt', options);

client.on('connect', () => {
  console.log('Connected!');
});

client.on('error', (error) => {
  console.log('Error:', error);
});

client.on('message', function (topic, message) {
  handleMessage(topic, String.fromCharCode.apply(null, message));
});

client.subscribe('jan/esp32/v1');

const handleMessage = (topic, message) => {
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

var colorPicker = new ColorPicker({
  el: document.body,
  color: '#123456',
  background: '#656565',
  width: '400',
  height: '400',
});

colorPicker.onChange((getHexString) => {
  const { red, green, blue } = hexRgb(getHexString);
  color = `rgb(${red}, ${green}, ${blue})`;
  document.body.style.background = color;
});
