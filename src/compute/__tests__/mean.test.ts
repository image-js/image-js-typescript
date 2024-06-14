import { Point } from '../../geometry';
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
test('must throw if array is empty', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
  ]);
  const points: Point[] = [];

  expect(() => {
    const result = image.mean({ points });
    return result;
  }).toThrow('Array of coordinates is empty.');
});
test("must throw if point's row is invalid.", () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
  ]);
  const points: Point[] = [{ column: 0, row: 2 }];

  expect(() => {
    const result = image.mean({ points });
    return result;
  }).toThrow('Invalid coordinate: {column: 0, row: 2}');
});
test("must throw if point's column is invalid.", () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
  ]);
  const points: Point[] = [{ column: 4, row: 1 }];

  expect(() => {
    const result = image.mean({ points });
    return result;
  }).toThrow('Invalid coordinate: {column: 4, row: 1}');
});
test('must throw if point has negative values.', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 0],
    [1, 2, 3, 0],
  ]);
  const points: Point[] = [{ column: -14, row: 0 }];

  expect(() => {
    const result = image.mean({ points });
    return result;
  }).toThrow('Invalid coordinate: {column: -14, row: 0}');
});
