import { Image, Point } from '../../..';

import {
  AlignDifferentSizeOptions,
  getNormalisedDifference,
} from './getNormalisedDifference';

export interface GetMinDiffTranslationOptions
  extends AlignDifferentSizeOptions {
  /**
   * Maximal number of pixels that can not be overlapping on left and right sides.
   * @default 0
   */
  leftRightMargin?: number;
  /**
   * Maximal number of pixels that can not be overlapping on left and right sides.
   * @default 0
   */
  topBottomMargin?: number;
}

/**
 * Compute the translation to apply on the source that minimises the difference between two images.
 * The images don't have to overlap entirely.
 * @param source - Source image.
 * @param destination - Destination image.
 * @param options - Options.
 * @returns The translation of the source that minimises the difference.
 */
export function getMinDiffTranslation(
  source: Image,
  destination: Image,
  options: GetMinDiffTranslationOptions = {},
): Point {
  const { leftRightMargin = 0, topBottomMargin = 0 } = options;

  const maxRow = destination.height - source.height + topBottomMargin;
  const maxColumn = destination.width - source.width + leftRightMargin;
  const nbTranslations =
    (maxRow + 2 * topBottomMargin) * (maxColumn + 2 * leftRightMargin);
  console.log({ nbTranslations });

  let minDiff = Number.MAX_SAFE_INTEGER;
  let minDiffTranslation: Point = { row: 0, column: 0 };
  for (let row = -topBottomMargin; row <= maxRow; row++) {
    for (let column = -leftRightMargin; column <= maxColumn; column++) {
      const translation = { row, column };
      const diff = getNormalisedDifference(
        source,
        destination,
        translation,
        options,
      );
      if (diff < minDiff) {
        minDiff = diff;
        minDiffTranslation = translation;
      }
      console.log(
        `translation ${
          row * (maxRow + topBottomMargin) + column
        } / ${nbTranslations}`,
      );
    }
  }
  return minDiffTranslation;
}
