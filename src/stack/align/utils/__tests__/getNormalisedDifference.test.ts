import { getNormalisedDifference } from '../getNormalisedDifference';

test.each([
  {
    translation: { column: 0, row: 0 },
    expected: 2.5,
  },
  {
    translation: { column: 1, row: 0 },
    expected: 2,
  },
  {
    translation: { column: 0, row: 1 },
    expected: 1.5,
  },
  {
    translation: { column: 1, row: 1 },
    expected: 1,
  },
])('two small grey images ($translation)', (data) => {
  const source = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ]);
  expect(
    getNormalisedDifference(source, destination, data.translation, {
      minNbPixels: 1,
    }),
  ).toBe(data.expected);
});

test.each([
  {
    translation: { column: -1, row: 0 },
    expected: 2,
  },
  {
    translation: { column: 0, row: -1 },
    expected: 0,
  },
])('negative offsets ($translation)', (data) => {
  const source = testUtils.createGreyImage([
    [1, 2, 3, 4],
    [0, 0, 0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ]);
  expect(
    getNormalisedDifference(source, destination, data.translation, {
      minNbPixels: 1,
    }),
  ).toBe(data.expected);
});

test('not enough overlapping points', () => {
  const source = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ]);
  expect(() =>
    getNormalisedDifference(
      source,
      destination,
      { row: -1, column: 0 },
      {
        minNbPixels: 1,
      },
    ),
  ).toThrow(`The number of pixels compared is too low (less than 1)`);
});

test('options error', () => {
  const source = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ]);
  expect(() =>
    getNormalisedDifference(
      source,
      destination,
      { row: -1, column: 0 },
      {
        minNbPixels: 1,
        minFractionPixels: 0.1,
      },
    ),
  ).toThrow(/You cannot specify both minNbPixels and minFractionPixels/);
});

test.each([
  {
    translation: { column: -1, row: 0 },
    expected: 3,
  },
  {
    translation: { column: 1, row: 0 },
    expected: 2,
  },
])('use source mask ($translation)', (data) => {
  const source = testUtils.createGreyImage([
    [1, 2, 3, 4],
    [0, 0, 0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ]);
  const mask = testUtils.createMask([
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ]);
  expect(
    getNormalisedDifference(source, destination, data.translation, {
      minNbPixels: 1,
      sourceMask: mask,
    }),
  ).toBe(data.expected);
});

test('small source', () => {
  const source = testUtils.createGreyImage([
    [1, 1],
    [1, 1],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  expect(
    getNormalisedDifference(
      source,
      destination,
      { row: 1, column: 2 },
      {
        minNbPixels: 1,
      },
    ),
  ).toBe(0);

  expect(
    getNormalisedDifference(
      source,
      destination,
      { row: 0, column: 0 },
      {
        minNbPixels: 1,
      },
    ),
  ).toBe(1);

  expect(
    getNormalisedDifference(
      source,
      destination,
      { row: 0, column: 3 },
      {
        minNbPixels: 1,
      },
    ),
  ).toBe(1 / 2);

  expect(
    getNormalisedDifference(
      source,
      destination,
      { row: 0, column: 3 },
      {
        minNbPixels: 1,
      },
    ),
  ).toBe(1 / 2);
});

test('same size', () => {
  const source = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const sourceMask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const translation = { row: -3, column: -3 };

  const result = getNormalisedDifference(source, destination, translation, {
    sourceMask,
  });

  expect(result).toBe(255);
});
