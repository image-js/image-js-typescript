import { Stack } from '../../../Stack';
import { Point } from '../../../geometry';
import { difference } from '../../../utils/geometry/points';

import { CommonArea } from './findCommonArea';

/**
 * Compute the origins of the crops relative to the top left corner of each image in order
 * to crop the common area of each of the images of an aligned stack.
 * @param stack - Stack to process.
 * @param commonArea - The data of the common area of the stack.
 * @param absoluteTranslations - The absolute translations of the images of the stack (relative to the first image).
 * @returns The origins of the crops.
 */
export function computeCropOrigins(
  stack: Stack,
  commonArea: CommonArea,
  absoluteTranslations: Point[],
): Point[] {
  const cropOrigins: Point[] = [];
  let currentCropOrigin = commonArea.origin;
  cropOrigins.push(currentCropOrigin);
  for (let i = 1; i < stack.size; i++) {
    currentCropOrigin = difference(commonArea.origin, absoluteTranslations[i]);
    cropOrigins.push(currentCropOrigin);
  }

  return cropOrigins;
}
