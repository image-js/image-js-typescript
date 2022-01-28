describe('hypotenuse', () => {
  it('testing with pythagorean triples', async () => {
    const image = testUtils.createGreyImage([[3, 5, 8, 7]]);
    const otherImage = testUtils.createGreyImage([[4, 12, 15, 24]]);

    const expected = testUtils.createGreyImage([[5, 13, 17, 25]]);
    expect(image.hypotenuse(otherImage)).toMatchImage(expected);
  });
  it('test different size error', async () => {
    const image = testUtils.createGreyImage([[3, 8, 7]]);
    const otherImage = testUtils.createGreyImage([[4, 12, 15, 24]]);

    expect(() => {
      image.hypotenuse(otherImage);
    }).toThrow('hypotenuse: both images must have the same size');
  });
  it('test different depth or alpha error', async () => {
    const image = testUtils.createRgbaImage([[3, 5, 8, 7]]);
    const otherImage = testUtils.createGreyImage([[4]]);

    expect(() => {
      image.hypotenuse(otherImage);
    }).toThrow('hypotenuse: both images must have the same alpha and bitDepth');
  });
  it('test different number of channels', async () => {
    const image = testUtils.createRgbaImage([[3, 5, 8, 7]]);
    const otherImage = testUtils.createGreyaImage([[4, 20]]);

    expect(() => {
      image.hypotenuse(otherImage);
    }).toThrow('hypotenuse: both images must have the same number of channels');
  });
});
