import { Point } from '../../geometry';
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

test('test with object 8x8 and manually picked points', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ]);
  const points: Point[] = [
    { column: 0, row: 0 },
    { column: 1, row: 6 },
    { column: 2, row: 1 },
    { column: 3, row: 1 },
    { column: 4, row: 6 },
    { column: 3, row: 7 },
    { column: 4, row: 7 },
    { column: 5, row: 7 },
  ];

  const newImage = subtractBackground(image, points, 2);
  const result = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 247, 246, 245, 244, 0, 0],
    [0, 0, 247, 0, 0, 244, 0, 0],
    [0, 0, 247, 0, 0, 244, 0, 0],
    [0, 0, 247, 246, 245, 244, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(newImage).toEqual(result);
});

test('test with object 8x8 and sampled points', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 4, 5, 250, 7, 8],
    [1, 2, 250, 250, 250, 250, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ]);
  const mask = getMaskFromCannyEdge(image, { iterations: 0 });

  const points = sampleBackgroundPoints(image, mask, {
    numberOfColumns: 5,
    numberOfRows: 5,
  });
  const newImage = subtractBackground(image, points, 2);
  const result = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 247, 246, 245, 244, 0, 0],
    [0, 0, 247, 0, 0, 244, 0, 0],
    [0, 0, 247, 0, 0, 244, 0, 0],
    [0, 0, 247, 246, 245, 244, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(newImage).toEqual(result);
});

test('basic screws image test', () => {
  const image = testUtils.load('various/screws2.png').grey();
  const mask = getMaskFromCannyEdge(image);
  const points = sampleBackgroundPoints(image, mask, {
    numberOfColumns: 15,
    numberOfRows: 15,
  });
  const newImage = subtractBackground(image, points, 2);
  expect(newImage).toMatchImageSnapshot();
});

test('basic sudoku image test', () => {
  const image = testUtils.load('various/sudoku.jpg').grey();
  const mask = getMaskFromCannyEdge(image, { iterations: 0 });
  const points = sampleBackgroundPoints(image, mask, {
    numberOfColumns: 15,
    numberOfRows: 15,
  });
  const newImage = subtractBackground(image, points, 2);
  expect(newImage).toMatchImageSnapshot();
});
