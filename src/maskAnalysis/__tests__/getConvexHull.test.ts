import { getConvexHull } from '../getConvexHull';

test('cross', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull.points).toStrictEqual([
    { column: 0, row: 1 },
    { column: 1, row: 2 },
    { column: 2, row: 1 },
    { column: 1, row: 0 },
  ]);
});

test('small triangle', () => {
  const mask = testUtils.createMask([
    [0, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull.points).toStrictEqual([
    { column: 0, row: 2 },
    { column: 2, row: 2 },
    { column: 2, row: 0 },
  ]);
});

test('1 pixel ROI', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull.points).toStrictEqual([]);
});

test('2 pixels ROI', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 1, 1],
    [0, 0, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull.points).toStrictEqual([
    { column: 1, row: 1 },
    { column: 2, row: 1 },
  ]);
});

test('5x5 cross', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull.points).toStrictEqual([
    { column: 0, row: 2 },
    { column: 2, row: 4 },
    { column: 4, row: 2 },
    { column: 2, row: 0 },
  ]);
});

test('random shape', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ]);

  const convexHull = getConvexHull(mask);
  expect(convexHull.points).toStrictEqual([
    { column: 0, row: 4 },
    { column: 4, row: 2 },
    { column: 2, row: 0 },
  ]);
});

test('empty mask', () => {
  const mask = testUtils.createMask([
    [0, 0],
    [0, 0],
  ]);

  const result = mask.getConvexHull();

  expect(result).toStrictEqual({
    points: [],
    surface: 0,
    perimeter: 0,
  });
});
