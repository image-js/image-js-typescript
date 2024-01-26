import { Image, Mask, Point } from '../../..';

export interface AlignDifferentSizeOptions {
  /**
   * Minimal number of overlapping pixels to apply the algorithm.
   * @default undefined
   */
  minNbPixels?: number;
  /**
   * Minimal fraction of the pixels of the source that have to overlap to apply the algorithm.
   * @default 0.1
   */
  minFractionPixels?: number;
  /**
   * Mask of the source image, which specifies the pixels to consider for the calculation.
   * @default Mask with the dimensions of source and all pixels set to 1.
   */
  sourceMask?: Mask;
  /**
   * Mask of the destination image, which specifies the pixels to consider for the calculation.
   * @default Mask with the dimensions of destination and all pixels set to 1.
   */
  destinationMask?: Mask;
}

/**
 * Compute the difference between two images that are not entirely overlapping and normalise it using the nb of pixels overlapping.
 * Only the pixels present in both images are taken into account.
 * @param source - Source image.
 * @param destination - Destination image.
 * @param sourceTranslation - Translation to apply on the source image relative to the top-left corner of the destination image before computing the difference.
 * @param options - Options.
 * @returns The normalised difference.
 */
export function getNormalisedDifference(
  source: Image,
  destination: Image,
  sourceTranslation: Point,
  options: AlignDifferentSizeOptions = {},
): number {
  const {
    minFractionPixels,
    sourceMask = new Mask(source.width, source.height).fill(1),
    destinationMask = new Mask(destination.width, destination.height).fill(1),
  } = options;
  let { minNbPixels } = options;

  if (minNbPixels === undefined && minFractionPixels === undefined) {
    minNbPixels = Math.ceil(0.1 * source.size);
  } else if (minNbPixels !== undefined && minFractionPixels !== undefined) {
    throw new Error(
      'You cannot specify both minNbPixels and minFractionPixels',
    );
  } else if (minNbPixels === undefined && minFractionPixels !== undefined) {
    minNbPixels = Math.ceil(minFractionPixels * source.size);
  } else if (minNbPixels === undefined) {
    throw new Error('minNbPixels cannot be undefined');
  }

  let difference = 0;

  let sourceXOffet = 0;
  let sourceYOffset = 0;
  let destinationXOffset = 0;
  let destinationYOffset = 0;

  if (sourceTranslation.column < 0) {
    sourceXOffet = -sourceTranslation.column;
  } else {
    destinationXOffset = sourceTranslation.column;
  }

  if (sourceTranslation.row < 0) {
    sourceYOffset = -sourceTranslation.row;
  } else {
    destinationYOffset = sourceTranslation.row;
  }

  const maxX = Math.min(
    destination.width,
    source.width + sourceTranslation.column,
  );
  const minX = Math.max(0, sourceTranslation.column);
  const maxY = Math.min(
    destination.height,
    source.height + sourceTranslation.row,
  );
  const minY = Math.max(0, sourceTranslation.row);

  const width = maxX - minX;
  const height = maxY - minY;

  let nbPixels = 0;

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      let pixelCounted = false;
      for (let channel = 0; channel < source.channels; channel++) {
        if (
          sourceMask.getValue(column + sourceXOffet, row + sourceYOffset, 0) ||
          destinationMask.getValue(
            column + destinationXOffset,
            row + destinationYOffset,
            0,
          )
        ) {
          pixelCounted = true;
          if (
            sourceTranslation.column === 15 &&
            sourceTranslation.row === -12
          ) {
            console.log({ column, row, channel });
          }
          const sourceValue = source.getValue(
            column + sourceXOffet,
            row + sourceYOffset,
            channel,
          );
          const destinationValue = destination.getValue(
            column + destinationXOffset,
            row + destinationYOffset,
            channel,
          );

          const currentDifference = sourceValue - destinationValue;
          if (currentDifference < 0) {
            difference -= currentDifference;
          } else {
            difference += currentDifference;
          }
        } else {
          pixelCounted = false;
        }
      }
      if (pixelCounted) {
        nbPixels++;
      }
    }
  }

  if (nbPixels < minNbPixels) {
    // If there are not enough pixels overlapping, we consider the difference to be maximal
    return 2 ** source.bitDepth - 1;
  }
  if (sourceTranslation.column === 15 && sourceTranslation.row === -12) {
    console.log({ nbPixels, diff: difference / nbPixels });
  }
  return difference / nbPixels;
}
