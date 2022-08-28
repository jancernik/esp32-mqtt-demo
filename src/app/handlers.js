import Color from './colorUtils';
import { colorPicker } from './UI';
import g from './global';
import topic from './topics';

export default class Handle {
  static message(rTopic, message) {
    if (rTopic === topic.temp) {
      const tempElement = document.querySelector('.temp-value');
      const tempProgress = document.querySelector('.temp-progress');
      const parsedMsg = parseInt(message, 10);
      tempElement.innerHTML = message;
      tempProgress.style.transform = `scaleX(${(parsedMsg * 100) / 50 / 100})`;
      if (parsedMsg < 16) tempProgress.style.background = '#99ccff';
      else if (parsedMsg < 33) tempProgress.style.background = '#99ffcc';
      else tempProgress.style.background = '#ff9999';
    }
    if (rTopic === topic.hum) {
      const humElement = document.querySelector('.hum-value');
      const humProgress = document.querySelector('.hum-progress');
      const parsedMsg = parseInt(message, 10);
      humElement.innerHTML = message;
      humProgress.style.transform = `scaleX(${parsedMsg / 100})`;
      if (parsedMsg < 33) humProgress.style.background = '#cce6ff';
      else if (parsedMsg < 66) humProgress.style.background = '#66b3ff';
      else humProgress.style.background = '#0080ff';
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
