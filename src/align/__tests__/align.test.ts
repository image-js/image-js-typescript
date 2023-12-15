import { align } from '../align';

test('1 pixel source', () => {
  const source = testUtils.createGreyImage([
    [255, 0],
    [0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 255, 0],
    [0, 0, 0],
  ]);

  const result = align(source, destination);
  expect(result).toStrictEqual({ row: 2, column: 1 });
});
