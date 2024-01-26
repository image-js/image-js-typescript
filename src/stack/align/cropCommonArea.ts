import { Image } from '../../Image';
import { Stack } from '../../Stack';
import { Point } from '../../utils/geometry/points';

import { computeCropOrigins } from './utils/computeCropOrigins';
import { findCommonArea } from './utils/findCommonArea';

/**
 * Crops the common area of all the images of the stack, as defined by the absolute translations.
 * @param stack - Stack to crop.
 * @param absoluteTranslations - Absolute translations of the images of the stack (relative to the first image).
 * @returns A new stack containing the cropped images.
 */
export function cropCommonArea(
  stack: Stack,
  absoluteTranslations: Point[],
): Stack {
  const commonArea = findCommonArea(stack, absoluteTranslations);
  const cropOrigins = computeCropOrigins(
    stack,
    commonArea,
    absoluteTranslations,
  );
  const croppedImages: Image[] = [];
  for (let i = 0; i < stack.size; i++) {
    croppedImages.push(
      stack.getImage(i).crop({
        origin: cropOrigins[i],
        width: commonArea.width,
        height: commonArea.height,
      }),
    );
  }

  return new Stack(croppedImages);
}
