import { fromMask } from '..';

test('calculates surface from eqpc', () => {
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
