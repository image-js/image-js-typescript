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

test.only('different image sizes', () => {
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

  console.log(result);

  const overlap = overlapImages(source, destination, { origin: result });
  writeSync(`${__dirname}/overlap.png`, overlap);

  // expect(overlap).toMatchImageSnapshot();
  expect(result).toStrictEqual(origin);
});
