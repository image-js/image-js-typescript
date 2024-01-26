import { overlapImages } from '../../../../featureMatching';
import { readSync } from '../../../../load';
import { writeSync } from '../../../../save';
import { ImageColorModel } from '../../../../utils/constants/colorModels';
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

test('small images with mask', () => {
  const destination = readSync(`${__dirname}/dest.png`).grey();
  const source = readSync(`${__dirname}/src.png`).grey();
  const srcMask = readSync(`${__dirname}/srcMask.png`).threshold();
  const dstMask = readSync(`${__dirname}/dstMask.png`).threshold();

  const result = getMinDiffTranslation(source, destination, {
    sourceMask: srcMask,
    destinationMask: dstMask,
    minNbPixels: 40,
    leftRightMargin: 15,
    topBottomMargin: 15,
  });

  const baseOverlap = overlapImages(source, destination);
  writeSync(`${__dirname}/baseOverlap.png`, baseOverlap);

  const maskOverlap = overlapImages(
    srcMask.convertColor(ImageColorModel.GREY),
    dstMask.convertColor(ImageColorModel.GREY),
    { origin: result },
  );
  writeSync(`${__dirname}/maskOverlap.png`, maskOverlap);
  console.log({ result });
  const overlap = overlapImages(source, destination, { origin: result });

  expect(overlap).toMatchImageSnapshot();
});

test('small source', () => {
  const source = testUtils.createGreyImage([
    [1, 1],
    [1, 1],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const result = getMinDiffTranslation(source, destination);
  expect(result).toBeDeepCloseTo({ column: 2, row: 1 });
});

test('same size', () => {
  const source = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const sourceMask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const destinationMask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const result = getMinDiffTranslation(source, destination, {
    leftRightMargin: 3,
    topBottomMargin: 3,
    sourceMask,
    destinationMask,
  });

  expect(result).toBeDeepCloseTo({ column: 2, row: -1 });
});
