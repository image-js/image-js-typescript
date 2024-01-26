import { Stack } from '../../Stack';
import { Point, sum } from '../../utils/geometry/points';

import { alignDifferentSize } from './alignDifferentSize';

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
 * @returns The relative and absolute translations.
 */
export function alignStack(stack: Stack): Translations {
  const relativeTranslations: Point[] = [{ column: 0, row: 0 }];
  const absoluteTranslations: Point[] = [{ column: 0, row: 0 }];
  for (let i = 1; i < stack.size; i++) {
    const currentRelativeTranslation = alignDifferentSize(
      stack.getImage(i),
      stack.getImage(i - 1),
    );
    relativeTranslations.push(currentRelativeTranslation);
    absoluteTranslations.push(
      sum(absoluteTranslations[i - 1], currentRelativeTranslation),
    );
  }
  return { absolute: absoluteTranslations, relative: relativeTranslations };
}
