import { fromMask, waterShed } from '..';
import { createGreyImage } from '../../../test/testUtils';
import { computeRois } from '../computeRois';

test('3x3 mask', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 1],
  ]);
  const roiMapManager = fromMask(mask);
  computeRois(roiMapManager);
  expect(roiMapManager.whiteRois).toHaveLength(2);
  expect(roiMapManager.blackRois).toHaveLength(1);

  expect(roiMapManager.whiteRois).toMatchSnapshot();
  expect(roiMapManager.blackRois).toMatchSnapshot();
});

test('test 2, waterShed for a grey image', () => {
  const image = createGreyImage([
    [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
    [3, 3, 2, 2, 2, 3, 3, 3, 4, 4],
    [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
    [4, 3, 2, 2, 2, 2, 3, 3, 3, 4],
    [4, 4, 4, 3, 2, 3, 2, 3, 3, 4],
    [4, 4, 4, 3, 3, 3, 3, 1, 3, 3],
    [4, 3, 3, 3, 3, 3, 2, 2, 2, 3],
    [4, 4, 3, 3, 3, 3, 2, 2, 2, 2],
    [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
    [4, 4, 4, 4, 3, 3, 3, 3, 2, 3],
  ]);

  const roiMapManager = waterShed(image, { threshold: 2 / 255 });
  const rois = roiMapManager.getRois({ kind: 'bw' });
  expect(rois[1].origin).toEqual({ column: 5, row: 5 });
  expect(rois[0].origin).toEqual({ column: 2, row: 1 });
});
