import { IJS } from '../../IJS';

describe('we check drawPolygon', () => {
  it('drawPolygon in an image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
    ];
    const expected = image.paintPolygon(points, { color: [255, 0, 0] });
    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [100, 200, 5, 255, 0, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('drawPolygon with out parameter set to self', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 0 },
    ];
    const expected = image.paintPolygon(points, {
      color: [255, 0, 0],
      out: image,
    });

    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 6, 150, 0],
    ]);
    expect(expected).toBe(image);
  });
  it('drawPolygon with out parameter', () => {
    const out = new IJS(2, 3);
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 0],
      [100, 200, 5, 3, 200, 0],
      [150, 200, 255, 6, 150, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 0 },
    ];
    const expected = image.paintPolygon(points, {
      color: [255, 0, 0],
      out,
    });

    expect(expected).toMatchImageData([
      [255, 0, 0, 100, 150, 0],
      [255, 0, 0, 255, 0, 0],
      [255, 0, 0, 6, 150, 0],
    ]);
    expect(expected).toBe(out);
    expect(expected).not.toBe(image);
  });
});
