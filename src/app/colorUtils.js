import rgbHex from 'rgb-hex';

export default class Color {
  static rgbToHex = (color) => `#${rgbHex(color)}`;

  static rgbCompToHex = (color, val, comp) => {
    let d = [];
    if (comp === 'r') d = [1, 2];
    if (comp === 'g') d = [3, 4];
    if (comp === 'b') d = [5, 6];
    const hex = parseInt(val, 10).toString(16);
    const hexArray = hex.split('');
    let newColor = color.split('');
    newColor.splice(d[0], 1, hexArray[0]);
    newColor.splice(d[1], 1, hexArray[1]);
    return newColor.join('');
  };

  static hexToRgbComp = (color, comp) => {
    let d = [];
    if (comp === 'r') d = [1, 3];
    if (comp === 'g') d = [3, 5];
    if (comp === 'b') d = [5, 7];
    const hexComp = color.substring(d[0], d[1]);
    return parseInt(hexComp, 16).toString();
  };
}
