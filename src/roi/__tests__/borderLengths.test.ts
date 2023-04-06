import { fromMask } from '../..';

test('border lengths property 5x5', () => {
  const mask = testUtils.createMask([
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].borderIDs[1].length).toStrictEqual(8);
});

test('border lengths property 4x4', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();

  expect(rois[0].borderIDs[0].length).toStrictEqual(6);
});

test('border lengths property 4x4', () => {
  const mask = testUtils.createMask([
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();
  expect(rois[0].borderIDs[0].id).toStrictEqual(-2);
  expect(rois[0].borderIDs[0].length).toStrictEqual(1);
});
