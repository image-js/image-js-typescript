test('RGBA image - channel 0', () => {
  const image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  const histogram = image.histogram({ channel: 0 });
  const expected = new Uint32Array(256);
  expected[230] = 1;
  expected[100] = 1;
  expect(histogram).toStrictEqual(expected);
});

test('RGBA image - channel 2', () => {
  const image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 120, 1],
  ]);
  const histogram = image.histogram({ channel: 2 });
  const expected = new Uint32Array(256);
  expected[120] = 2;
  expect(histogram).toStrictEqual(expected);
});

test('binary image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 0, 0, 0, 0],
  ]);
  const histogram = image.histogram();
  expect(histogram[0]).toBe(16);
  expect(histogram[255]).toBe(9);
});

test('binary image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 0, 0, 0, 0],
  ]);
  const histogram = image.histogram({ channel: 0, maxSlots: 64 });
  expect(histogram[0]).toBe(16);
  expect(histogram[63]).toBe(9);
});

test('throw if channel option is missing', () => {
  const image = testUtils.load('opencv/test.png');
  expect(() => image.histogram()).toThrow(
    /channel option is mandatory for multi-channel images/,
  );
});
test('throw if maxSlots is not a power of 2', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 255, 255, 0],
    [0, 0, 0, 0, 0],
  ]);
  expect(() => image.histogram({ maxSlots: 7 })).toThrowError(
    'maxSlots must be a power of 2, for example: 64, 256, 1024',
  );
});
