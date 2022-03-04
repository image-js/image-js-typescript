import { getDirection } from '..';

describe('cannyEdgeDetector', () => {
  it('5x5 grey image', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 50, 50, 50, 0],
      [0, 50, 0, 50, 0],
      [0, 50, 50, 50, 0],
      [0, 0, 0, 0, 0],
    ]);

    const expected = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    let result = image.cannyEdgeDetector({
      lowThreshold: 0.4,
      highThreshold: 0.8,
    });
    console.log({ cannyEdgeResult: result });

    expect(result).toMatchMask(expected);
  });
});

describe('getDirection', () => {
  it('horizontal, integer', () => {
    const x = 1;
    const y = 0;

    expect(getDirection(x, y)).toBe(0);
  });
  it('horizontal, float', () => {
    const x = 1.5;
    const y = 0.1;

    expect(getDirection(x, y)).toBe(0);
  });
  it('upward diagonal', () => {
    const x = 1;
    const y = 1;

    expect(getDirection(x, y)).toBe(1);
  });
  it('vertical, integer', () => {
    const x = 0;
    const y = 1;

    expect(getDirection(x, y)).toBe(2);
  });
  it('vertical, float', () => {
    const x = 0.1;
    const y = 1.2;

    expect(getDirection(x, y)).toBe(2);
  });
  it('downward diagonal', () => {
    const x = -1;
    const y = 1;

    expect(getDirection(x, y)).toBe(3);
  });
});
