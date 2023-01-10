import { Image } from '../../../Image';
import { getKeypointColor } from '../getKeypointColor';
import { getScoreColors } from '../getScoreColors';

const origin = { column: 0, row: 0 };

test('keypoint should all have a different color', () => {
  const image = new Image(5, 5);
  const keypoints = [
    { origin, score: 5 },
    { origin, score: 4 },
    { origin, score: 3 },
    { origin, score: 2 },
    { origin, score: 1 },
  ];

  const colors = getScoreColors(image, [255, 0, 0], 5);
  let result = [];
  for (let i = 0; i < keypoints.length; i++) {
    result.push(getKeypointColor(keypoints, i, colors));
  }
  expect(result).toStrictEqual(colors);
});

test('keypoint with more random scores', () => {
  const image = new Image(5, 5);
  const keypoints = [
    { origin, score: 50 },
    { origin, score: 40 },
    { origin, score: 10 },
    { origin, score: 5 },
    { origin, score: 1 },
  ];

  const colors = getScoreColors(image, [255, 0, 0], 5);

  let result = [];
  for (let i = 0; i < keypoints.length; i++) {
    result.push(getKeypointColor(keypoints, i, colors));
  }
  expect(result).toStrictEqual([
    [255, 0, 0],
    [198, 0, 0],
    [27, 0, 0],
    [27, 0, 0],
    [27, 0, 0],
  ]);
});