test('empty mask', () => {
  let mask = testUtils.createMask(`0 0 0`);
  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 0,
        angle: 0,
        points: [
          { column: 0, row: 0 },
          { column: 0, row: 0 },
        ],
      },
      maxDiameter: {
        length: 0,
        angle: 0,
        points: [
          { column: 0, row: 0 },
          { column: 0, row: 0 },
        ],
      },
      lines: {
        minDiameter: [
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        ],
        maxDiameter: [
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        ],
      },
      aspectRatio: 1,
    },
    3,
  );
});
test('mask with only 1 pixel', () => {
  let mask = testUtils.createMask(`0 1 0`);
  const result = mask.getFeret();
  // the minimum diameter points are not as expected,
  // but this is a very edge case so it does not matter too much
  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 1,
        angle: 90,
        points: [
          { column: 1, row: 0 },
          { column: 2, row: 1 },
        ],
      },
      maxDiameter: {
        length: 1.414,
        angle: 45,
        points: [
          { column: 1, row: 0 },
          { column: 2, row: 1 },
        ],
      },
      lines: {
        minDiameter: [
          [
            { column: 0.9999999999999999, row: 7.498798913309288e-33 },
            { column: 2, row: -1.2246467991473532e-16 },
          ],
          [
            { column: 2, row: 1 },
            { column: 3, row: 0.9999999999999999 },
          ],
        ],
        maxDiameter: [
          [
            { column: 0.5000000000000002, row: 0.4999999999999999 },
            { column: 1.5, row: -0.5000000000000001 },
          ],
          [
            { column: 1.5000000000000002, row: 1.5 },
            { column: 2.5, row: 0.4999999999999999 },
          ],
        ],
      },
      aspectRatio: 0.707,
    },
    3,
  );
});
test('mask 3x3', () => {
  let mask = testUtils.createMask(`
        0 1 0
        1 1 1
        0 1 0
      `);
  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 2.8284271247461903,
        angle: 45.00000000000001,
        points: [
          { column: 0, row: 2 },
          { column: 3, row: 0.9999999999999998 },
        ],
      },
      maxDiameter: {
        length: 3.1622776601683795,
        angle: 18.434948822922017,
        points: [
          { column: 0, row: 1 },
          { column: 3, row: 2 },
        ],
      },
      lines: {
        minDiameter: [
          [
            { column: -2, row: 4 },
            { column: 1.9999999999999996, row: 0 },
          ],
          [
            { column: 1, row: 3 },
            { column: 5, row: -1.0000000000000002 },
          ],
        ],
        maxDiameter: [
          [
            { column: -0.5000000000000001, row: 2.5 },
            { column: 0.5000000000000003, row: -0.5000000000000002 },
          ],
          [
            { column: 2.5, row: 3.5 },
            { column: 3.5000000000000004, row: 0.4999999999999998 },
          ],
        ],
      },
      aspectRatio: 0.8944,
    },
    2,
  );
});

test('mask 4x4', () => {
  let mask = testUtils.createMask(`
        0 1 1 0
        0 1 1 0
        0 1 1 0
        0 1 1 0
      `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 2,
        angle: 90,
        points: [
          { column: 1, row: 0 },
          { column: 3, row: 0 },
        ],
      },
      maxDiameter: {
        length: 4.4721,
        angle: 63.43,
        points: [
          { column: 1, row: 0 },
          { column: 3, row: 4 },
        ],
      },
      lines: {
        maxDiameter: [
          [
            { column: -0.6000000000000005, row: 0.7999999999999997 },
            { column: 2.6, row: -0.7999999999999996 },
          ],
          [
            { column: 1.3999999999999995, row: 4.8 },
            { column: 4.6, row: 3.2 },
          ],
        ],
        minDiameter: [
          [
            { column: -0.9999999999999998, row: 2.449293598294706e-16 },
            { column: 1, row: 0 },
          ],
          [
            { column: 1.0000000000000002, row: 2.449293598294706e-16 },
            { column: 3, row: 0 },
          ],
        ],
      },
      aspectRatio: 0.4472,
    },
    2,
  );
});

test('mask 5x5', () => {
  let mask = testUtils.createMask(`
        0 0 1 0 0
        0 0 1 0 0
        1 1 1 1 1
        0 0 1 0 0
        0 0 1 0 0
      `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 4.2426,
        angle: -45,
        points: [
          { column: 3, row: 5 },
          { column: 0, row: 2 },
        ],
      },
      maxDiameter: {
        length: 5.099,
        angle: 11.31,
        points: [
          { column: 0, row: 2 },
          { column: 5, row: 3 },
        ],
      },
      lines: {
        minDiameter: [
          [
            { column: 5.5, row: 7.499999999999998 },
            { column: 0, row: 2.0000000000000004 },
          ],
          [
            { column: 2.5, row: 4.499999999999999 },
            { column: -3, row: -0.9999999999999987 },
          ],
        ],
        maxDiameter: [
          [
            { column: -0.4999999999999997, row: 4.500000000000001 },
            { column: 0.4999999999999994, row: -0.4999999999999991 },
          ],
          [
            { column: 4.5, row: 5.500000000000001 },
            { column: 5.499999999999999, row: 0.5000000000000009 },
          ],
        ],
      },
      aspectRatio: 0.832,
    },
    2,
  );
});

test('triangle 5x5', () => {
  let mask = testUtils.createMask(`
      1 0 0 0 0 0
      1 1 1 0 0 0
      1 1 1 1 1 1
      1 1 1 0 0 0
      1 0 0 0 0 0
    `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 5,
        angle: 0,
        points: [
          { column: 0, row: 5 },
          { column: 0, row: 0 },
        ],
      },
      maxDiameter: {
        length: 6.7082,
        angle: 26.565,
        points: [
          { column: 0, row: 0 },
          { column: 6, row: 3 },
        ],
      },
      lines: {
        minDiameter: [
          [
            { column: 1.8369701987210297e-16, row: 8 },
            { column: 0, row: 5 },
          ],
          [
            { column: 1.8369701987210297e-16, row: 3 },
            { column: 0, row: 0 },
          ],
        ],
        maxDiameter: [
          [
            { column: -2, row: 4 },
            { column: 0.40000000000000024, row: -0.8000000000000005 },
          ],
          [
            { column: 4, row: 7 },
            { column: 6.4, row: 2.1999999999999993 },
          ],
        ],
      },
      aspectRatio: 0.7453,
    },
    3,
  );
});

test('square triangle 3x3', () => {
  let mask = testUtils.createMask(`
        1 1 1
        1 0 0
        1 0 0
      `);

  const result = mask.getFeret();
  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        length: 2.8284,
        angle: -45,
        points: [
          { column: 1, row: 3 },
          { column: 0, row: 0 },
        ],
      },
      maxDiameter: {
        length: 4.2426,
        angle: -45,
        points: [
          { column: 0, row: 3 },
          { column: 3, row: 0 },
        ],
      },
      lines: {
        minDiameter: [
          [
            { column: 1.5, row: 3.5 },
            { column: 0.5000000000000003, row: 2.500000000000001 },
          ],
          [
            { column: 0.5000000000000001, row: 0.5 },
            { column: -0.49999999999999944, row: -0.4999999999999993 },
          ],
        ],
        maxDiameter: [
          [
            { column: 0.5, row: 3.5 },
            { column: -1.5000000000000002, row: 1.5 },
          ],
          [
            { column: 3.5, row: 0.4999999999999999 },
            { column: 1.4999999999999998, row: -1.5 },
          ],
        ],
      },
      aspectRatio: 0.6667,
    },
    3,
  );
});
