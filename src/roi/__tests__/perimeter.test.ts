import { fromMask } from '..';

test('perimeter', () => {
  const mask = testUtils.createMask([
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].perimeter).toBeCloseTo(9.656, 2);
});
test('perimeter', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].perimeter).toBeCloseTo(9.656, 2);
});
test('perimeter', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  const rois = fromMask(mask).getRois();
  expect(rois[0].perimeter).toBeCloseTo(9.656, 2);
});
