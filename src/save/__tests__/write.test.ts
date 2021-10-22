import { join } from 'path';

// @ts-expect-error
import { existsSync } from 'fs-extra';

import { write } from '..';
import { read } from '../..';
import { ImageColorModel } from '../../utils/colorModels';
import { ImageFormat } from '../encode';

let tmpDir: string;
beforeEach(() => {
  tmpDir = testUtils.makeTmpDir();
});
afterEach(() => {
  testUtils.cleanTmpDir(tmpDir);
});

test('write image to disk', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = join(tmpDir, 'image.png');
  await write(destination, img);
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead).toStrictEqual(img);
});

test('write image to disk (jpeg)', async () => {
  const img = testUtils.load('opencv/test.png');
  const destination = join(tmpDir, 'image.png');
  await write(destination, img, { format: ImageFormat.jpeg });
  expect(existsSync(destination)).toBe(true);
  const imgRead = await read(destination);
  expect(imgRead.width).toBe(img.width);
  expect(imgRead.colorModel).toBe(ImageColorModel.RGBA);
});
