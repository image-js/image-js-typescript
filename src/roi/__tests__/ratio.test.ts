test('ratio of ROI', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
  ]);

  expect(mask.ratio).toBe(4 / 4);
});

test('ratio of ROI', () => {
  const mask = testUtils.createMask([
    [0, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(mask.ratio).toBe(7 / 5);
});
