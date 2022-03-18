import { fromMask } from '..';
import { colorRois } from '../colorRois';

describe('colorRois', () => {
  it('3x3 mask, cross', () => {
    const mask = testUtils.createMask([[0, 1]]);
    const roiMapManager = fromMask(mask);
    const result = colorRois(roiMapManager);
    console.log(result);
    expect(result).toMatchImageData([[0, 255, 0, 255, 255, 0, 0, 255]]);
  });
});
