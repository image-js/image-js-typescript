import { overlapImages } from '../overlapImages';

test('two triangles', () => {
  const source = testUtils.load('featureMatching/polygons/scaleneTriangle.png');
  const destination = testUtils.load(
    'featureMatching/polygons/scaleneTriangle2.png',
  );

  const result = overlapImages(source, destination);

  expect(result).toMatchImageSnapshot();
});