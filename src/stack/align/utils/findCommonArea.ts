import { Stack } from '../../../Stack';
import { Point } from '../../../geometry';

import { findOverlap } from './findOverlap';

export interface CommonArea {
  origin: Point;
  width: number;
  height: number;
}

/**
 * Find the common area of all images of a stack.
 * @param stack - Stack to process.
 * @param absoluteTranslations - Absolute translations of the images of the stack (relative to the first image).
 * @returns The common area origin relative to the top-left corner of first image of the stack, the width and the height of the common area.
 */
export function findCommonArea(
  stack: Stack,
  absoluteTranslations: Point[],
): CommonArea {
  if (stack.size < 2) {
    throw new RangeError('Stack must contain at least 2 images');
  }

  let commonAreaOrigin = { column: 0, row: 0 };
  let width = stack.getImage(0).width;
  let height = stack.getImage(0).height;

  for (let i = 1; i < stack.size; i++) {
    const overlap = findOverlap({
      source: stack.getImage(i),
      destination: stack.getImage(0),
      sourceTranslation: absoluteTranslations[i],
      commonAreaOrigin,
      previousHeight: height,
      previousWidth: width,
    });

    commonAreaOrigin = {
      column: Math.max(commonAreaOrigin.column, absoluteTranslations[i].column),
      row: Math.max(commonAreaOrigin.row, absoluteTranslations[i].row),
    };
    width = overlap.width;
    height = overlap.height;
  }

  return { origin: commonAreaOrigin, width, height };
}
