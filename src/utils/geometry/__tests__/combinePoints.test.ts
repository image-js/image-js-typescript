import getExtrema from '../../../compute/getExtrema';
import { combinePoints } from '../combinePoints';

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
  let result = combinePoints(points, 1);
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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  let points = getExtrema(image, { kind: 'maximum' });
  let result = combinePoints(points, 3);
  expect(result).toStrictEqual([
    { column: 3, row: 2 },
    { column: 6, row: 7 },
  ]);
});
