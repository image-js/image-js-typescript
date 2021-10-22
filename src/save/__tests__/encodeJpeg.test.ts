import { getImage, decodeImage } from 'test';

import { encodeJpeg } from '..';
import { ColorDepth } from '../../IJS';
import { decode } from '../../load/decode';
import { ImageColorModel } from '../../utils/colorModels';

describe('encode JPEG', () => {
  it('encode an 8-bit rgba image', () => {
    const image = getImage(
      [
        [
          [1, 1, 1, 255],
          [2, 2, 2, 255],
        ],
        [
          [3, 3, 3, 255],
          [4, 4, 4, 255],
        ],
      ],
      ImageColorModel.RGBA,
      ColorDepth.UINT8,
    );

    const encoded = encodeJpeg(image);

    const reloaded = decode(encoded);
    expect(reloaded.width).toBe(2);
    expect(reloaded.height).toBe(2);
    expect(reloaded.colorModel).toStrictEqual(ImageColorModel.RGBA);
    expect(reloaded.depth).toStrictEqual(ColorDepth.UINT8);
  });
  it('decode the encoded jpeg returns image with same characteristics', () => {
    const image = decodeImage('rgb6.jpg');
    const encoded = encodeJpeg(image);
    const reloadedImage = decode(encoded);

    expect(image.width).toStrictEqual(reloadedImage.width);
    expect(image.height).toStrictEqual(reloadedImage.height);
    expect(image.colorModel).toStrictEqual(reloadedImage.colorModel);
  });

  it('encoding a 16-bit image should convert it to a 8-bit image', () => {
    const image = getImage(
      [
        [256, 512],
        [768, 1024],
      ],
      ImageColorModel.GREY,
      ColorDepth.UINT16,
    );
    const encoded = encodeJpeg(image);
    const reloaded = decode(encoded);
    expect(reloaded.width).toBe(2);
    expect(reloaded.height).toBe(2);
    expect(reloaded.colorModel).toStrictEqual(ImageColorModel.RGBA);
    expect(reloaded.depth).toStrictEqual(ColorDepth.UINT8);
  });
});
