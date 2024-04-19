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

  expect(transformed).toMatchImage('opencv/testTranslate.png');
});

test('compare result of clockwise rotation with opencv', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [0, -1, img.width + 1],
      [1, 0, 0],
    ],
    { inverse: false, fullImage: false, width: 10, height: 8 },
  );
  // Equivalent python code with opencv
  // M = np.float32([[0, -1, cols+1], [1, 0,0]])
  // dst = cv.warpAffine(img,M,(rows,cols))
  expect(transformed).toMatchImage('opencv/testClockwiseRot90.png');
});

test('get a vertical reflection of an image', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [1, 0, 0],
      [0, -1, img.height - 1],
    ],
    { inverse: false, fullImage: false },
  );
  // Equivalent python code with opencv
  // M = np.float32([[1, 0, 0], [0, -1, rows-1]])
  // dst = cv.warpAffine(img,M,(cols,rows))
  expect(transformed).toMatchImage('opencv/testReflect.png');
});

test('get a scale of an image to 80*100', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [2, 0, 0],
      [0, 2, 0],
    ],
    {
      inverse: false,
      fullImage: false,
      width: 16,
      height: 20,
      interpolationType: 'bilinear',
    },
  );
  // M = np.float32([[10,0,0],[0,10,0]])
  //dst = cv.warpAffine(img,M,dsize=(cols*10, rows*10))
  expect(transformed).toMatchImage('opencv/testScale.png');
});
test('affineTransformation', () => {
  const img = testUtils.load('opencv/test.png');
  const transformed = img.transform(
    [
      [2, 1, 2],
      [-1, 1, 2],
    ],
    { inverse: false, fullImage: false, interpolationType: 'bilinear' },
  );
  // Equivalent python code with opencv
  //M = np.float32([[2,1,2], [-1,1, 2],[0,0,1]])
  //dst = cv.warpPerspective(img,M,(cols,rows))
  expect(transformed).toMatchImage('opencv/testAffineTransform.png');
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
