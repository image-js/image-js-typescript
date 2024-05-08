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
