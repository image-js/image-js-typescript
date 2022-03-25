import { RoiKind } from '../../../RoiManager';
import { getRainbowMap } from '../getRainbowMap';

describe('getRainbowMap', () => {
  it('1 negative and 2 positive ROIs, roiKind: BLACK', () => {
    const colorMap = getRainbowMap({
      nbNegative: 1,
      nbPositive: 2,
      roiKind: RoiKind.WHITE,
    });

    expect(colorMap[2 ** 15 - 1]).toBe(0); // transparent
    expect(colorMap[2 ** 15 + 1]).toBe(0xff0000ff); // red
    expect(colorMap[2 ** 15 + 2]).toBe(0xffffff00); // turquoise
  });
});
