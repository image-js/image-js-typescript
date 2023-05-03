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
  //   // the minimum diameter points are not as expected,
  //   // but this is a very edge case so it does not matter too much
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
            { column: 1, row: 0 },
            { column: 2, row: 0 },
          ],
          [
            { column: 1, row: 1 },
            { column: 2, row: 1 },
          ],
        ],
        maxDiameter: [
          [
            { column: 1.5000000000000002, row: -0.5 },
            { column: 0.5, row: 0.4999999999999998 },
          ],
          [
            { column: 1.4999999999999998, row: 1.5 },
            { column: 2.5, row: 0.5 },
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
            { column: 0, row: 0 },
            { column: 0, row: 3 },
          ],
          [
            { column: 3, row: 0 },
            { column: 3, row: 3 },
          ],
        ],
        maxDiameter: [
          [
            { column: 0.5000000000000002, row: -0.5000000000000002 },
            { column: -0.5000000000000001, row: 2.5 },
          ],
          [
            { column: 2.4999999999999996, row: 3.5 },
            { column: 3.4999999999999996, row: 0.5 },
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
            { column: 2.5999999999999996, row: -0.7999999999999999 },
            { column: -0.6000000000000003, row: 0.8000000000000003 },
          ],
          [
            { column: 1.4000000000000001, row: 4.8 },
            { column: 4.6000000000000005, row: 3.1999999999999993 },
          ],
        ],
        minDiameter: [
          [
            { column: 1, row: 0 },
            { column: 1, row: 4 },
          ],
          [
            { column: 3, row: 0 },
            { column: 3, row: 4 },
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
            { column: 2.5, row: 5.5 },
            { column: 5.5, row: 2.499999999999999 },
          ],
          [
            { column: -0.5000000000000002, row: 2.5000000000000004 },
            { column: 2.4999999999999996, row: -0.5 },
          ],
        ],
        maxDiameter: [
          [
            { column: 0.49999999999999906, row: -0.4999999999999991 },
            { column: -0.4999999999999994, row: 4.500000000000001 },
          ],
          [
            { column: 4.500000000000001, row: 5.5 },
            { column: 5.499999999999999, row: 0.5 },
          ],
        ],
      },
      aspectRatio: 0.832,
    },
    2,
  );
});

test('another triangle 5x5', () => {
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
            { column: 0, row: 5 },
            { column: 6, row: 5 },
          ],
          [
            { column: 0, row: 0 },
            { column: 6, row: 0 },
          ],
        ],
        maxDiameter: [
          [
            { column: 0.4, row: -0.8 },
            { column: -2, row: 4 },
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
            { column: 0, row: 3 },
            { column: 3, row: 3 },
          ],
          [
            { column: 0, row: 0 },
            { column: 3, row: 0 },
          ],
        ],
        maxDiameter: [
          [
            { column: -1.5, row: 1.4999999999999996 },
            { column: 0.5, row: 3.5 },
          ],
          [
            { column: 3.5000000000000004, row: 0.5000000000000004 },
            { column: 1.5000000000000004, row: -1.5 },
          ],
        ],
      },
      aspectRatio: 0.6667,
    },
    3,
  );
});

test('triangle 5x5', () => {
  let mask = testUtils.createMask(`
      1 1 1 0 0 0 0 0 0
      1 1 1 1 0 0 0 1 0
      1 1 1 1 1 1 1 1 1
      1 1 1 1 1 1 1 1 1
      0 0 0 1 0 1 0 1 0
    `);

  const result = mask.getFeret();

  expect(result).toBeDeepCloseTo(
    {
      minDiameter: {
        points: [
          { column: 8, row: 1 },
          { column: 3, row: 5 },
        ],
        length: 4.9029033784546,
        angle: -168.6900675259798,
      },
      maxDiameter: {
        length: 9.848857801796104,
        angle: 23.962488974578164,
        points: [
          { column: 0, row: 0 },
          { column: 9, row: 4 },
        ],
      },
      lines: {
        minDiameter: [
          [
            { column: 10, row: 3 },
            { column: 3.5, row: -3.5 },
          ],
          [
            { column: 5.5, row: 7.5 },
            { column: -1, row: 1 },
          ],
        ],
        maxDiameter: [
          [
            { column: 0.9484536082474211, row: -2.1340206185566992 },
            { column: -1.484536082474226, row: 3.340206185567011 },
          ],
          [
            { column: 7.515463917525774, row: 7.340206185567009 },
            { column: 9.948453608247421, row: 1.8659793814432994 },
          ],
        ],
      },
      aspectRatio: 0.49781441433345436,
    },
    3,
  );
});
