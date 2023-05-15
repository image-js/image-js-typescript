import { pixelate } from '../pixelate';

describe('pixelization of images', () => {
  it('pixelate a simple grey image', () => {
    let img = testUtils.createGreyImage([
      [1, 1, 2],
      [2, 3, 4],
      [6, 7, 8],
    ]);

    let result = img.pixelate({ cellSize: 2 });
    expect(result).toMatchImageData([
      [1, 1, 2],
      [1, 1, 2],
      [6, 6, 8],
    ]);
  });
  it('pixelate a bigger grey image', () => {
    let img = testUtils.createGreyImage([
      [1, 1, 2, 2, 2],
      [2, 3, 4, 2, 1],
      [6, 7, 8, 3, 4],
      [2, 9, 4, 0, 0],
      [1, 9, 9, 9, 9],
    ]);

    let result = pixelate(img, { cellSize: 3 });

    expect(result).toMatchImageData([
      [3, 3, 3, 2, 2],
      [3, 3, 3, 2, 2],
      [3, 3, 3, 2, 2],
      [9, 9, 9, 0, 0],
      [9, 9, 9, 0, 0],
    ]);
  });
  it('pixelate an RGBA image', () => {
    let img = testUtils.createRgbaImage([
      [1, 1, 2, 2],
      [2, 3, 4, 2],
      [6, 7, 8, 3],
      [2, 9, 4, 0],
      [1, 9, 9, 9],
    ]);

    let result = pixelate(img, { cellSize: 3 });

    expect(result).toMatchImageData([
      [2, 3, 4, 2],
      [2, 3, 4, 2],
      [2, 3, 4, 2],
      [2, 9, 4, 0],
      [2, 9, 4, 0],
    ]);
  });
  it('pixelate an RGBA image', () => {
    let img = testUtils.createRgbaImage([
      [1, 1, 2, 2],
      [2, 3, 4, 2],
      [6, 7, 8, 3],
      [2, 9, 4, 0],
      [1, 9, 9, 9],
    ]);

    let result = pixelate(img, { cellSize: 3 });

    expect(result).toMatchImageData([
      [2, 3, 4, 2],
      [2, 3, 4, 2],
      [2, 3, 4, 2],
      [2, 9, 4, 0],
      [2, 9, 4, 0],
    ]);
  });
  it('pixelate an RGBA image', () => {
    let img = testUtils.createRgbaImage([
      [1, 1, 2, 2],
      [2, 3, 4, 2],
      [6, 7, 8, 3],
      [2, 9, 4, 0],
      [1, 9, 9, 9],
    ]);

    let result = pixelate(img, { cellSize: 3 });

    expect(result).toMatchImageData([
      [2, 3, 4, 2],
      [2, 3, 4, 2],
      [2, 3, 4, 2],
      [2, 9, 4, 0],
      [2, 9, 4, 0],
    ]);
  });
  it('throws an error', () => {
    let img = testUtils.createRgbaImage([
      [1, 1, 2, 2],
      [2, 3, 4, 2],
      [6, 7, 8, 3],
      [2, 9, 4, 0],
      [1, 9, 9, 9],
    ]);
    expect(() => {
      img.pixelate({ cellSize: 1 });
    }).toThrow(
      new Error('invalid option value. cellSize should be bigger than 2'),
    );
  });
});
