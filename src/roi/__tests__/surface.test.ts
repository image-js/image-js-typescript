import { fromMask } from '..';

test('surface', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].surface).toStrictEqual(8);
});

test('surface', () => {
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
