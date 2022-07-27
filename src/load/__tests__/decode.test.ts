import { decode } from '..';
import { ColorDepth } from '../../IJS';
import { ImageColorModel } from '../../utils/constants/colorModels';

test('auto decode png', async () => {
  const buffer = testUtils.loadBuffer('formats/grey8.png');
  expect(() => decode(buffer)).not.toThrow();
  const decoded = decode(buffer);
  expect(decoded.depth).toStrictEqual(ColorDepth.UINT8);
  expect(decoded.colorModel).toStrictEqual(ImageColorModel.GREY);
});

test('auto decode jpeg', async () => {
  const buffer = testUtils.loadBuffer('formats/rgb12.jpg');
  expect(() => decode(buffer)).not.toThrow();
  const decoded = decode(buffer);
  expect(decoded.depth).toStrictEqual(ColorDepth.UINT8);
  expect(decoded.colorModel).toStrictEqual(ImageColorModel.RGBA);
});

test('auto decode tiff', async () => {
  const buffer = testUtils.loadBuffer('formats/tif/grey8.tif');
  expect(() => decode(buffer)).not.toThrow();
  const decoded = decode(buffer);
  expect(decoded.depth).toStrictEqual(ColorDepth.UINT8);
  expect(decoded.colorModel).toStrictEqual(ImageColorModel.GREY);
});

test('should throw for too small data', () => {
  expect(() => decode(new Uint8Array(0))).toThrow(/unrecognized data format/);
});

test('should throw for unknown data', () => {
  expect(() => decode(new Uint8Array(10))).toThrow(/unrecognized data format/);
});
