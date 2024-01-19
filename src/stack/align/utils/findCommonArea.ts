import { Stack } from '../../../Stack';
import { Point } from '../../../geometry';

import { findOverlap } from './findOverlap';

/**
 * Find the common area of all images of a stack.
 * @param stack - Stack to process.
 * @returns The common area origin relative to the first image of the stack, the width and the height.
 */
export function findCommonArea(stack: Stack): {
  origin: Point;
  width: number;
  height: number;
} {
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
      sourceTranslation: stack.translations[i],
      commonAreaOrigin,
      previousHeight: height,
      previousWidth: width,
    });

    console.log({ overlap });
    commonAreaOrigin = {
      column: Math.max(commonAreaOrigin.column, stack.translations[i].column),
      row: Math.max(commonAreaOrigin.row, stack.translations[i].row),
    };
    width = overlap.width;
    height = overlap.height;

    console.log({ origin: commonAreaOrigin, width, height });
  }
  return { origin: commonAreaOrigin, width, height };
}
