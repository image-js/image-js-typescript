import { Image, Point, ThresholdAlgorithm } from '../..';
import {
  LevelingAlgorithm,
  getAlignMask,
  prepareForAlign,
} from '../../align/align';

import {
  ComputeNbOperationsOptions,
  computeNbOperations,
  computeXYMargins,
} from './computeNbOperations';
import { getMinDiffTranslation } from './getMinDiffTranslation';

export interface AlignDifferentSizeOptions extends ComputeNbOperationsOptions {
  /**
   * Maximal number of operations that the algorithm can perform.
   * This number is used to rescale the images if they are too big so that
   * the algorithm takes roughly always the same time to compute.
   * @default 100000
   */
  maxNbOperations?: number;
  /**
   * Threshold algorithm to use for the alignment masks.
   * @default 'otsu'
   */
  thresholdAlgoritm?: ThresholdAlgorithm;
  /**
   * Factor by which to multiply the scaling factor to get the margin for the precise alignment phase.
   * @default 1.5
   */
  precisionFactor?: number;
  /**
   * Whether to auto level the images before the precise alignment phase. You can chose between `minMax`
   * leveling (span all channels from 0 to max value) or `uniform`(keep the color balance).
   * @default 'minMax'
   */
  level?: LevelingAlgorithm;
}

/**
 * Align two different size images by finding the position wchich minimises the difference.
 * @param source - Source image.
 * @param destination - Destination image.
 * @param options - Align different size options.
 * @returns The translation to apply to the source image to align it with the destination image.
 */
export function alignDifferentSize(
  source: Image,
  destination: Image,
  options: AlignDifferentSizeOptions,
): Point {
  const {
    xFactor = 0.5,
    yFactor = 0.5,
    maxNbOperations = 100000,
    precisionFactor = 1.5,
    thresholdAlgoritm = 'otsu',
    level = 'minMax',
  } = options;

  const margins = computeXYMargins(source, destination, { xFactor, yFactor });

  const nbOperations = computeNbOperations(source, destination, margins);

  let scalingFactor = 1;
  if (nbOperations > maxNbOperations) {
    scalingFactor = Math.sqrt(nbOperations / maxNbOperations);
  }

  // Rough alignment
  const smallSource = prepareForAlign(source, {
    scalingFactor,
    level,
  });
  const smallMask = getAlignMask(smallSource, thresholdAlgoritm);
  const smallDestination = prepareForAlign(destination, {
    scalingFactor,
    level,
  });
  const smallMargins = computeXYMargins(smallSource, smallDestination);

  const roughTranslation = getMinDiffTranslation(
    smallSource,
    smallDestination,
    {
      sourceMask: smallMask,
      leftRightMargin: smallMargins.xMargin,
      topBottomMargin: smallMargins.yMargin,
    },
  );

  // Find overlapping surface and source and destination origins
  const minX = Math.min(0, roughTranslation.column);
  const maxX = Math.min(
    destination.width,
    source.width + roughTranslation.column,
  );
  const minY = Math.min(0, roughTranslation.row);
  const maxY = Math.min(
    destination.height,
    source.height + roughTranslation.row,
  );

  const overlapWidth = maxX - minX;
  const overlapHeight = maxY - minY;

  const sourceOrigin = {
    column: Math.max(0, -roughTranslation.column),
    row: Math.max(0, -roughTranslation.row),
  };
  const destinationOrigin = {
    column: Math.max(0, roughTranslation.column),
    row: Math.max(0, roughTranslation.row),
  };

  // Precise alignment
  const sourceCrop = source.crop({
    origin: sourceOrigin,
    width: overlapWidth,
    height: overlapHeight,
  });
  const destinationCrop = destination.crop({
    origin: destinationOrigin,
    width: overlapWidth,
    height: overlapHeight,
  });

  const preciseMargins = precisionFactor * scalingFactor;

  const preciseTranslation = getMinDiffTranslation(
    sourceCrop,
    destinationCrop,
    {
      leftRightMargin: preciseMargins,
      topBottomMargin: preciseMargins,
    },
  );

  return {
    column: roughTranslation.column + preciseTranslation.column,
    row: roughTranslation.row + preciseTranslation.row,
  };
}
