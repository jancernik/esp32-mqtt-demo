import './style/style.scss';
import MQTT from './app/MQTT';
import UI from './app/UI';

MQTT.bindEvents();
MQTT.subscribeAll();
UI.bindEvents();
window.addEventListener('load', UI.modifyColorPicker);
