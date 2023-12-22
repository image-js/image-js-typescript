import { Image, Mask, Point } from '../..';

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
  sourceMask?: Image;
}

/**
 * Compute the difference between two images that are not entirely overlapping and normalise it using the nb of pixels processed.
 * Only the pixels present in both images are taken into account.
 * @param source - Source image.
 * @param destination - Destination image.
 * @param translation - Translation to apply on the source image before computing the difference.
 * @param options - Options.
 * @returns The normalised difference.
 */
export function getNormalisedDifference(
  source: Image,
  destination: Image,
  translation: Point,
  options: AlignDifferentSizeOptions = {},
): number {
  const {
    minFractionPixels,
    sourceMask = new Mask(source.width, source.height).fill(1),
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

  if (translation.column < 0) {
    sourceXOffet = -translation.column;
  } else {
    destinationXOffset = translation.column;
  }

  if (translation.row < 0) {
    sourceYOffset = -translation.row;
  } else {
    destinationYOffset = translation.row;
  }

  const maxX = Math.min(destination.width, source.width + translation.column);
  const minX = Math.max(0, translation.column);
  const maxY = Math.min(destination.height, source.height + translation.row);
  const minY = Math.max(0, translation.row);

  const width = maxX - minX;
  const height = maxY - minY;

  let nbPixels = 0;

  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      for (let channel = 0; channel < source.channels; channel++) {
        if (sourceMask.getValue(column, row, 0)) {
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
          nbPixels++;
        }
      }
    }
  }

  if (nbPixels < minNbPixels) {
    throw new Error(
      `The number of pixels compared is too low (less than ${minNbPixels})`,
    );
  }

  return difference / nbPixels;
}
