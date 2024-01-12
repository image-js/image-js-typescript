import { overlapImages } from '../../../featureMatching';
import { getMinDiffTranslation } from '../getMinDiffTranslation';

test('no margins on sides', () => {
  const source = testUtils.createGreyImage([
    [1, 2, 3, 4],
    [0, 0, 0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ]);
  expect(getMinDiffTranslation(source, destination)).toBeDeepCloseTo({
    column: 0,
    row: 0,
  });
});

test('margins of 1 pixels', () => {
  const source = testUtils.createGreyImage([
    [1, 2, 3, 4],
    [0, 45, 0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [1, 2, 3, 4],
  ]);

  const result = getMinDiffTranslation(source, destination, {
    topBottomMargin: 1,
    leftRightMargin: 1,
  });

  expect(result).toBeDeepCloseTo({
    column: 0,
    row: 1,
  });
});

test('larger images', () => {
  const factor = 0.2;
  const source = testUtils
    .load('align/croppedRef.png')
    .resize({ xFactor: factor, yFactor: factor });
  const destination = testUtils
    .load('align/cropped.png')
    .resize({ xFactor: factor, yFactor: factor });

  const result = getMinDiffTranslation(source, destination);

  const overlap = overlapImages(source, destination, { origin: result });
  expect(overlap).toMatchImageSnapshot();
});
