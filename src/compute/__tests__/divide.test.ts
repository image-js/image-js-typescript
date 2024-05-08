import { divide } from '../divide';

test('divide by 2', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = divide(image, 2);
  const result = testUtils.createRgbaImage([
    [115, 40, 60, 255],
    [50, 70, 6, 1],
  ]);
  expect(image).toStrictEqual(result);
});

test('must throw error', () => {
  const image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  expect(() => {
    divide(image, 0);
  }).toThrow('Value cannot be equal to 0.');
});
test('divide by decimal', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = divide(image, 0.25);
  const result = testUtils.createRgbaImage([
    [255, 255, 255, 255],
    [255, 255, 52, 1],
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
    [32, 11, 17, 255],
    [14, 20, 1, 1],
  ]);
  expect(image).toStrictEqual(result);
});
