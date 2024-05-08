import { multiply } from '../multiply';

test('multiply by 2', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = multiply(image, 2);
  const result = testUtils.createRgbaImage([
    [255, 160, 240, 255],
    [200, 255, 26, 1],
  ]);
  expect(image).toStrictEqual(result);
});

test('mulitply by 100', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = multiply(image, 100);
  const result = testUtils.createRgbaImage([
    [255, 255, 255, 255],
    [255, 255, 255, 1],
  ]);
  expect(image).toStrictEqual(result);
});
test('multiply by decimal', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = multiply(image, 0.5);
  const result = testUtils.createRgbaImage([
    [115, 40, 60, 255],
    [50, 70, 6, 1],
  ]);
  expect(image).toStrictEqual(result);
});
