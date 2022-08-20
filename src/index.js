import './style/style.scss';
import * as mqtt from "mqtt/dist/mqtt"

const options = {
  clientId: 'ueyrghgfgf43e5beouwesfwefveghvuer',
  username: 'jan',
  password: '1234'
};

const client = mqtt.connect('wss://broker.hivemq.com:8000/mqtt', options);

client.on('connect', () => {
  console.log('Connected!');
});

client.on('error', (error) => {
  console.log('Error:', error);
});

client.on('message', function(topic, message) {
  handleMessage(topic, String.fromCharCode.apply(null, message));
});

document.getElementById('slider1').addEventListener('change', (e) => {
  client.publish('jan/esp32/v2', e.target.value);
  console.log('jan/esp32/v2', e.target.value);
})

client.subscribe('jan/esp32/v1');

const handleMessage = (topic, message) => {
  console.log(topic, message);
}