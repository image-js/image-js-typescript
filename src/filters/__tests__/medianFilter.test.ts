test('1x1 rgba image, out to itself', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
  ]);
  const result = image.medianFilter();
  expect(result).toStrictEqual([
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
  ]);
});
