import { IJS } from '../../IJS';

describe('Grey transform', () => {
  it('RGBA image', () => {
    let image = testUtils.createRgbaImage([
      [100, 150, 200, 255],
      [100, 150, 200, 0],
    ]);

    expect(
      image.grey({
        algorithm: (red: number, green: number, blue: number) =>
          Math.min(red, green, blue),
      }),
    ).toMatchImageData([[100, 0]]);

    expect(image.grey()).toMatchImageData([[142, 0]]);
    expect(image.grey({ algorithm: 'min' })).toMatchImageData([[100, 0]]);
    expect(image.grey({ algorithm: 'max' })).toMatchImageData([[200, 0]]);
    expect(image.grey({ algorithm: 'lightness' })).toMatchImageData([[200, 0]]);
    expect(image.grey({ algorithm: 'red' })).toMatchImageData([[100, 0]]);
    expect(image.grey({ algorithm: 'green' })).toMatchImageData([[150, 0]]);
    expect(image.grey({ algorithm: 'blue' })).toMatchImageData([[200, 0]]);
    expect(image.grey({ algorithm: 'magenta' })).toMatchImageData([[63, 0]]);
    expect(image.grey({ algorithm: 'cyan' })).toMatchImageData([[127, 0]]);
    expect(image.grey({ algorithm: 'yellow' })).toMatchImageData([[0, 0]]);
    expect(image.grey({ algorithm: 'black' })).toMatchImageData([[55, 0]]);
    expect(image.grey({ algorithm: 'hue' })).toMatchImageData([[148, 0]]);
    expect(image.grey({ algorithm: 'saturation' })).toMatchImageData([
      [128, 0],
    ]);
    expect(image.grey({ algorithm: 'lightness' })).toMatchImageData([[150, 0]]);

    expect(image.grey({ keepAlpha: true })).toMatchImageData([
      [142, 255, 142, 0],
    ]);

    expect(image.grey({ mergeAlpha: true })).toMatchImageData([[142, 0]]);

    expect(
      image.grey({ algorithm: 'average', keepAlpha: true }),
    ).toMatchImageData([[150, 255, 150, 0]]);

    expect(image.grey({ algorithm: 'max', keepAlpha: true })).toMatchImageData([
      [200, 255, 200, 0],
    ]);

    expect(
      image.grey({ algorithm: 'minmax', keepAlpha: true }),
    ).toMatchImageData([[150, 255, 150, 0]]);

    expect(
      image.grey({ algorithm: 'luma601', keepAlpha: true }),
    ).toMatchImageData([[140, 255, 140, 0]]);

    expect(
      image.grey({ algorithm: 'luma709', keepAlpha: true }),
    ).toMatchImageData([[142, 255, 142, 0]]);
  });

  it('GREYA image', () => {
    let image = testUtils.createGreyaImage([[100, 255, 150, 0]]);
    expect(image.grey()).toMatchImageData([[100, 0]]);
    expect(image.grey({ mergeAlpha: false })).toMatchImageData([[100, 150]]);

    expect(image.grey({ keepAlpha: true })).toMatchImageData([
      [100, 255, 150, 0],
    ]);
  });

  it('user-provided output', () => {
    const image = testUtils.createRgbaImage([
      [100, 150, 200, 255, 100, 150, 200, 0],
    ]);

    const out = new IJS(2, 1, { colorModel: 'GREY' });
    const result = image.grey({ out });
    expect(result).toBe(out);
    expect(out).toMatchImageData([[142, 0]]);

    const wrongOut = new IJS(2, 1, { colorModel: 'GREYA' });
    expect(() => image.grey({ out: wrongOut })).toThrow(
      /cannot use out\. Its alpha must be "0" \(found "1"\)/,
    );
  });
});
