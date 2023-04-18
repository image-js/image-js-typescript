import { fromMask } from '../fromMask';

test('should throw error', () => {
  const mask = testUtils.createMask([
    [1, 1, 0, 0, 0],
    [1, 0, 0, 1, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);

  const roiMapManager = fromMask(mask);

  const roi2 = roiMapManager.getRoiById(4);
  expect(roi2).toThrowError(/'Not found'/);
});

test('should give ROI of id = 1 ', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 0, 0, 0],
    [5, 0, 0, 200, 0],
    [0, 0, 225, 250, 200],
    [0, 0, 0, 0, 0],
  ]);

  const mask = image.threshold({ threshold: 100 });

  const roiMapManager = fromMask(mask);
  const roi = roiMapManager.getRoiById(1);

  expect(roi.id).toStrictEqual(1);
});
