import { fromMask } from '..';
import { Roi } from '../Roi';
import { computeRois } from '../computeRois';

describe('computeRois', () => {
  it('1x1 mask', () => {
    const mask = testUtils.createMask([[1, 0]]);
    const roiMapManager = fromMask(mask);
    computeRois(roiMapManager);

    const whiteRoi = new Roi(roiMapManager.getMap(), 1);
    whiteRoi.minRow = 0;
    whiteRoi.minColumn = 0;
    whiteRoi.maxRow = 0;
    whiteRoi.maxColumn = 0;
    whiteRoi.surface = 1;

    expect(roiMapManager.whiteRois).toHaveLength(1);
    expect(roiMapManager.whiteRois).toStrictEqual([whiteRoi]);

    const blackRoi = new Roi(roiMapManager.getMap(), -1);
    blackRoi.minRow = 0;
    blackRoi.minColumn = 1;
    blackRoi.maxRow = 0;
    blackRoi.maxColumn = 1;
    blackRoi.surface = 1;

    expect(roiMapManager.blackRois).toHaveLength(1);
    expect(roiMapManager.blackRois).toStrictEqual([blackRoi]);
  });
});
