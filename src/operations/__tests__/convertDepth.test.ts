import { getImage } from 'test';

import { ColorDepth } from '../../IJS';
import { ImageColorModel } from '../../utils/colorModels';

describe('convert depth', () => {
  it('Uint8 to Uint16', () => {
    const img = getImage(
      [
        [1, 2],
        [3, 4],
      ],
      ImageColorModel.GREY,
      ColorDepth.UINT8,
    );

    const newImg = img.convertDepth(ColorDepth.UINT16);
    expect(newImg.width).toBe(2);
    expect(newImg.height).toBe(2);
    expect(newImg.depth).toStrictEqual(ColorDepth.UINT16);
    expect(newImg.colorModel).toStrictEqual(ImageColorModel.GREY);
    expect(Array.from(newImg.data)).toStrictEqual([256, 512, 768, 1024]);
  });

  it('Uint16 to Uint8', () => {
    const img = getImage(
      [
        [30, 260],
        [512, 2047],
      ],
      ImageColorModel.GREY,
      ColorDepth.UINT16,
    );

    const newImg = img.convertDepth(ColorDepth.UINT8);
    expect(newImg.width).toBe(2);
    expect(newImg.height).toBe(2);
    expect(newImg.depth).toStrictEqual(ColorDepth.UINT8);
    expect(newImg.colorModel).toStrictEqual(ImageColorModel.GREY);
    expect(Array.from(newImg.data)).toStrictEqual([0, 1, 2, 7]);
  });

  it('Uint16 to Uint8 for rgba', () => {
    const img = getImage(
      [
        [
          [256, 256, 256, 256],
          [512, 512, 512, 512],
        ],
        [
          [768, 768, 768, 768],
          [1024, 1024, 1024, 1024],
        ],
      ],
      ImageColorModel.RGBA,
      ColorDepth.UINT16,
    );

    const newImg = img.convertDepth(ColorDepth.UINT8);
    expect(newImg.width).toBe(2);
    expect(newImg.height).toBe(2);
    expect(newImg.colorModel).toStrictEqual(ImageColorModel.RGBA);
    expect(newImg.depth).toStrictEqual(ColorDepth.UINT8);
    expect(newImg.data).toStrictEqual(
      Uint8Array.from([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]),
    );
  });
});
