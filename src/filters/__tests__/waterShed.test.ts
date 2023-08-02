import { createGreyImage } from '../../../test/testUtils';
import { waterShed } from '../waterShed';

describe('Test WaterShed Roi generation', () => {
  it('basic', () => {
    const image = createGreyImage([
      [3, 3, 3, 3, 3],
      [3, 2, 2, 2, 3],
      [3, 2, 1, 2, 3],
      [3, 2, 2, 2, 3],
      [3, 3, 3, 3, 3],
    ]);
    const result = waterShed(image, { channel: 0 });

    expect(result).toEqual(new Int16Array(25).fill(1));
  });

  it('waterShed for a grey image', () => {
    const image = createGreyImage([
      [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
      [3, 3, 2, 2, 2, 3, 3, 3, 4, 4],
      [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
      [4, 3, 2, 2, 2, 2, 3, 3, 3, 4],
      [4, 4, 4, 3, 2, 3, 3, 3, 3, 4],
      [4, 4, 4, 3, 3, 3, 3, 3, 3, 3],
      [4, 3, 3, 3, 3, 3, 2, 2, 2, 3],
      [4, 4, 3, 3, 3, 3, 2, 1, 2, 2],
      [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
      [4, 4, 4, 4, 3, 3, 3, 3, 2, 3],
    ]);

    const result = waterShed(image, { channel: 0, fillMaxValue: 2 });

    expect(result).toStrictEqual(
      new Int16Array([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2,
        2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0,
      ]),
    );
  });

  it('waterShed for grey image with threshold computation', () => {
    const image = createGreyImage([
      [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
      [3, 3, 2, 2, 2, 3, 3, 3, 4, 4],
      [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
      [4, 3, 2, 2, 2, 2, 3, 3, 3, 4],
      [4, 4, 4, 3, 2, 3, 3, 3, 3, 4],
      [4, 4, 4, 3, 3, 3, 3, 3, 3, 3],
      [4, 3, 3, 3, 3, 3, 2, 2, 2, 3],
      [4, 4, 3, 3, 3, 3, 2, 1, 2, 2],
      [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
      [4, 4, 4, 4, 3, 3, 3, 3, 2, 3],
    ]);
    const mask = testUtils.createMask([
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    ]);
    const result = waterShed(image, {
      thresholdAlgorithm: 'otsu',
      mask,
    });

    expect(result).toStrictEqual(
      new Int16Array([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0,
        0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 1, 0, 0,
      ]),
    );
  });

  it('basic', () => {
    const image = createGreyImage([
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 2, 3, 2, 1],
      [1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1],
    ]);
    const result = waterShed(image, {
      kind: 'maximum',
      channel: 0,
      fillMaxValue: 2,
    });
    expect(result).toEqual(
      new Int16Array([
        0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
        0,
      ]),
    );
  });
});
