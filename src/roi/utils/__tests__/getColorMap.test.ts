import { RoiKind } from '../../RoiManager';
import { ColorMode } from '../../colorRois';
import { getColorMap } from '../getColorMap';

describe('getColorMap', () => {
  it('BINARY color map, BW', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
      mode: ColorMode.BINARY,
    });

    // console.log(colorMap.slice(32768 - 10, 32768 + 10));

    expect(colorMap).toHaveLength(65536);
    expect(colorMap[2 ** 15 - 1]).toBe(0xff0000ff);
    expect(colorMap[2 ** 15 + 1]).toBe(0xff00ff00);
  });

  it('BINARY color map, WHITE', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
      mode: ColorMode.BINARY,
      roiKind: RoiKind.WHITE,
    });

    expect(colorMap).toHaveLength(65536);
    expect(colorMap[2 ** 15 - 1]).toBe(0);
    expect(colorMap[2 ** 15 + 1]).toBe(0xff00ff00);
  });
});
