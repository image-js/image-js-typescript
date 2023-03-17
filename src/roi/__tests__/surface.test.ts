import { fromMask } from '..';

test('surface of a figure with a hole', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].surface).toStrictEqual(8);
});

test('surface of a slightly more complex figure', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 0, 0],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].surface).toStrictEqual(13);
});

test('surface on multiple ROIs', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].surface).toStrictEqual(1);
  expect(rois[1].surface).toStrictEqual(3);
  expect(rois[2].surface).toStrictEqual(8);
});
