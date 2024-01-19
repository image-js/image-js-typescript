import { Stack } from '../../Stack';

import { alignDifferentSize } from './alignDifferentSize';

/**
 * Fills the translations property of the stack with the translation
 * to apply on each image to align it on the first image of the stack.
 * The first image has a translation of {column: 0, row: 0}.
 * Internally, the images are aligned between two consecutive images
 * (we imagine that there is less variation in consecutive images).
 * @param stack - Stack to align.
 */
export function alignStack(stack: Stack): void {
  stack.translations[0] = { column: 0, row: 0 };
  for (let i = 1; i < stack.size; i++) {
    const currentTranslation = alignDifferentSize(
      stack.getImage(i),
      stack.getImage(i - 1),
    );
    stack.translations[i] = {
      column: stack.translations[i - 1].column + currentTranslation.column,
      row: stack.translations[i - 1].row + currentTranslation.row,
    };
  }
}
