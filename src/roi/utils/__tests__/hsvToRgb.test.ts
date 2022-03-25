import { hsvToRgb } from '../hsvToRgb';

describe('hsvToRgb', () => {
  it('black', () => {
    const hsv = new Uint8Array([50, 100, 0]);
    const rgb = new Uint8Array([0, 0, 0]);
    expect(hsvToRgb(hsv)).toStrictEqual(rgb);
  });
  it('white', () => {
    const hsv = new Uint8Array([50, 0, 255]);
    const rgb = new Uint8Array([255, 255, 255]);
    expect(hsvToRgb(hsv)).toStrictEqual(rgb);
  });
  it('red', () => {
    const hsv = new Uint8Array([0, 255, 255]);
    const rgb = new Uint8Array([255, 0, 0]);
    expect(hsvToRgb(hsv)).toStrictEqual(rgb);
  });
  it('green', () => {
    const hsv = new Uint8Array([120, 255, 255]);
    const rgb = new Uint8Array([0, 255, 0]);
    expect(hsvToRgb(hsv)).toStrictEqual(rgb);
  });
  it('blue', () => {
    const hsv = new Uint8Array([240, 255, 255]);
    const rgb = new Uint8Array([0, 0, 255]);
    expect(hsvToRgb(hsv)).toStrictEqual(rgb);
  });
});
