import { IJS } from '../../IJS';

describe('we check paintRectangle', () => {
  it('paint rectangle in an image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);

    const start = { row: 0, column: 0 };
    const width = 2;
    const height = 2;
    const expected = image.drawRectangle(start, width, height, {
      color: [255, 0, 0],
    });

    expect(expected).toMatchImageData([
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('paint rectangle with out parameter set to self', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0, 150, 200, 255],
      [100, 200, 5, 3, 200, 0, 150, 200, 255],
      [150, 200, 255, 6, 150, 0, 5, 3, 200],
    ]);

    const start = { row: 0, column: 0 };
    const width = 3;
    const height = 3;
    const expected = image.drawRectangle(start, width, height, {
      color: [255, 0, 0],
      fill: [0, 0, 0],
      out: image,
    });
    expect(expected).toMatchImageData([
      [255, 0, 0, 255, 0, 0, 255, 0, 0],
      [255, 0, 0, 0, 0, 0, 255, 0, 0],
      [255, 0, 0, 255, 0, 0, 255, 0, 0],
    ]);
    expect(expected).toBe(image);
  });
  it('paint rectangle with out parameter', () => {
    const out = new IJS(2, 3);
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const start = { row: 1, column: 0 };
    const width = 3;
    const height = 3;
    const expected = image.drawRectangle(start, width, height, {
      color: [255, 0, 0],
      fill: [0, 0, 0],
      out,
    });

    expect(expected).toMatchImageData([
      [100, 150, 200, 100, 150, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 0, 0, 0],
    ]);
    expect(expected).toBe(out);
    expect(expected).not.toBe(image);
  });
});
