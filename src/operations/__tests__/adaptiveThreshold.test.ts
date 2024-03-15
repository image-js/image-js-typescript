import { adaptiveThreshold } from '../adaptiveThreshold';

test('test', () => {
  let image = testUtils.load('various/sudoku.jpg');
  image = image.grey();
  const mask = adaptiveThreshold(image, 7, 5);
  expect(mask).toBe(mask);
});
