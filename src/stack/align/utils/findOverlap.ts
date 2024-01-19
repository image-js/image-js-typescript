import { Image } from '../../..';
import { Point } from '../../../geometry';

export interface FindOverlapParameters {
  /**
   * Source image.
   */
  source: Image;
  /**
   * Destination image.
   */
  destination: Image;
  /**
   * Translation of the source image relative to top-left corner of destination image.
   * @default { column: 0, row: 0 }
   */
  sourceTranslation?: Point;
  /**
   * Theoretical origin of the common area in the source image.
   * @default { column: 0, row: 0 }
   */
  commonAreaOrigin?: Point;
  /**
   * Theoretical width of the common area on the iteration before.
   * @default destination.width
   */
  previousWidth?: number;
  /**
   * Theoretical height of the common area on the iteration before.
   * @default destination.height
   */
  previousHeight?: number;
}
export interface Overlap {
  /**
   * Origin of the overlapping area in the source image.
   */
  sourceOrigin: Point;
  /**
   * Origin of the overlapping area in the destination image.
   */
  destinationOrigin: Point;
  /**
   * Width of the overlapping area.
   */
  width: number;
  /**
   * Height of the overlapping area.
   */
  height: number;
}

/**
 * Find the overlapping area between two images.
 * @param findOverlapParameters - Parameters.
 * @returns Overlapping area width, height and origin in source and destination images.
 */
export function findOverlap(
  findOverlapParameters: FindOverlapParameters,
): Overlap {
  const {
    source,
    destination,
    sourceTranslation = { column: 0, row: 0 },
    commonAreaOrigin = { column: 0, row: 0 },
    previousWidth = destination.width,
    previousHeight = destination.height,
  } = findOverlapParameters;

  const minX = Math.max(commonAreaOrigin.column, sourceTranslation.column);
  const maxX = Math.min(
    commonAreaOrigin.column + previousWidth,
    sourceTranslation.column + source.width,
  );
  const minY = Math.max(commonAreaOrigin.row, sourceTranslation.row);
  const maxY = Math.min(
    commonAreaOrigin.row + previousHeight,
    sourceTranslation.row + source.height,
  );

  const width = maxX - minX;
  const height = maxY - minY;

  const sourceOrigin = {
    column: Math.max(0, -sourceTranslation.column),
    row: Math.max(0, -sourceTranslation.row),
  };
  const destinationOrigin = {
    column: Math.max(0, sourceTranslation.column),
    row: Math.max(0, sourceTranslation.row),
  };
  return {
    sourceOrigin,
    destinationOrigin,
    width,
    height,
  };
}
