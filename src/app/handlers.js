import Color from './colorUtils';
import { colorPicker } from './UI';
import g from './global';
import MQTT from './MQTT';
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
    if (rTopic === topic.a && message !== g.a) {
      g.a = message;
      const slider = document.querySelector('toolcool-range-slider');
      slider.setAttribute('value', message);
    }
    if (rTopic === topic.rgb) {
      if (message.length > 7) {
        colorPicker.setColor(Color.rgbToHex(g.color, message));
      } else if (g.color !== message) colorPicker.setColor(message);
    }
    console.log(rTopic, message);
  }

  static resize() {
    if (window.matchMedia('(max-width: 750px)').matches && !g.mobileView) {
      g.mobileView = true;
      const slider = document.getElementById('a');
      slider?.parentNode?.removeChild(slider);
      const newSlider = document.createElement('toolcool-range-slider');
      newSlider.setAttribute('id', 'a');
      newSlider.setAttribute('min', '0');
      newSlider.setAttribute('max', '255');
      newSlider.setAttribute('value', '255');
      newSlider.setAttribute('step', '1');
      newSlider.setAttribute('slider-radius', '0px');
      newSlider.setAttribute('pointer-shadow', 'none');
      newSlider.setAttribute('pointer-shadow-hover', 'none');
      newSlider.setAttribute('pointer-shadow-focus', 'none');
      newSlider.setAttribute('pointer-border-hover', 'none');
      newSlider.setAttribute('pointer-border-focus', 'none');
      newSlider.setAttribute('pointer-border', 'none');
      newSlider.setAttribute('slider-bg-fill', '#969696');
      newSlider.setAttribute('slider-bg-hover', '#242424');
      newSlider.setAttribute('slider-bg', '#242424');
      newSlider.setAttribute('pointer-radius', '4px');

      newSlider.setAttribute('type', 'horizontal');
      newSlider.setAttribute('slider-height', '20px');
      newSlider.setAttribute('slider-width', '361px');
      newSlider.setAttribute('pointer-height', '20px');
      newSlider.setAttribute('pointer-width', '8px');
      newSlider.setAttribute('btt', 'false');
      document.querySelector('.slider').append(newSlider);

      newSlider.addEventListener('change', (e) => {
        g.a = e.detail.value.toString();
      });
      newSlider.addEventListener('onMouseUp', () => {
        MQTT.send(topic.a, g.a);
      });
    } else if (
      !window.matchMedia('(max-width: 750px)').matches &&
      g.mobileView
    ) {
      g.mobileView = false;
      const slider = document.getElementById('a');
      slider?.parentNode?.removeChild(slider);
      const newSlider = document.createElement('toolcool-range-slider');
      newSlider.setAttribute('id', 'a');
      newSlider.setAttribute('min', '0');
      newSlider.setAttribute('max', '255');
      newSlider.setAttribute('value', '255');
      newSlider.setAttribute('step', '1');
      newSlider.setAttribute('slider-radius', '0px');
      newSlider.setAttribute('pointer-shadow', 'none');
      newSlider.setAttribute('pointer-shadow-hover', 'none');
      newSlider.setAttribute('pointer-shadow-focus', 'none');
      newSlider.setAttribute('pointer-border-hover', 'none');
      newSlider.setAttribute('pointer-border-focus', 'none');
      newSlider.setAttribute('pointer-border', 'none');
      newSlider.setAttribute('slider-bg-fill', '#969696');
      newSlider.setAttribute('slider-bg-hover', '#242424');
      newSlider.setAttribute('slider-bg', '#242424');
      newSlider.setAttribute('pointer-radius', '4px');

      newSlider.setAttribute('type', 'vertical');
      newSlider.setAttribute('slider-width', '20px');
      newSlider.setAttribute('slider-height', '350px');
      newSlider.setAttribute('pointer-height', '8px');
      newSlider.setAttribute('pointer-width', '20px');
      newSlider.setAttribute('btt', 'true');
      document.querySelector('.slider').append(newSlider);

      newSlider.addEventListener('change', (e) => {
        g.a = e.detail.value.toString();
      });
      newSlider.addEventListener('onMouseUp', () => {
        MQTT.send(topic.a, g.a);
      });
    }
  }
}
