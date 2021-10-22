import { readImage } from 'test';

import { decodeJpeg } from '..';
import { ColorDepth } from '../../IJS';
import { ImageColorModel } from '../../utils/colorModels';

describe('Load JPEG', function () {
  const tests = [['grey6'], ['grey12'], ['rgb6'], ['rgb12']];

  it.each(tests)('should load from buffer %s', async (name) => {
    const buffer = readImage(`${name}.jpg`);
    const img = await decodeJpeg(buffer);
    expect(img.colorModel).toBe(ImageColorModel.RGBA);
    expect(img.depth).toBe(ColorDepth.UINT8);
  });
});
