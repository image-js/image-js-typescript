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
    const matrix = getPerspectiveWarp(points);
    const result = image.transform(matrix, { inverse: true });
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
    const matrix = getPerspectiveWarp(points);
    const result = image.transform(matrix, { inverse: true });
    expect(result.width).not.toBeLessThan(3);
    expect(result.height).not.toBeLessThan(1);
    expect(result.width).not.toBeGreaterThan(4);
    expect(result.height).not.toBeGreaterThan(4);
  });
});

describe('openCV comparison', () => {
  test('nearest interpolation plants', () => {
    const image = testUtils.load('various/plants.png');
    const openCvResult = testUtils.load(
      'opencv/test_perspective_warp_plants_nearest.png',
    );

    const points = [
      { column: 858.5, row: 9 },
      { column: 911.5, row: 786 },
      { column: 154.5, row: 611 },
      { column: 166.5, row: 195 },
    ];
    const matrix = getPerspectiveWarp(points, {
      width: 1080,
      height: 810,
    });
    const result = image.transform(matrix, {
      inverse: true,
      interpolationType: 'nearest',
    });
    const croppedPieceOpenCv = openCvResult.crop({
      origin: { column: 45, row: 0 },
      width: 100,
      height: 100,
    });

    const croppedPiece = result.crop({
      origin: { column: 45, row: 0 },
      width: 100,
      height: 100,
    });

    expect(result.width).toEqual(openCvResult.width);
    expect(result.height).toEqual(openCvResult.height);
    expect(croppedPiece).toEqual(croppedPieceOpenCv);
  });

  test('nearest interpolation card', () => {
    const image = testUtils.load('various/card.png');
    const openCvResult = testUtils.load(
      'opencv/test_perspective_warp_card_nearest.png',
    );
    const points = [
      { column: 145, row: 460 },
      { column: 55, row: 140 },
      { column: 680, row: 38 },
      { column: 840, row: 340 },
    ];
    const matrix = getPerspectiveWarp(points, {
      width: 700,
      height: 400,
    });
    const result = image.transform(matrix, {
      inverse: true,
      interpolationType: 'nearest',
      width: 700,
      height: 400,
    });
    const croppedPieceOpenCv = openCvResult.crop({
      origin: { column: 45, row: 0 },
      width: 5,
      height: 5,
    });

    const croppedPiece = result.crop({
      origin: { column: 45, row: 0 },
      width: 5,
      height: 5,
    });

    expect(result.width).toEqual(openCvResult.width);
    expect(result.height).toEqual(openCvResult.height);
    expect(croppedPiece).toEqual(croppedPieceOpenCv);
  });
  test('nearest interpolation plants', () => {
    const image = testUtils.load('various/plants.png');
    const openCvResult = testUtils.load(
      'opencv/test_perspective_warp_plants_linear.png',
    );

    const points = [
      { column: 858.5, row: 9 },
      { column: 166.5, row: 195 },
      { column: 154.5, row: 611 },
      { column: 911.5, row: 786 },
    ];
    const matrix = getPerspectiveWarp(points, {
      width: 1080,
      height: 810,
    });
    const result = image.transform(matrix, {
      inverse: true,
      interpolationType: 'nearest',
    });

    expect(result.width).toEqual(openCvResult.width);
    expect(result.height).toEqual(openCvResult.height);
  });
});

describe('error testing', () => {
  test("should throw if there aren't 4 points", () => {
    expect(() => {
      getPerspectiveWarp([{ column: 1, row: 1 }]);
    }).toThrow(
      'The array pts must have four elements, which are the four corners. Currently, pts have 1 elements',
    );
  });
});
