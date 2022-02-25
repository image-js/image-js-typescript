describe('cannyEdgeDetector', () => {
  it('5x5 grey image', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 50, 0, 0],
      [0, 0, 0, 50, 50, 50, 0],
      [0, 0, 0, 50, 50, 50, 0],
      [0, 0, 0, 50, 50, 50, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]);

    const expected = testUtils.createMask([
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]);

    let result = image.cannyEdgeDetector();
    console.log(result);

    expect(result).toMatchMask(expected);
  });

  it('image size error', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 50, 0, 0],
      [0, 50, 50, 50, 0],
      [0, 50, 50, 50, 0],
      [0, 50, 50, 50, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(() => {
      image.cannyEdgeDetector();
    }).toThrow('cannyEdge: image is too small to be processed');
  });
});
