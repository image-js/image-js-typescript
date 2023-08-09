import { computeThreshold } from '../..';
import { createGreyImage } from '../../../test/testUtils';
import { waterShed } from '../waterShed';

describe('Test WaterShed Roi generation', () => {
  it('basic test 1, without parameters/options', () => {
    const image = createGreyImage([
      [3, 3, 3, 3, 3],
      [3, 2, 2, 2, 3],
      [3, 2, 1, 2, 3],
      [3, 2, 2, 2, 3],
      [3, 3, 3, 3, 3],
    ]);
    const roiMapManager = waterShed(image, {});
    const resultArray = new Int16Array([
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1,
    ]);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 1,
        width: 5,
        height: 5,
      },
      whiteRois: [],
      blackRois: [],
    });
  });

  it('waterShed for a grey image', () => {
    const image = createGreyImage([
      [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
      [3, 3, 2, 2, 2, 3, 3, 3, 4, 4],
      [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
      [4, 3, 2, 2, 2, 2, 3, 3, 3, 4],
      [4, 4, 4, 3, 2, 3, 2, 3, 3, 4],
      [4, 4, 4, 3, 3, 3, 3, 1, 3, 3],
      [4, 3, 3, 3, 3, 3, 2, 2, 2, 3],
      [4, 4, 3, 3, 3, 3, 2, 2, 2, 2],
      [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
      [4, 4, 4, 4, 3, 3, 3, 3, 2, 3],
    ]);

    const roiMapManager = waterShed(image, { threshold: 2 / 255 });

    const resultArray = new Int16Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, 0, 0, 0, 0, 0, 0, 0, -2,
      -2, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, 0, 0, 0, 0, 0, 0, 0, 0, -2,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1,
      -1, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 0, -1, -1, -1, -1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, -1, 0,
    ]);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 2,
        width: 10,
        height: 10,
      },
      whiteRois: [],
      blackRois: [],
    });
  });

  it('basic test 2, with threshold', () => {
    const image = createGreyImage([
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 2, 3, 2, 1],
      [1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1],
    ]);
    const roiMapManager = waterShed(image, {
      kind: 'maximum',
      threshold: 253 / image.maxValue,
    });
    const resultArray = new Int16Array([
      0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    ]);

    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 1,
        nbNegative: 0,
        width: 5,
        height: 5,
      },
      whiteRois: [],
      blackRois: [],
    });
  });
  it('waterShed through threshold value', () => {
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
    const threshold = computeThreshold(image, 'otsu');

    const roiMapManager = waterShed(image, {
      threshold: threshold / image.maxValue,
    });
    const resultArray = new Int16Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, 0, 0, 0, 0, 0, 0, 0, -2,
      -2, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, 0, 0, 0, 0, 0, 0, 0, 0, -2,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1,
      0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 0, -1, -1, -1, -1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, -1, 0,
    ]);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 2,
        width: 10,
        height: 10,
      },
      whiteRois: [],
      blackRois: [],
    });
  });
  it('waterShed through threshold mask and with inverted image', () => {
    let image = createGreyImage([
      [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
      [3, 3, 2, 2, 2, 3, 3, 8, 4, 4],
      [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
      [4, 3, 2, 2, 6, 2, 3, 3, 3, 4],
      [4, 4, 4, 3, 2, 3, 3, 3, 3, 4],
      [4, 4, 4, 3, 3, 3, 3, 3, 3, 3],
      [4, 3, 3, 3, 3, 6, 2, 2, 2, 3],
      [4, 4, 3, 3, 3, 3, 2, 1, 2, 2],
      [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
      [4, 4, 4, 4, 3, 3, 3, 3, 9, 3],
    ]);

    const mask = image.threshold({ algorithm: 'otsu' });
    const roiMapManager = waterShed(image, { mask });
    const resultArray = new Int16Array([
      -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -2, -2, -2, -2, -2, -2, -2, 0, -1,
      -1, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -2, -2, -2, -2, 0, -2, -2, -1,
      -1, -1, -2, -2, -2, -2, -1, -2, -1, -1, -1, -1, -2, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, 0, -1,
    ]);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 2,
        width: 10,
        height: 10,
      },
      whiteRois: [],
      blackRois: [],
    });
  });
});
