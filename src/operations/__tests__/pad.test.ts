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
  image = pad(image, 1, [125]);
  expect(image).toStrictEqual(result);
});
