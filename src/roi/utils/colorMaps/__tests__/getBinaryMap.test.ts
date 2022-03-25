import { RoiKind } from '../../../RoiManager';
import { getBinaryMap } from '../getBinaryMap';

describe('getBinaryMap', () => {
  it('roiKind BW', () => {
    const colorMap = getBinaryMap({
      nbNegative: 1,
      nbPositive: 1,
    });

    // console.log(colorMap.slice(32768 - 10, 32768 + 10));

    expect(colorMap).toHaveLength(65536);
    expect(colorMap[2 ** 15 - 1]).toBe(0xff0000ff); // red
    expect(colorMap[2 ** 15 + 1]).toBe(0xff00ff00); // green
  });

  it('roiKind WHITE', () => {
    const colorMap = getBinaryMap({
      nbNegative: 1,
      nbPositive: 1,
      roiKind: RoiKind.WHITE,
    });

    expect(colorMap[2 ** 15 - 1]).toBe(0);
    expect(colorMap[2 ** 15 + 1]).toBe(0xff00ff00);
  });
  it('roiKind BLACK', () => {
    const colorMap = getBinaryMap({
      nbNegative: 1,
      nbPositive: 1,
      roiKind: RoiKind.BLACK,
    });

    expect(colorMap[2 ** 15 - 1]).toBe(0xff0000ff);
    expect(colorMap[2 ** 15 + 1]).toBe(0);
  });
  it('test other hue (blue)', () => {
    const colorMap = getBinaryMap({
      nbNegative: 1,
      nbPositive: 1,
      whiteHue: 240,
    });

    expect(colorMap[2 ** 15 + 1]).toBe(0xffff0000); // blue
  });
});
