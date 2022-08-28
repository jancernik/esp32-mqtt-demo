import * as mqtt from 'mqtt/dist/mqtt';
import { v4 as uuidv4 } from 'uuid';
import Handle from './handlers';
import topic from './topics';

const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', {
  clientId: uuidv4(),
});

// const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
//   clientId: uuidv4(),
// });

export default class MQTT {
  static bindEvents() {
    client.on('connect', () => console.log('Connected!'));
    client.on('error', (error) => console.log('Error:', error));
    client.on('message', (topic, message) => {
      Handle.message(topic, String.fromCharCode.apply(null, message));
    });
  }

  static subscribeAll() {
    client.subscribe(topic.r);
    client.subscribe(topic.g);
    client.subscribe(topic.b);
    client.subscribe(topic.a);
    client.subscribe(topic.rgb);
    client.subscribe(topic.hum);
    client.subscribe(topic.temp);
  }

  static send(topic, message) {
    client.publish(topic, message);
  }
}
