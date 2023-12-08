import { getExtrema } from '../../../compute/getExtrema';
import { removeClosePoints } from '../removeClosePoints';

test('combine minimum points after getExtrema function', () => {
  const image = testUtils.createGreyImage([
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 2, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 3, 3, 3, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 2, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ]);

  const points = getExtrema(image, { kind: 'minimum' });

  const result = removeClosePoints(points, image, {
    distance: 2,
    kind: 'minimum',
    channel: 0,
  });
  expect(result).toStrictEqual([
    { column: 3, row: 5 },
    { column: 6, row: 7 },
    { column: 3, row: 2 },
  ]);
});

test('combine maximum points after getExtrema function', () => {
  const image = testUtils.createGreyImage([
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

  const points = getExtrema(image, {
    kind: 'maximum',
    algorithm: 'star',
  });

  const result = removeClosePoints(points, image, {
    kind: 'maximum',
    distance: 3,
  });
  expect(result).toStrictEqual([
    { column: 2, row: 2 },
    { column: 3, row: 5 },
    { column: 7, row: 6 },
  ]);
});
test('test error handling', () => {
  const image = testUtils.createRgbaImage([
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 6, 1, 1],
    [1, 1, 1, 1],
    [1, 5, 6, 1],
  ]);
  expect(() => {
    const points = getExtrema(image, {
      kind: 'maximum',
      algorithm: 'star',
    });

    const result = removeClosePoints(points, image, {
      kind: 'maximum',
      distance: 0,
    });
    return result;
  }).toThrowError(
    'image channel must be specified or image must have only one channel',
  );
});
