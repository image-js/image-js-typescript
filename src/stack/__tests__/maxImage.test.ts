import { Image } from '../../Image';
import { Stack } from '../../Stack';

test('maxImage', () => {
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
