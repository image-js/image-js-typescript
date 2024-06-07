import { variance } from '../variance';

test('1x1 RGB image', () => {
  const image = testUtils.createGreyImage([[1, 2, 3]]);

  expect(variance(image)).toStrictEqual([2 / 3]);
});

test('GREY image', () => {
  const image = testUtils.createGreyImage([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
  ]);

  const result = image.variance();

  expect(result).toStrictEqual([525]);
});

test('variance from points', () => {
  const image = testUtils.createGreyImage([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
  ]);

  const points = [
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 2, row: 0 },
    { column: 3, row: 0 },
  ];

  const result = image.variance({ points });

  expect(result).toStrictEqual([125]);
});
