import { encode } from '../encode';
import { writeSync } from '../write';

test('encode an 8-bit rgba image', () => {
  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255],
    [255, 255, 255, 255, 255],
    [255, 255, 255, 255, 255],
    [255, 255, 255, 255, 255],
    [255, 255, 255, 255, 255],
  ]);
  const mask = image.threshold();
  /*//console.log(mask);
  const encoded = encode(mask, { format: 'bmp' });
  //const encoded2 = encodeJpeg(image);
  writeSync(
    '/Users/maxim/git/zakodium/image-js-typescript/src/save/__tests__/bmpTest.bmp',
    mask,
  );

  writeSync(
    '/Users/maxim/git/zakodium/image-js-typescript/src/save/__tests__/bmpTest.jpeg',
    mask,
  );*/
});
