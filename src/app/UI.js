import ColorPicker from 'simple-color-picker';
import MQTT from './MQTT';
import topic from './topics';
import g from './global';
 
 export const colorPicker = new ColorPicker({
    el: document.body,
    background: '#656565',
    width: '400',
    height: '400',
  });
  

export default class UI {
  static bindEvents() {
    window.addEventListener('mouseup', () => {
      MQTT.send(topic.rgb, g.color);
    });
    
    window.addEventListener(
      'touchend',
      () => {
      MQTT.send(topic.rgb, g.color);
      },
      false
    );
    
    window.addEventListener(
      'touchcancel',
      () => {
      MQTT.send(topic.rgb, g.color);
      },
      false
    );

    colorPicker.onChange((getHexString) => {
      g.color = getHexString;
      document.body.style.background = g.color;
    });
  }


}