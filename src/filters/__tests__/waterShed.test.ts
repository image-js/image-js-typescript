import { RoiMapManager, computeThreshold } from '../..';
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
        width: 5,
        height: 5,
        data: resultArray,
        nbNegative: 1,
        nbPositive: 0,
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
      [4, 4, 4, 3, 2, 3, 3, 3, 3, 4],
      [4, 4, 4, 3, 3, 3, 3, 3, 3, 3],
      [4, 3, 3, 3, 3, 3, 2, 2, 2, 3],
      [4, 4, 3, 3, 3, 3, 2, 1, 2, 2],
      [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
      [4, 4, 4, 4, 3, 3, 3, 3, 2, 3],
    ]);

    const roiMapManager = waterShed(image, { threshold: 2 / 255 });

    const resultArray = new Int16Array([
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
      -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -2, -2, -2,
      1, 1, 1, 1, 1, 1, 1, -2, -2, -2, -2, 1, 1, 1, 1, 1, -2, -2, -2, -2, 2, 1,
      1, 1, 1, 1, 1, 1, 1, -2, 2,
    ]);

    expect(roiMapManager).toEqual({
      map: {
        width: 10,
        height: 10,
        data: resultArray,
        nbNegative: 2,
        nbPositive: 2,
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
      -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1,
      -1, -1, -1, -1,
    ]);

    expect(roiMapManager).toEqual({
      map: {
        width: 5,
        height: 5,
        data: resultArray,
        nbNegative: 1,
        nbPositive: 1,
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
    printResultMask(roiMapManager);
    const resultArray = new Int16Array([
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
      -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -2, -2, -2,
      1, 1, 1, 1, 1, 1, 1, -2, -2, -2, -2, 1, 1, 1, 1, 1, -2, -2, -2, -2, 2, 1,
      1, 1, 1, 1, 1, 1, 1, -2, 2,
    ]);
    expect(roiMapManager).toEqual({
      map: {
        width: 10,
        height: 10,
        data: resultArray,
        nbNegative: 2,
        nbPositive: 2,
      },
      whiteRois: [],
      blackRois: [],
    });
  });

  it('waterShed through threshold mask and with inverted image', () => {
    let image = createGreyImage([
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
    image = image.invert();
    const mask = image.threshold({ algorithm: 'otsu' });
    const roiMapManager = waterShed(image, { mask, kind: 'maximum' });
    const resultArray = new Int16Array([
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1,
      -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1,
      -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, 2, 2, 2, -1, -1, -1, -1, -1, -1, -1, 2, 2,
      2, 2, -1, -1, -1, -1, -1, 2, 2, 2, 2, -2, -1, -1, -1, -1, -1, -1, -1, -1,
      2, -2,
    ]);
    expect(roiMapManager).toEqual({
      map: {
        width: 10,
        height: 10,
        data: resultArray,
        nbNegative: 2,
        nbPositive: 2,
      },
      whiteRois: [],
      blackRois: [],
    });
  });
});
//helper function to print output
function printResultMask(resultRoiMap: RoiMapManager) {
  let string = '';
  const mapData = resultRoiMap.getMap().data;
  const width = resultRoiMap.getMap().width;
  const height = resultRoiMap.getMap().height;
  const maximumLength = Math.min(...mapData).toString().length;
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const currentIndex = column + row * width;
      if (mapData[currentIndex] >= 0) {
        string += ' '.repeat(maximumLength - 1);
        string += mapData[currentIndex];
      } else {
        string += ' '.repeat(maximumLength - 2);
        string += mapData[currentIndex];
      }
      string += ' ';
    }
    string += '\n';
  }
  return string;
}
