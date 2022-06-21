import { Point } from '../utils/types';

import { Roi } from './Roi';

export interface GetBorderPointOptions {
  /**
   * Should the inner borders be returned too?
   *
   * @default false
   */
  innerBorders?: boolean;

  allowCorners?: boolean;
}

// TODO: This function could be optimised by following the contour instead of scanning all pixels.
/**
 * Return an array with the coordinates of the pixels that are on the border of the ROI.
 * The points are defined as [column, row].
 *
 * @param roi - ROI to process.
 * @param options - Get border points options.
 * @returns The array of border pixels.
 */
export function getBorderPoints(
  roi: Roi,
  options: GetBorderPointOptions = {},
): Array<Point> {
  const { innerBorders = false, allowCorners = false } = options;
  const mask = roi.getMask();
  if (!innerBorders) {
    mask.solidFill({ out: mask });
  }

  let borders: Array<Point> = [];

  // first process frame pixels
  for (let column = 0; column < mask.width; column++) {
    if (mask.getBit(column, 0)) {
      borders.push([column, 0]);
    }
    if (mask.getBit(column, mask.height - 1)) {
      borders.push([column, mask.height - 1]);
    }
  }
  for (let row = 0; row < mask.height; row++) {
    if (mask.getBit(0, row)) {
      borders.push([0, row]);
    }
    if (mask.getBit(mask.width - 1, row)) {
      borders.push([mask.width - 1, row]);
    }
  }

  for (let row = 1; row < mask.height - 1; row++) {
    for (let column = 1; column < mask.width - 1; column++) {
      if (mask.getBit(column, row)) {
        if (
          mask.getBit(column - 1, row) === 0 ||
          mask.getBit(column, row - 1) === 0 ||
          mask.getBit(column + 1, row) === 0 ||
          mask.getBit(column, row + 1) === 0
        ) {
          borders.push([column, row]);
        }

        if (allowCorners) {
          if (
            mask.getBit(column - 1, row - 1) === 0 ||
            mask.getBit(column - 1, row + 1) === 0 ||
            mask.getBit(column + 1, row - 1) === 0 ||
            mask.getBit(column + 1, row + 1) === 0
          ) {
            borders.push([column, row]);
          }
        }
      }
    }
  }

  return borders;
}
