import Color from './colorUtils';
import {colorPicker} from './UI';
import g from './global';
import topic from './topics';

export default class Handle {
  static message(rTopic, message) {
    if (rTopic === topic.temp) {
      document.querySelector('.temp-value').textContent = message;
    }
    if (rTopic === topic.hum) {
      document.querySelector('.hum-value').innerHTML = message;
    }
    if (rTopic === topic.r) {
      colorPicker.setColor(Color.rgbCompToHex(g.color, message, 'r'));
    }
    if (rTopic === topic.g) {
      colorPicker.setColor(Color.rgbCompToHex(g.color, message, 'g'));
    }
    if (rTopic === topic.b) {
      colorPicker.setColor(Color.rgbCompToHex(g.color, message, 'b'));
    }
    if (rTopic === topic.rgb) {
      if (message.length > 7) {
        colorPicker.setColor(Color.rgbToHex(g.color, message));
      } else colorPicker.setColor(message);
      console.log('message: ', message);

    }
    console.log(rTopic, message);
  }
}