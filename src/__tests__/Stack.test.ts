import { Image } from '../Image';
import { Stack } from '../Stack';

test('create a stack containing one image', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const stack = new Stack([image]);

  const images = stack.getImages();
  expect(stack).toBeInstanceOf(Stack);
  expect(images).toHaveLength(1);
  expect(images).toBeInstanceOf(Image);
  expect(images).toBe(image);
});

test('should throw if color model is different', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createRgbaImage([[1, 2, 3, 4]]);
  expect(() => {
    new Stack([image1, image2]);
  }).toThrow('images must all have the same bit depth and color model');
});

test('should throw if bit depths different', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]], { bitDepth: 8 });
  const image2 = testUtils.createGreyImage([[1, 2, 3, 4]], { bitDepth: 16 });
  expect(() => {
    new Stack([image1, image2]);
  }).toThrow('images must all have the same bit depth and color model');
});
