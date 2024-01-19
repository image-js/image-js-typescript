import { overlapImages } from '../../../featureMatching';
import { writeSync } from '../../../save';
import { alignDifferentSize } from '../alignDifferentSize';

test('id crops', () => {
  const destination = testUtils.load('align/cropped.png').grey();
  const source = testUtils.load('align/croppedRef.png').grey();

  const result = alignDifferentSize(source, destination, {
    maxNbOperations: 1e8,
  });

  const overlap = overlapImages(source, destination, { origin: result });

  expect(overlap).toMatchImageSnapshot();
});

test('different image sizes, rounding problem', () => {
  const einstein = testUtils.load('ssim/ssim-original.png');

  const origin = { row: 50, column: 50 };
  const destination = einstein.crop({
    width: 200,
    height: 200,
  });
  const source = einstein.crop({
    width: 200,
    height: 100,
    origin,
  });

  const result = alignDifferentSize(source, destination, {
    maxNbOperations: 1e8,
    xFactor: 0.5,
    yFactor: 0.5,
  });

  const overlap = overlapImages(source, destination, { origin: result });
  writeSync(`${__dirname}/overlap.png`, overlap);

  expect(result).toStrictEqual(origin);
});

test('different image sizes, no rounding problem', () => {
  const einstein = testUtils.load('ssim/ssim-original.png');

  const origin = { row: 20, column: 24 };
  const destination = einstein.crop({
    width: 150,
    height: 200,
  });
  const source = einstein.crop({
    width: 160,
    height: 120,
    origin,
  });

  const result = alignDifferentSize(source, destination, {
    maxNbOperations: 1e8,
    xFactor: 0.5,
    yFactor: 0.5,
  });

  const overlap = overlapImages(source, destination, { origin: result });
  writeSync(`${__dirname}/overlap.png`, overlap);

  expect(result).toStrictEqual(origin);
});
