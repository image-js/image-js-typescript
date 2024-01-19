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
} from './utils/computeNbOperations';
import { getMinDiffTranslation } from './utils/getMinDiffTranslation';

export interface AlignDifferentSizeOptions extends ComputeNbOperationsOptions {
  /**
   * Maximal number of operations that the algorithm can perform.
   * This number is used to rescale the images if they are too big so that
   * the algorithm takes roughly always the same time to compute.
   * @default 1e8
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
  /**
   * Kernel size for the blur applied to the images before the rough alignment phase.
   * @default 3
   */
  blurKernelSize?: number;
  /**
   * Minimal fraction of the pixels of the source that have to overlap to apply the algorithm.
   * @default 0.1
   */
  minFractionPixels?: number;
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
  options: AlignDifferentSizeOptions = {},
): Point {
  const {
    xFactor = 0.5,
    yFactor = 0.5,
    maxNbOperations = 1e8,
    precisionFactor = 1.5,
    thresholdAlgoritm = 'otsu',
    level = 'minMax',
    blurKernelSize,
    minFractionPixels,
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
    blurKernelSize,
  });
  const smallMask = getAlignMask(smallSource, thresholdAlgoritm);
  const smallDestination = prepareForAlign(destination, {
    scalingFactor,
    level,
    blurKernelSize,
  });
  const smallMargins = computeXYMargins(smallSource, smallDestination, {
    xFactor,
    yFactor,
  });

  const roughTranslation = getMinDiffTranslation(
    smallSource,
    smallDestination,
    {
      sourceMask: smallMask,
      leftRightMargin: smallMargins.xMargin,
      topBottomMargin: smallMargins.yMargin,
      minFractionPixels,
    },
  );

  // Find overlapping surface and source and destination origins
  const scaledTranslation = {
    column: Math.round(roughTranslation.column * scalingFactor),
    row: Math.round(roughTranslation.row * scalingFactor),
  };

  const minX = Math.max(0, scaledTranslation.column);
  const maxX = Math.min(
    destination.width,
    source.width + scaledTranslation.column,
  );
  const minY = Math.max(0, scaledTranslation.row);
  const maxY = Math.min(
    destination.height,
    source.height + scaledTranslation.row,
  );

  const overlapWidth = maxX - minX;
  const overlapHeight = maxY - minY;

  const sourceOrigin = {
    column: Math.max(0, -scaledTranslation.column),
    row: Math.max(0, -scaledTranslation.row),
  };
  const destinationOrigin = {
    column: Math.max(0, scaledTranslation.column),
    row: Math.max(0, scaledTranslation.row),
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

  const preciseSource = prepareForAlign(sourceCrop, {
    level,
    blurKernelSize,
    scalingFactor: 1,
  });
  const mask = getAlignMask(preciseSource, thresholdAlgoritm);
  const preciseDestination = prepareForAlign(destinationCrop, {
    level,
    blurKernelSize,
    scalingFactor: 1,
  });

  const preciseMargins = Math.round(precisionFactor * scalingFactor);

  const preciseTranslation = getMinDiffTranslation(
    preciseSource,
    preciseDestination,
    {
      leftRightMargin: preciseMargins,
      topBottomMargin: preciseMargins,
      minFractionPixels,
      sourceMask: mask,
    },
  );

  return {
    column: scaledTranslation.column + preciseTranslation.column,
    row: scaledTranslation.row + preciseTranslation.row,
  };
}
