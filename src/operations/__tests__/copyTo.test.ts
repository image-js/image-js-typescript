describe('Copy a source image to a target', () => {
  it('GREYA images: transparent source, opaque target', () => {
    let source = testUtils.createGreyaImage([[100, 0]]);
    let target = testUtils.createGreyaImage([[50, 255]]);
    const result = source.copyTo(target);
    expect(result).toMatchImageData([[50, 255]]);
  });
  it('GREYA images: opaque source, transparent target', () => {
    let source = testUtils.createGreyaImage([[100, 255]]);
    let target = testUtils.createGreyaImage([[50, 0]]);
    const result = source.copyTo(target);
    expect(result).toMatchImageData([[100, 255]]);
  });
  it('GREY image', () => {
    let source = testUtils.createGreyImage([[100, 150, 200, 250]]);
    let target = testUtils.createGreyImage([[20, 50]]);
    const result = source.copyTo(target);
    expect(result).toMatchImageData([[100, 150]]);
  });
  it('GREY image with offset', () => {
    let target = testUtils.createGreyImage([
      [100, 150],
      [200, 250],
    ]);
    let source = testUtils.createGreyImage([[20]]);
    const result = source.copyTo(target, { rowOffset: 1, columnOffset: 1 });
    expect(result).toMatchImageData([
      [100, 150],
      [200, 20],
    ]);
  });
  it('source image larger than target (should crop)', () => {
    let source = testUtils.createGreyImage([
      [100, 150],
      [200, 250],
    ]);
    let target = testUtils.createGreyImage([[20]]);
    const result = source.copyTo(target);
    expect(result).toMatchImageData([[100]]);
  });
  it('negative offset', () => {
    let source = testUtils.createGreyImage([
      [100, 150],
      [200, 250],
      [100, 100],
    ]);
    let target = testUtils.createGreyImage([[20]]);
    const result = source.copyTo(target, { rowOffset: -1, columnOffset: -1 });
    expect(result).toMatchImageData([[250]]);
  });
  it('testing out option', () => {
    let source = testUtils.createGreyaImage([[100, 255]]);
    let target = testUtils.createGreyaImage([[50, 0]]);
    const result = source.copyTo(target, { out: target });

    expect(target).toStrictEqual(result);
  });
  it('incompatible image types', () => {
    let source = testUtils.createGreyImage([[100, 255]]);
    let target = testUtils.createGreyaImage([[50, 0]]);

    expect(() => source.copyTo(target)).toThrow(
      /Source and target should have the same color model./,
    );
  });
});
