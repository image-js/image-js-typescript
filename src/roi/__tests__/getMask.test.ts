import { fromMask } from '../fromMask';
import { RoiKind } from '../getRois';

describe('getMask', () => {
  it('3x3 mask, cross', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roiMask = rois[0].getMask();
    expect(roiMask).toMatchMask(mask);
  });
  it('3x3 mask, L', () => {
    const mask = testUtils.createMask([
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]);
    const roiMapManager = fromMask(mask);

    const rois = roiMapManager.getRois({ kind: RoiKind.WHITE });
    const roiMask = rois[0].getMask();
    expect(roiMask).toMatchMaskData([
      [0, 1],
      [1, 1],
    ]);
  });
});
