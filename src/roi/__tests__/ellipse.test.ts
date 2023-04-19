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
    rMajor: 1.6080925781597333,
    rMinor: 1.1876550784708841,
    position: { x: 0.8333333333333334, y: 0.8333333333333334 },
    majorAxis: {
      point1: { x: 1.9704265001258388, y: 1.9704265001258392 },
      point2: { x: -0.3037598334591721, y: -0.30375983345917235 },
    },
    minorAxis: {
      point1: { x: -0.0064656263640701095, y: 1.6731322930307369 },
      point2: { x: 1.6731322930307369, y: -0.0064656263640699985 },
    },
    surface: 6.000000000000001,
  });
});
