import { mean } from '../mean';

test('5x1 RGB image', () => {
  const image = testUtils.createRgbImage([
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ]);

  const result = mean(image);

  expect(result).toStrictEqual([1, 2, 3]);
});

test('5x1 RGBA image', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
    [11, 2, 3, 0],
    [1, 3, 3, 0],
    [1, 6, 3, 0],
  ]);

  const result = image.mean();

  expect(result).toStrictEqual([3, 3, 3, 0]);
});

test('2x4 GREY image', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
  ]);

  const result = image.mean();

  expect(result).toStrictEqual([1.5]);
});
test('mean from points', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
  ]);
  const points = [
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 1 },
  ];
  const result = image.mean({ points });

  expect(result).toStrictEqual([2]);
});
test('mean from points in rgba image', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
  ]);
  const points = [
    { column: 0, row: 0 },
    { column: 0, row: 1 },
  ];
  const result = image.mean({ points });

  expect(result).toStrictEqual([1, 2, 3, 0]);
});
