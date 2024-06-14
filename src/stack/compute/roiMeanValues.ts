import { Stack } from '../../Stack';
import { fromMask } from '../../roi';

/**
 * Computes average grayscale value of each region of interest throughout the stack.
 * @param stack - Stack of images.
 * @returns map with average image values of each ROI.
 */
export function roiMeanValues(stack: Stack) {
  if (stack.colorModel !== 'GREY') {
    stack.map((image) => image.convertColor('GREY'));
  }
  const image = stack.maxImage();
  const rois = fromMask(image.threshold()).getRois();
  const stackGrays = new Map<number, number[]>();
  for (const roi of rois) {
    const stackAvgs = [];
    const roiPoints = roi.absolutePoints;
    for (const image of stack) {
      const avgValue = image.mean({ points: roiPoints });
      //gets value from one channel since it is grayscaled.
      stackAvgs.push(avgValue[0]);
    }
    stackGrays.set(roi.id, stackAvgs);
  }
  return stackGrays;
}
