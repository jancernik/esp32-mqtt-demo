import './style/style.scss';
import MQTT from './app/MQTT';
import Handle from './app/handlers';
import UI from './app/UI';
import g from './app/global';

MQTT.bindEvents();
MQTT.subscribeAll();
UI.bindEvents();
window.addEventListener('load', () => {
  UI.modifyColorPicker();
  g.mobileView = !window.matchMedia('(max-width: 750px)').matches;
  Handle.resize();
});
