import { ColorMode } from '../../colorRois';
import { getColorMap } from '../getColorMap';

describe('getColorMap', () => {
  it('BINARY color map', () => {
    const colorMap = getColorMap({
      nbNegative: 1,
      nbPositive: 1,
      mode: ColorMode.BINARY,
    });

    expect(colorMap).toHaveLength(65536);
    expect(colorMap[2 ** 15 - 1]).toBe(0xff0000ff);
    expect(colorMap[2 ** 15 + 1]).toBe(0x00ff00ff);
  });
});
