import { Stack } from '../../Stack';
import { Point, sum } from '../../utils/geometry/points';

import {
  AlignDifferentSizeOptions,
  alignDifferentSize,
} from './alignDifferentSize';

export interface Translations {
  absolute: Point[];
  relative: Point[];
}
/**
 * Computes the relative and absolute translations property
 * to apply on each image to align it on the first image of the
 * stack (absolute translation) or on the previous image of the stack (relative translation).
 * The first image has a translation of {column: 0, row: 0}.
 * Internally, the images are aligned between two consecutive images
 * (we imagine that there is less variation in consecutive images).
 * @param stack - Stack to align.
 * @param options - Options to align different size images.
 * @returns The relative and absolute translations.
 */
export function alignStack(
  stack: Stack,
  options: AlignDifferentSizeOptions = {},
): Translations {
  const relativeTranslations: Point[] = [{ column: 0, row: 0 }];
  const absoluteTranslations: Point[] = [{ column: 0, row: 0 }];
  for (let i = 1; i < stack.size; i++) {
    console.log(`Aligning image ${i}`);
    const currentRelativeTranslation = alignDifferentSize(
      stack.getImage(i),
      stack.getImage(i - 1),
      options,
    );
    relativeTranslations.push(currentRelativeTranslation);
    absoluteTranslations.push(
      sum(absoluteTranslations[i - 1], currentRelativeTranslation),
    );
  }
  return { absolute: absoluteTranslations, relative: relativeTranslations };
}
