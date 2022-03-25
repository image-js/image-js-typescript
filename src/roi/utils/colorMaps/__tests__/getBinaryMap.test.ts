import { RoiKind } from '../../../RoiManager';
import { getBinaryMap } from '../getBinaryMap';

describe('getBinaryMap', () => {
  it('roiKind BW', () => {
    const colorMap = getBinaryMap(1, 1);

    // console.log(colorMap.slice(32768 - 10, 32768 + 10));

    expect(colorMap).toHaveLength(65536);
    expect(colorMap[2 ** 15 - 1]).toBe(0xff0000ff);
    expect(colorMap[2 ** 15 + 1]).toBe(0xff00ff00);
  });

  it('roiKind WHITE', () => {
    const colorMap = getBinaryMap(1, 1, {
      roiKind: RoiKind.WHITE,
    });

    expect(colorMap).toHaveLength(65536);
    expect(colorMap[2 ** 15 - 1]).toBe(0);
    expect(colorMap[2 ** 15 + 1]).toBe(0xff00ff00);
  });
  it('roiKind BLACK', () => {
    const colorMap = getBinaryMap(1, 1, {
      roiKind: RoiKind.BLACK,
    });

    expect(colorMap).toHaveLength(65536);
    expect(colorMap[2 ** 15 - 1]).toBe(0xff0000ff);
    expect(colorMap[2 ** 15 + 1]).toBe(0);
  });
});
