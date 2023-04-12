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
    rMajor: 1.1055415967851332,
    rMinor: 0.8164965809277259,
    position: { x: 0.8333333333333334, y: 0.8333333333333334 },
    majorAxis: {
      point1: { x: 1.6150692933039048, y: 1.6150692933039048 },
      point2: { x: 0.051597373362761934, y: 0.05159737336276182 },
    },
    minorAxis: {
      point1: { x: 0.25598306414370764, y: 1.410683602522959 },
      point2: { x: 1.4106836025229592, y: 0.25598306414370775 },
    },
  });
});
