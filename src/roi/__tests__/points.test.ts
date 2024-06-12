import { fromMask } from '..';

test('points 1st test', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].relativePoints).toStrictEqual([
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 0, row: 1 },
    { column: 1, row: 1 },
    { column: 0, row: 2 },
    { column: 1, row: 2 },
    { column: 0, row: 3 },
    { column: 1, row: 3 },
  ]);
});

test('points 2nd test', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 0, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();

  expect(rois[0].relativePoints).toStrictEqual([
    { column: 2, row: 0 },
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 0, row: 2 },
    { column: 1, row: 2 },
    { column: 2, row: 2 },
    { column: 3, row: 2 },
    { column: 2, row: 3 },
  ]);
});

test('points 3rd test with absolute values', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 1, 1, 1],
    [0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[1].absolutePoints).toStrictEqual([
    { column: 3, row: 0 },
    { column: 4, row: 0 },
    { column: 5, row: 0 },
    { column: 3, row: 1 },
    { column: 5, row: 1 },
    { column: 3, row: 2 },
    { column: 5, row: 2 },
    { column: 3, row: 3 },
    { column: 4, row: 3 },
    { column: 5, row: 3 },
  ]);
});
