import { pad } from '../pad';

test('basic test', () => {
  let image = testUtils.createGreyImage([
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
  ]);
  const result = testUtils.createGreyImage([
    [125, 125, 125, 125, 125],
    [125, 255, 255, 255, 125],
    [125, 255, 255, 255, 125],
    [125, 255, 255, 255, 125],
    [125, 125, 125, 125, 125],
  ]);
  image = pad(image, { horPad: 1, vertPad: 1 }, [125]);
  expect(image).toStrictEqual(result);
});
test('basic test', () => {
  let image = testUtils.createGreyImage([
    [1, 2],
    [3, 4],
  ]);
  const result = testUtils.createGreyImage([
    [9, 9, 9, 9],
    [9, 1, 2, 9],
    [9, 3, 4, 9],
    [9, 9, 9, 9],
  ]);
  image = pad(image, { horPad: 1, vertPad: 1 }, [9]);
  expect(image).toStrictEqual(result);
});
