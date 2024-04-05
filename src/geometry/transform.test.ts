test('compare result of translation with opencv', () => {
  const img = testUtils.load('opencv/test.png');
  const translation = [
    [1, 0, 2],
    [0, 1, 4],
  ];
  // Equivalent python code opencv
  //M = np.float32([[1, 0, 2], [0, 1, 4]])
  //dst = cv.warpAffine(img, M, (16, 20))
  const transformed = img.transform(translation, {
    width: 16,
    height: 20,
  });

  expect(transformed).toMatchImage('opencv/testTranslation.png');
});

test('compare result of rotation with opencv', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [0, -1, img.getCoordinates('center').row],
      [
        1,
        0,
        -img.getCoordinates('center').column + img.getCoordinates('center').row,
      ],
    ],
    { inverse: false, fullImage: true },
  );
  // Equivalent python code with opencv
  // M = cv.getRotationMatrix2D(((cols-1)/2.0,(rows-1)/2.0),90,1)
  // dst = cv.warpAffine(img,M,(cols,rows))
  expect(transformed).toMatchImage('opencv/testRotated90.png');
});
test('get a vertical reflection of an image', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [1, 0, 0],
      [0, -1, 0],
    ],
    { inverse: false, fullImage: true },
  );
  // Equivalent python code with opencv
  // M = np.float32([[1, 0, 0], [0, -1, rows],[0,  0, 1]])
  // dst = cv.warpPerspective(img,M,(cols,rows))
  expect(transformed).toMatchImage('opencv/testReflection.png');
});
test('get a scale of an image to 80*100', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [10, 0, 0],
      [0, 10, 0],
    ],
    { inverse: false, fullImage: false },
  );
  // Equivalent python code with opencv
  //dst = cv.resize(img, (80,100), interpolation=cv.INTER_CUBIC)
  expect(transformed).toMatchImage('opencv/testScale.png');
});
test('affineTransformation', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [1 / 3, -1 / 3, 0],
      [1 / 3, 2 / 3, -2],
    ],
    { fullImage: false, inverse: true },
  );
  // Equivalent python code with opencv
  //M = np.float32([[2,1,2], [-1,1, 2],[0,0,1]])
  //dst = cv.warpPerspective(img,M,(cols,rows))
  expect(transformed).toMatchImage('opencv/testAffine.png');
});

test('should throw if matrix has wrong size', () => {
  const img = testUtils.load('opencv/test.png');
  const translation = [
    [1, 0, 2, 3],
    [0, 1, 10, 4],
  ];
  expect(() => {
    img.transform(translation);
  }).toThrow('transformation matrix must be 2x3. Received 2x4');
});
