test('grey image 5x5', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5],
  ]);
  const result = image.medianFilter();

  expect(result).toMatchImageData([
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
    [2, 2, 3, 4, 4],
  ]);
});
test('grey image 5x5 with options as parameters', () => {
  const image2 = testUtils.createGreyImage([
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
    [10, 2, 20, 4, 5],
  ]);
  const result2 = image2.medianFilter({ radius: 1 });

  expect(result2).toMatchImageData([
    [10, 10, 4, 5, 5],
    [10, 10, 4, 5, 5],
    [10, 10, 4, 5, 5],
    [10, 10, 4, 5, 5],
    [10, 10, 4, 5, 5],
  ]);
});

test('RGBA image 1x5', () => {
  const image = testUtils.createRgbaImage([
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ]);
  const result = image.medianFilter();

  expect(result).toMatchImageData([
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ]);
});

test('grey horizontal', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const result = image.medianFilter();

  expect(result).toMatchImageData([[2, 2, 3, 3]]);
});
