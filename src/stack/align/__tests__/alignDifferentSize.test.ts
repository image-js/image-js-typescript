import { overlapImages } from '../../../featureMatching';
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
