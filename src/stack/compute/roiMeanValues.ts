import { Stack } from '../../Stack';
import { fromMask } from '../../roi';

/**
 * Find a `maxImage` of the stack, then get a map object where keys are `roi.id`s and values are arrays of average values of each ROI in each image.
 * @param stack - Stack of images.
 * @returns map object with `roi.id`s and their average values in the stack.
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
