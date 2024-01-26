import { Image, Mask } from '../../..';

export interface ComputeXYMarginsOptions {
  /**
   * Horizontal fraction of the images that can not be overlapping.
   * This fraction is applied on the image with the smallest width.
   * @default 0
   */
  xFactor?: number;
  /**
   * Vertical fraction of the images that can not be overlapping.
   * This fraction is applied on the image with the smallest height.
   * @default 0
   */
  yFactor?: number;
}

export interface Margins {
  /**
   * Horizontal margin in pixels.
   */
  xMargin: number;
  /**
   * Vertical margin in pixels.
   */
  yMargin: number;
}

/**
 * Compute the margins that around the destination image in which the source can be translated.
 * @param source - Source image.
 * @param destination - Destination image.
 * @param options - Options.
 * @returns The x and y margins.
 */
export function computeXYMargins(
  source: Image,
  destination: Image,
  options: ComputeXYMarginsOptions = {},
): Margins {
  const { xFactor = 0, yFactor = 0 } = options;
  let xMargin = 0;
  let yMargin = 0;

  // compute x and y margins
  if (source.width < destination.width) {
    xMargin = Math.round(xFactor * source.width);
  } else {
    xMargin = Math.round(source.width - destination.width * (1 - xFactor));
  }

  if (source.height < destination.height) {
    yMargin = Math.round(yFactor * source.height);
  } else {
    yMargin = Math.round(source.height - destination.height * (1 - yFactor));
  }
  return { xMargin, yMargin };
}

const defaultMargins = { xMargin: 0, yMargin: 0 };

/**
 * Compute the number of translations that will be performed for the alignment.
 * @param source - Source image.
 * @param destination - Destination image.
 * @param margins - The margins around the destination image in which the source can be translated.
 * @returns The number of translations that will be performed for the alignment.
 */
export function computeNbTranslations(
  source: Image,
  destination: Image,
  margins: Margins = defaultMargins,
): number {
  const minRow = -margins.yMargin;
  const minColumn = -margins.xMargin;
  const maxRow = destination.height - source.height + margins.yMargin;
  const maxColumn = destination.width - source.width + margins.xMargin;
  const nbTranslations = (maxRow - minRow + 1) * (maxColumn - minColumn + 1);
  return nbTranslations;
}

export interface ComputeNbOperationsOptions {
  /**
   * The mask of the source image.
   * @default new Mask(source.width, source.height).fill(1)
   */
  sourceMask?: Mask;
  /**
   * The mask of the destination image.
   * @default new Mask(destination.width, destination.height).fill(1)
   */
  destinationMask?: Mask;
  /**
   * The margins around the destination image in which the source can be translated.
   * @default { xMargin: 0, yMargin: 0 }
   */
  margins?: Margins;
}
/**
 * Approximate the number of operations that will be performed for the alignment. This is an overestimate!!
 * The bigger the margins the more we overestimate. For margins that are zero, the value is exact.
 * @param source - Source image.
 * @param destination - Destination image.
 * @param options - Options.
 * @returns The number of operations that will be performed for the alignment.
 */
export function computeNbOperations(
  source: Image,
  destination: Image,
  options: ComputeNbOperationsOptions,
): number {
  const {
    sourceMask = new Mask(source.width, source.height).fill(1),
    destinationMask = new Mask(destination.width, destination.height).fill(1),
    margins = defaultMargins,
  } = options;
  const nbTranslations = computeNbTranslations(source, destination, margins);
  const minHeight = Math.min(source.height, destination.height);
  const minWidth = Math.min(source.width, destination.width);
  // take mask into account
  const fractionWhitePixels =
    (sourceMask.getNbNonZeroPixels() / source.size +
      destinationMask.getNbNonZeroPixels() / destination.size) /
    2;
  console.log({ fractionWhitePixels });

  return nbTranslations * minHeight * minWidth * fractionWhitePixels;
}
