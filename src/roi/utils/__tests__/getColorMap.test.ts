import { ColorMode } from '../../colorRois';

import { getColorMap } from '../getColorMap';

describe('getColorMap', () => {
  it('BINARY color map', () => {
    const colorMap = getColorMap({ mode: ColorMode.BINARY });
    expect(colorMap[0]).toBe(0xff0000ff);
    expect(colorMap[colorMap.length - 1]).toBe(0x00ff00ff);
  });
});
