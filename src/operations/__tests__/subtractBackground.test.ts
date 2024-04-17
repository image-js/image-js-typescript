import { readSync } from '../../load';
import { sampleBackgroundPoints } from '../../utils/sampleBackgroundPoints';
import { getMaskFromCannyEdge } from '../getMaskFromCannyEdge';
import { subtractBackground } from '../subtractBackground';

test('basic test', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
  ]);
  const mask = getMaskFromCannyEdge(image);
  const points = sampleBackgroundPoints(image, mask, {
    numberOfColumns: 3,
    numberOfRows: 3,
  });
  const newImage = subtractBackground(image, points, 2);
  const result = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  expect(newImage).toEqual(result);
});

test('test with object 8x8', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ]);
  const mask = getMaskFromCannyEdge(image, { iterations: 0 });
  console.log(
    image.cannyEdgeDetector({
      lowThreshold: 0,
      highThreshold: 0.001,
      hysteresis: false,
    }),
  );
  console.log(image.derivativeFilter().threshold());
  const points = sampleBackgroundPoints(
    image,
    image.derivativeFilter().threshold(),
    {
      numberOfColumns: 5,
      numberOfRows: 5,
    },
  );
  const newImage = subtractBackground(image, points, 2);
  console.log(newImage);
  const result = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 47, 48, 49, 0, 0, 0],
    [0, 0, 0, 47, 48, 49, 0, 0],
    [0, 0, 0, 47, 48, 49, 0, 0],
    [0, 0, 0, 47, 48, 49, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(newImage).toEqual(result);
});

test('basic screws image test', () => {
  const image = readSync(
    __dirname.concat('/__image_snapshots__/screws2.png'),
  ).grey();
  const mask = getMaskFromCannyEdge(image);
  const points = sampleBackgroundPoints(image, mask, {
    numberOfColumns: 15,
    numberOfRows: 15,
  });
  const newImage = subtractBackground(image, points, 2);
  expect(newImage).toMatchSnapshot('/__image_snapshots__/output.png');
});
