import {
  Image,
  ImageColorModel,
  Point,
  ThresholdAlgorithm,
  overlapImages,
  writeSync,
} from '../..';
import {
  LevelingAlgorithm,
  getAlignMask,
  prepareForAlign,
} from '../../align/align';
import { max } from '../../operations/greyAlgorithms';

import {
  ComputeXYMarginsOptions,
  computeNbOperations,
  computeXYMargins,
} from './utils/computeNbOperations';
import { findOverlap } from './utils/findOverlap';
import { getMinDiffTranslation } from './utils/getMinDiffTranslation';

export interface AlignDifferentSizeOptions extends ComputeXYMarginsOptions {
  /**
   * Maximal number of operations that the algorithm can perform.
   * This number is used to rescale the images if they are too big so that
   * the algorithm takes roughly always the same time to compute.
   * You can use scalingFactor instead to specify the scaling factor to apply,
   * in that case, maxNbOperations should be undefined.
   * @default 1e8
   */
  maxNbOperations?: number;
  /**
   * Scaling factor to apply to the images before the rough alignment phase.
   * Can only be used if maxnbOperations is undefined.
   * @default undefined
   */
  scalingFactor?: number;
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
  /**
   * Minimal number of overlapping pixels to apply the algorithm.
   * @default undefined
   */
  minNbPixels?: number;
  /**
   * Display debug information?
   * @default false
   */
  debug?: boolean;
}

/**
 * Align two different size images by finding the position which minimises the difference.
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
    precisionFactor = 1.5,
    thresholdAlgoritm = 'otsu',
    level = 'minMax',
    blurKernelSize,
    minFractionPixels,
    debug = false,
  } = options;

  let maxNbOperations;
  let scalingFactor = 1;
  if (
    options.maxNbOperations === undefined &&
    options.scalingFactor === undefined
  ) {
    maxNbOperations = 1e8;
  } else if (
    options.maxNbOperations !== undefined &&
    options.scalingFactor === undefined
  ) {
    maxNbOperations = options.maxNbOperations;
  } else if (
    options.maxNbOperations === undefined &&
    options.scalingFactor !== undefined
  ) {
    scalingFactor = options.scalingFactor;
  } else {
    throw new Error('You cannot define both maxNbOperations and scalingFactor');
  }

  const margins = computeXYMargins(source, destination, { xFactor, yFactor });

  if (maxNbOperations !== undefined) {
    const initialSrcMask = getAlignMask(source, thresholdAlgoritm);
    const initialDstMask = getAlignMask(destination, thresholdAlgoritm);
    const nbOperations = computeNbOperations(source, destination, {
      sourceMask: initialSrcMask,
      destinationMask: initialDstMask,
      margins,
    });
    if (debug) {
      console.log({ nbOperations });
    }
    scalingFactor = 1;
    if (nbOperations > maxNbOperations) {
      scalingFactor = Math.sqrt(nbOperations / maxNbOperations);
    }
  }
  if (debug) {
    console.log({ scalingFactor });
  }

  // Rough alignment
  const smallSource = prepareForAlign(source, {
    scalingFactor,
    level,
    blurKernelSize,
  });
  const smallSrcMask = getAlignMask(smallSource, thresholdAlgoritm);
  const smallDestination = prepareForAlign(destination, {
    scalingFactor,
    level,
    blurKernelSize,
  });
  const smallDstMask = getAlignMask(smallDestination, thresholdAlgoritm);

  const smallNbPixels = Math.round(
    (smallSrcMask.getNbNonZeroPixels() + smallDstMask.getNbNonZeroPixels()) / 2,
  );

  if (debug) {
    writeSync(`${__dirname}/smallSource.png`, smallSource);
    writeSync(`${__dirname}/smallDestination.png`, smallDestination);
    writeSync(`${__dirname}/smallSrcMask.png`, smallSrcMask);
    writeSync(`${__dirname}/smallDstMask.png`, smallDstMask);
  }

  const smallMargins = computeXYMargins(smallSource, smallDestination, {
    xFactor,
    yFactor,
  });

  if (debug) {
    console.log({ smallMargins, smallNbPixels });
  }
  const roughTranslation = getMinDiffTranslation(
    smallSource,
    smallDestination,
    {
      sourceMask: smallSrcMask,
      destinationMask: smallDstMask,
      leftRightMargin: smallMargins.xMargin,
      topBottomMargin: smallMargins.yMargin,
      minNbPixels: smallNbPixels,
    },
  );

  if (debug) {
    console.log({ roughTranslation });
    const overlap = overlapImages(smallSource, smallDestination, {
      origin: roughTranslation,
    });
    writeSync(`${__dirname}/roughOverlap.png`, overlap);
    const maskOverlap = overlapImages(
      smallSrcMask.convertColor(ImageColorModel.GREY),
      smallDstMask.convertColor(ImageColorModel.GREY),
      {
        origin: roughTranslation,
      },
    );
    writeSync(`${__dirname}/roughMaskOverlap.png`, maskOverlap);
  }

  // Find overlapping surface and source and destination origins
  if (debug) {
    console.log('Find overlap');
  }
  const scaledTranslation = {
    column: Math.round(roughTranslation.column * scalingFactor),
    row: Math.round(roughTranslation.row * scalingFactor),
  };

  const {
    width: overlapWidth,
    height: overlapHeight,
    sourceOrigin,
    destinationOrigin,
  } = findOverlap({
    source,
    destination,
    sourceTranslation: scaledTranslation,
  });

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
  const srcMask = getAlignMask(preciseSource, thresholdAlgoritm);
  const preciseDestination = prepareForAlign(destinationCrop, {
    level,
    blurKernelSize,
    scalingFactor: 1,
  });
  const dstMask = getAlignMask(preciseDestination, thresholdAlgoritm);
  if (debug) {
    writeSync(`${__dirname}/preciseSource.png`, preciseSource);
    writeSync(`${__dirname}/preciseDestination.png`, preciseDestination);
    writeSync(`${__dirname}/srcMask.png`, srcMask);
    writeSync(`${__dirname}/dstMask.png`, dstMask);
  }

  const nbPixels = Math.round(
    (srcMask.getNbNonZeroPixels() + dstMask.getNbNonZeroPixels()) / 2,
  );

  const preciseMargins = Math.round(precisionFactor * scalingFactor);

  if (debug) {
    console.log('Compute precise translation');
  }
  const preciseTranslation = getMinDiffTranslation(
    preciseSource,
    preciseDestination,
    {
      leftRightMargin: preciseMargins,
      topBottomMargin: preciseMargins,
      minFractionPixels,
      sourceMask: srcMask,
      destinationMask: dstMask,
      minNbPixels: nbPixels,
    },
  );

  return {
    column: scaledTranslation.column + preciseTranslation.column,
    row: scaledTranslation.row + preciseTranslation.row,
  };
}
