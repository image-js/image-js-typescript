import { Image } from '../../../Image';
import { Stack } from '../../../Stack';

test('simple test', () => {
  const image1 = testUtils.createGreyImage([[1, 1, 10, 1, 1]]);
  const image2 = testUtils.createGreyImage([[1, 1, 10, 1, 1]]);
  const image3 = testUtils.createGreyImage([[1, 1, 10, 1, 1]]);
  const image4 = testUtils.createGreyImage([[1, 1, 10, 1, 1]]);
  const stack = new Stack([image1, image2, image3, image4]);
  const result = new Map<number, number[]>([[1, [10, 10, 10, 10]]]);
  expect(stack.roiMeanValues()).toStrictEqual(result);
});
test('more complex stack', () => {
  const image1 = testUtils.createGreyImage([
    [10, 25, 1, 1, 1],
    [10, 25, 1, 1, 10],
    [1, 1, 1, 1, 1],
    [1, 1, 10, 10, 1],
    [1, 1, 10, 10, 1],
  ]);
  const image2 = new Image(5, 5, { colorModel: 'GREY' }).fill(1);
  const image3 = testUtils.createGreyImage([
    [10, 25, 1, 1, 1],
    [10, 25, 1, 1, 18],
    [1, 1, 1, 1, 1],
    [1, 1, 10, 10, 1],
    [1, 1, 10, 10, 1],
  ]);
  const image4 = new Image(5, 5, { colorModel: 'GREY' }).fill(1);
  const stack = new Stack([image1, image2, image3, image4]);
  const result = new Map<number, number[]>([
    [1, [17.5, 1, 17.5, 1]],
    [2, [10, 1, 10, 1]],
    [3, [10, 1, 18, 1]],
  ]);
  expect(stack.roiMeanValues()).toStrictEqual(result);
});
test('stack with different roi positions', () => {
  const image1 = testUtils.createGreyImage([
    [200, 200, 200, 1, 1],
    [200, 200, 1, 1, 1],
    [1, 200, 1, 1, 200],
    [1, 1, 1, 10, 200],
    [1, 1, 10, 200, 200],
  ]);
  const image2 = new Image(5, 5, { colorModel: 'GREY' }).fill(1);
  const image3 = testUtils.createGreyImage([
    [200, 200, 2, 1, 1],
    [200, 200, 1, 1, 1],
    [1, 2, 1, 1, 1],
    [1, 1, 1, 200, 200],
    [1, 1, 10, 10, 200],
  ]);
  const image4 = new Image(5, 5, { colorModel: 'GREY' }).fill(1);
  const stack = new Stack([image1, image2, image3, image4]);
  const result = new Map<number, number[]>([
    [1, [200, 1, 134, 1]],
    [2, [162, 1, 122.2, 1]],
  ]);
  expect(stack.roiMeanValues()).toStrictEqual(result);
});
