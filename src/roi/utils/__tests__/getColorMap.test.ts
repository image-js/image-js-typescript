import { RoiKind } from '../../RoiManager';
import { ColorMode } from '../../colorRois';
import { getColorMap } from '../getColorMap';

describe('getBinaryMap', () => {
  it('binary, BW', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
    });

    // console.log(colorMap.slice(32768 - 10, 32768 + 10));

    expect(colorMap).toHaveLength(65536);
    expect(colorMap[2 ** 15 - 1]).toBe(0xff0000ff); // red
    expect(colorMap[2 ** 15 + 1]).toBe(0xff00ff00); // green
  });

  it('binary, WHITE', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
      roiKind: RoiKind.WHITE,
    });

    expect(colorMap[2 ** 15 - 1]).toBe(0);
    expect(colorMap[2 ** 15 + 1]).toBe(0xff00ff00);
  });
  it('binary, BLACK', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
      roiKind: RoiKind.BLACK,
    });

    expect(colorMap[2 ** 15 - 1]).toBe(0xff0000ff);
    expect(colorMap[2 ** 15 + 1]).toBe(0);
  });

  it('temperature, 1 negative and 1 positive ROIs', () => {
    const colorMap = getColorMap({
      mode: ColorMode.TEMPERATURE,
      nbNegative: 1,
      nbPositive: 1,
    });

    // console.log(colorMap.slice(32768 - 10, 32768 + 10));

    expect(colorMap[2 ** 15 - 1]).toBe(0xffff0000); // blue
    expect(colorMap[2 ** 15 + 1]).toBe(0xff0000ff); // red
  });
  it('rainbow, 1 negative and 2 positive ROIs, WHITE', () => {
    const colorMap = getColorMap({
      mode: ColorMode.RAINBOW,
      nbNegative: 1,
      nbPositive: 2,
      roiKind: RoiKind.WHITE,
    });

    expect(colorMap[2 ** 15 - 1]).toBe(0); // transparent
    expect(colorMap[2 ** 15 + 1]).toBe(0xff0000ff); // red
    expect(colorMap[2 ** 15 + 2]).toBe(0xffffff00); // turquoise
  });
});
