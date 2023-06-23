import getExtrema from '../../../compute/getExtrema';
import { filterPoints } from '../filterPoints';

test('combine minimum points after getExtrema function', () => {
  let image = testUtils.createGreyImage([
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 2, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 2, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ]);

  let points = getExtrema(image, { kind: 'minimum' });
  let result = filterPoints(points, 1);
  expect(result).toStrictEqual([
    { column: 3, row: 2 },
    { column: 6, row: 7 },
  ]);
});

test('combine maximum points after getExtrema function', () => {
  let image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 4, 4, 4, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 6, 1, 6, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 6, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 1, 6, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  let points = getExtrema(image, { kind: 'maximum', algorithm: 'cross' });
  console.log(image.histogram);
  console.log(points);
  let result = filterPoints(points, 3);
  console.log(result);
  expect(result).toStrictEqual([
    { column: 3, row: 2 },
    { column: 6, row: 7 },
  ]);
});
