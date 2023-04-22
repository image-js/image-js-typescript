import { fromMask } from '..';

test('ellipse on a small figure 3x3', () => {
  const mask = testUtils.createMask([
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  const result = rois[0].ellipse;
  expect(result).toBeDeepCloseTo({
    center: { column: 0.6666666666666666, row: 0.3333333333333333 },
    majorAxis: {
      points: [
        { column: 1.4978340587735344, row: 1.1645007254402011 },
        { column: -0.1645007254402011, row: -0.4978340587735344 },
      ],
      length: 2.3508963970396173,
      angle: -2.356194490192345,
    },
    minorAxis: {
      points: [
        { column: 1.146541384241206, row: -0.14654138424120605 },
        { column: 1.146541384241206, row: -0.14654138424120605 },
      ],
      length: 1.6247924149339357,
      angle: 2.356194490192345,
    },
    surface: 3,
  });
});

test('ellipse on 3x3 cross', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  const result = rois[0].ellipse;
  expect(result).toBeDeepCloseTo({
    center: { column: 1, row: 1 },
    majorAxis: {
      points: [
        { column: 1, row: 2.7841241161527712 },
        { column: 1, row: -0.7841241161527714 },
      ],
      length: 3.5682482323055424,
      angle: -1.5707963267948966,
    },
    minorAxis: {
      points: [
        { column: 2.7841241161527712, row: 1 },
        { column: 2.7841241161527712, row: 1 },
      ],
      length: 1.7841241161527712,
      angle: 3.141592653589793,
    },
    surface: 5,
  });
});
test('ellipse on slightly changed 3x3 cross', () => {
  const mask = testUtils.createMask([
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  const result = rois[0].ellipse;
  expect(result).toBeDeepCloseTo({
    center: { column: 0.8333333333333334, row: 0.8333333333333334 },
    majorAxis: {
      points: [
        { column: 2.175183801009782, row: 2.175183801009782 },
        { column: -0.5085171343431153, row: -0.5085171343431155 },
      ],
      length: 3.7953262601294284,
      angle: -2.356194490192345,
    },
    minorAxis: {
      points: [
        { column: -0.15768891509232064, row: 1.8243555817589874 },
        { column: -0.15768891509232064, row: 1.8243555817589874 },
      ],
      length: 2.01285390103734,
      angle: -0.7853981633974483,
    },
    surface: 6.000000000000002,
  });
});
test('ellipse on 4x4 ROI', () => {
  const mask = testUtils.createMask([
    [0, 0, 1, 1],
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [1, 1, 1, 0],
  ]);
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois();
  const result = rois[0].ellipse;

  expect(result).toBeDeepCloseTo({
    center: { column: 1.7777777777777777, row: 1.7777777777777777 },
    majorAxis: {
      points: [
        { column: 0.488918397751106, row: 3.6243064249674615 },
        { column: 3.0666371578044496, row: -0.06875086941190611 },
      ],
      length: 4.503699166851579,
      angle: -0.961420320555157,
    },
    minorAxis: {
      points: [
        { column: 0.8646151602330147, row: 1.1403989822180598 },
        { column: 0.8646151602330147, row: 1.1403989822180598 },
      ],
      length: 2.544387508597132,
      angle: 0.6093760062397394,
    },
    surface: 9.000000000000002,
  });
});
