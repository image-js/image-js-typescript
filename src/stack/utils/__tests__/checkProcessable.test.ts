import { Stack } from '../../../Stack';
import { checkProcessable } from '../checkProcessable';

test('should throw if images have different sizes', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3]]);
  const stack = new Stack([image1, image2]);
  expect(() => {
    checkProcessable(stack, { sameSize: true });
  }).toThrow('images must all have same dimensions to apply this algorithm');
});

test('default options', () => {
  const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const image2 = testUtils.createGreyImage([[4, 3, 2, 1]]);
  const stack = new Stack([image1, image2]);
  expect(() => {
    checkProcessable(stack);
  }).not.toThrow();
});
