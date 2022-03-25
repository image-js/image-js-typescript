import { rgbToNumber } from '../../rgbToNumber';

describe('rgbToNumber', () => {
  it('white', () => {
    const rgb = new Uint8Array([255, 255, 255]);
    expect(rgbToNumber(rgb)).toBe(0xffffffff);
  });
});
