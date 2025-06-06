import { Image } from '../../Image.js';
import getPerspectiveWarp from '../getPerspectiveWarp.js';

describe('warping tests', () => {
  it('resize without rotation', () => {
    const image = new Image(3, 3, {
      data: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      colorModel: 'GREY',
    });
    const points = [
      { column: 0, row: 0 },
      { column: 2, row: 0 },
      { column: 1, row: 2 },
      { column: 0, row: 2 },
    ];
    const result = getPerspectiveWarp(image, points);
    expect(result.width).not.toBeLessThan(2);
    expect(result.height).not.toBeLessThan(2);
    expect(result.width).not.toBeGreaterThan(3);
    expect(result.height).not.toBeGreaterThan(3);
  });
  it('resize without rotation 2', () => {
    const image = new Image(4, 4, {
      data: new Uint8Array([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]),
      colorModel: 'GREY',
    });

    const points = [
      { column: 0, row: 0 },
      { column: 3, row: 0 },
      { column: 2, row: 1 },
      { column: 0, row: 1 },
    ];
    const result = getPerspectiveWarp(image, points);
    expect(result.width).not.toBeLessThan(3);
    expect(result.height).not.toBeLessThan(1);
    expect(result.width).not.toBeGreaterThan(4);
    expect(result.height).not.toBeGreaterThan(2);
  });

  test('openCV comparison', () => {
    const image = testUtils.load('various/plants.png');

    const openCvResult = testUtils.load(
      'opencv/test_perspective_warp_plants.png',
    );

    const points = [
      { column: 166.5, row: 195 },
      { column: 858.5, row: 9 },
      { column: 911.5, row: 786 },
      { column: 154.5, row: 611 },
    ];
    const result = getPerspectiveWarp(image, points, {
      width: 1080,
      height: 810,
    });
    const croppedPieceOpenCv = openCvResult.crop({
      origin: { column: 45, row: 0 },
      width: 400,
      height: 400,
    });

    const croppedPiece = result.crop({
      origin: { column: 45, row: 0 },
      width: 400,
      height: 400,
    });

    expect(result.width).toEqual(openCvResult.width);
    expect(result.height).toEqual(openCvResult.height);
    expect(croppedPiece).toEqual(croppedPieceOpenCv);
  });
});
