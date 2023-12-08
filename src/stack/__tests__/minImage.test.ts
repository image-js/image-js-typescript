import { join } from 'node:path';

import { Image } from '../../Image';
import { Stack } from '../../Stack';
import { getStackFromFolder } from '../utils/getStackFromFolder';

test('simple images', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  const minImage = stack.minImage();

  expect(minImage).toBeInstanceOf(Image);
  expect(minImage.width).toBe(4);
  expect(minImage.height).toBe(1);
  expect(minImage.channels).toBe(1);
  expect(minImage).toMatchImageData([[1, 2, 2, 1]]);
});

test('more complex stack', () => {
  const folder = join(__dirname, '../../../test/img/correctColor');
  const stack = getStackFromFolder(folder);
  const minImage = stack.minImage();
  expect(minImage).toMatchImageSnapshot();
});
