import { join } from 'node:path';

import { Image } from '../../Image';
import { Stack } from '../../Stack';
import { getStackFromFolder } from '../utils/getStackFromFolder';

test('simple images', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  const maxImage = stack.maxImage();

  expect(maxImage).toBeInstanceOf(Image);
  expect(maxImage.width).toBe(4);
  expect(maxImage.height).toBe(1);
  expect(maxImage.channels).toBe(1);
  expect(maxImage).toMatchImageData([[4, 3, 3, 4]]);
});

test('more complex stack', () => {
  const folder = join(__dirname, '../../../test/img/correctColor');
  const stack = getStackFromFolder(folder);

  const maxImage = stack.maxImage();
  expect(maxImage).toMatchImageSnapshot();
});
