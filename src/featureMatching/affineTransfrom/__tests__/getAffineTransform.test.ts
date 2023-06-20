import { TestImagePath } from '../../../../test/TestImagePath';
import { overlapImages } from '../../visualize/overlapImages';
import { getAffineTransform } from '../getAffineTransform';

test.each([
  {
    message: 'twice same image',
    source: 'polygons/scaleneTriangle',
    destination: 'polygons/scaleneTriangle',
    expected: { row: 0, column: 0 },
  },
  {
    message: 'rotation 10 degrees',
    source: 'polygons/scaleneTriangle',
    destination: 'polygons/scaleneTriangle10',
    expected: { row: 195, column: 1 },
  },
  {
    message: 'polygons',
    source: 'polygons/polygon',
    destination: 'polygons/polygon2',
    expected: { row: 68, column: 178 },
  },
  {
    message: 'ID cards crops',
    source: 'id-crops/crop1',
    destination: 'id-crops/crop3',
    expected: { row: -7, column: 1 },
  },
])('various polygons ($message)', (data) => {
  const source = testUtils
    .load(`featureMatching/${data.source}.png` as TestImagePath)
    .convertColor('GREY');

  const destination = testUtils
    .load(`featureMatching/${data.destination}.png` as TestImagePath)
    .convertColor('GREY');

  const result = getAffineTransform(source, destination, {
    maxRansacNbIterations: 1000,
  });

  const transform = result.transform;

  expect(transform.translation).toBeDeepCloseTo(data.expected);

  const image = overlapImages(source, destination, {
    origin: transform.translation,
    angle: -transform.rotation,
    scale: transform.scale,
  });

  expect(image).toMatchImageSnapshot();
});