import { sum } from '../sum';

test('add image to itself', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = image;
  expect(sum(image, other)).toMatchImageData([
    [10, 10, 10, 20, 20, 20, 30, 30, 30],
  ]);
});

test('absolute = true', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[0, 0, 0, 20, 20, 20, 15, 15, 15]]);
  expect(sum(image, other)).toMatchImageData([
    [5, 5, 5, 30, 30, 30, 30, 30, 30],
  ]);
});

test('difference size images should throw', () => {
  const image = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10, 15, 15, 15]]);
  const other = testUtils.createRgbImage([[5, 5, 5, 10, 10, 10]]);
  expect(() => {
    sum(image, other);
  }).toThrow(`both images must have the same size`);
});

test('different number of channels should throw', () => {
  const image = testUtils.createGreyImage([[5, 10, 15]]);
  const other = testUtils.createRgbImage([[1, 1, 1, 5, 5, 5, 10, 10, 10]]);
  expect(() => {
    image.subtract(other);
  }).toThrow(`both images must have the same number of channels`);
});
