import Color from './colorUtils';
import UI from './UI';
import g from './global';
import topic from './topics';


export default class Handle {
  static message(topic, message) {
    if (topic === topic.r) {
      UI.colorPicker.setColor(Color.rgbCompToHex(g.color, message, 'r'));
    }
    if (topic === topic.g) {
      UI.colorPicker.setColor(Color.rgbCompToHex(g.color, message, 'g'));
    }
    if (topic === topic.b) {
      UI.colorPicker.setColor(Color.rgbCompToHex(g.color, message, 'b'));
    }
    if (topic === topic.rgb) {
      if (message.length > 7) UI.colorPicker.setColor(Color.rgbToHex(g.color, message));
      else UI.colorPicker.setColor(message);
    }
    console.log(topic, message);
  }
}
