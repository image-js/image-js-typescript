describe('extract', () => {
  it('1x1 image and mask', () => {
    const image = testUtils.createGreyImage([[100]]);
    const mask = testUtils.createMask([[1]]);

    expect(image.extract(mask)).toMatchImage(image);
  });
  it('3x3 grey image and 2x2 mask', () => {
    const image = testUtils.createGreyImage([
      [1, 2, 3],
      [5, 6, 7],
      [9, 10, 11],
    ]);
    const mask = testUtils.createMask([
      [0, 1],
      [1, 1],
    ]);

    expect(image.extract(mask)).toMatchImageData([
      [0, 2],
      [5, 6],
    ]);
  });
  it('3x2 greya image, 2x2 mask, row=1 and column=1', () => {
    const image = testUtils.createGreyaImage([
      [1, 10, 3, 10],
      [5, 10, 7, 10],
      [9, 10, 11, 10],
    ]);
    const mask = testUtils.createMask([
      [0, 1],
      [1, 1],
    ]);

    expect(image.extract(mask, { row: 1, column: 1 })).toMatchImageData([
      [0, 0],
      [11, 10],
    ]);
  });
  it('negative row and column', () => {
    const image = testUtils.createGreyaImage([
      [1, 10, 3, 10],
      [5, 10, 7, 10],
      [9, 10, 11, 10],
    ]);
    const mask = testUtils.createMask([
      [0, 1],
      [1, 1],
    ]);

    expect(image.extract(mask, { row: -1, column: -1 })).toMatchImageData([
      [1, 10],
    ]);
  });
  it('negative row and positive column', () => {
    const image = testUtils.createGreyaImage([
      [1, 10, 3, 10],
      [5, 10, 7, 10],
      [9, 10, 11, 10],
    ]);
    const mask = testUtils.createMask([
      [0, 1],
      [1, 1],
    ]);

    expect(image.extract(mask, { row: -1, column: 1 })).toMatchImageData([
      [3, 10],
    ]);
  });
  it('image and mask have no overlap', () => {
    const image = testUtils.createGreyaImage([
      [1, 10, 3, 10],
      [5, 10, 7, 10],
      [9, 10, 11, 10],
    ]);
    const mask = testUtils.createMask([
      [0, 1],
      [1, 1],
    ]);

    expect(() => {
      image.extract(mask, { row: 4, column: 4 });
    }).toThrow('extract: image and mask have no overlap');
    expect(() => {
      image.extract(mask, { row: -2, column: 4 });
    }).toThrow('extract: image and mask have no overlap');
  });
});
