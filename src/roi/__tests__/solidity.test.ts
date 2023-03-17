import { fromMask } from '..';

test('soliditiy', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].solidity).toBeCloseTo(0.8571, 2);
});

test('soliditiy', () => {
  const mask = testUtils.createMask([
    [1, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 0],
    [0, 1, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].solidity).toBeCloseTo(0.8571, 2);
});
