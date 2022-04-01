import { IJS } from '../../IJS';

describe('crop', () => {
  it('GREY image, default options', () => {
    const image = testUtils.createGreyImage([
      [0, 1, 2],
      [1, 1, 1],
      [1, 2, 2],
    ]);

    let result = image.crop();
    expect(result).toMatchImage(image);
  });

  it('GREY image, various origins and sizes', () => {
    const image = testUtils.createGreyImage([
      [0, 1, 2, 3, 4],
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 0],
      [1, 2, 4, 3, 0],
      [1, 2, 3, 3, 0],
    ]);
    let result = image.crop({
      row: 2,
      column: 2,
    });
    expect(result).toMatchImageData([
      [2, 2, 0],
      [4, 3, 0],
      [3, 3, 0],
    ]);

    result = image.crop({
      row: 0,
      column: 0,
      height: 2,
      width: 2,
    });
    expect(result).toMatchImageData([
      [0, 1],
      [1, 1],
    ]);

    result = image.crop({
      row: 2,
      column: 2,
      height: 2,
      width: 2,
    });
    expect(result).toMatchImageData([
      [2, 2],
      [4, 3],
    ]);

    result = image.crop({
      row: 1,
      column: 3,
      height: 1,
    });
    expect(result).toMatchImageData([[1, 1]]);
  });

  it('invalid argument ranges', () => {
    const image = new IJS(5, 5);

    expect(() => {
      image.crop({
        column: -10,
        row: 2,
        height: 2,
        width: 2,
      });
    }).toThrow(/row and column .* must be positive numbers/);

    expect(() => {
      image.crop({
        column: 2,
        row: 2,
        height: -2,
        width: 2,
      });
    }).toThrow(/width and height .* must be positive numbers/);

    expect(() => {
      image.crop({
        column: 100,
        row: 2,
        height: 2,
        width: 2,
      });
    }).toThrow(/origin .* out of range/);

    expect(() => {
      image.crop({
        column: 2,
        row: 2,
        height: 2,
        width: 100,
      });
    }).toThrow(/size is out of range/);
  });
});
