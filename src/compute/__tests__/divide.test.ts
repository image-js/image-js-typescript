import { divide } from '../divide';

test('divide by 2', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = divide(image, 2);
  const result = testUtils.createRgbaImage([
    [115, 40, 60, 127],
    [50, 70, 6, 0],
  ]);
  expect(image).toStrictEqual(result);
});

test('error when dividing by 0', () => {
  const image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  expect(() => {
    divide(image, 0);
  }).toThrow('Cannot divide by 0');
});
test('divide by decimal', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 4],
  ]);
  image = divide(image, 0.25);
  const result = testUtils.createRgbaImage([
    [255, 255, 255, 255],
    [255, 255, 52, 16],
  ]);
  expect(image).toStrictEqual(result);
});
test('divide by prime number', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = divide(image, 7);
  const result = testUtils.createRgbaImage([
    [32, 11, 17, 36],
    [14, 20, 1, 0],
  ]);
  expect(image).toStrictEqual(result);
});
