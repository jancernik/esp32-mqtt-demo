import ColorPicker from 'simple-color-picker';
import 'toolcool-range-slider';
import MQTT from './MQTT';
import topic from './topics';
import g from './global';
import Handle from './handlers';

export const colorPicker = new ColorPicker({
  el: document.body,
  width: '350',
  height: '350',
});

export default class UI {
  static bindEvents() {
    const sliders = document.querySelector('.slider');
    window.addEventListener('mouseup', (e) => {
      if (sliders.contains(e.target)) return;
      MQTT.send(topic.rgb, g.color);
    });

    window.addEventListener(
      'touchend',
      () => {
        if (sliders.contains(e.target)) return;
        MQTT.send(topic.rgb, g.color);
      },
      false
    );

    window.addEventListener(
      'touchcancel',
      () => {
        if (sliders.contains(e.target)) return;
        MQTT.send(topic.rgb, g.color);
      },
      false
    );

    colorPicker.onChange((getHexString) => {
      g.color = getHexString;
      document.body.style.background = g.color;
    });

    window.addEventListener('resize', Handle.resize);
  }

  static modifyColorPicker() {
    const container = document.querySelector('.container');
    const scp = document.querySelector('.Scp');
    const scpWrapper = document.createElement('div');
    scpWrapper.classList.add('scp-wrapper');
    scp.parentNode.insertBefore(scpWrapper, scp);
    scpWrapper.appendChild(scp);

    scpWrapper.parentNode.insertBefore(container, scpWrapper);
    container.appendChild(scpWrapper);
  }
}
