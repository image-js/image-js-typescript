import {
  Point,
  Image,
  alignMinDifference,
  ImageColorModel,
  ThresholdAlgorithm,
  Mask,
} from '..';

export type LevelingAlgorithm = 'none' | 'minMax' | 'uniform';

export interface AlignOptions {
  /**
   * Factor by which to scale down the images for the rough alignment phase.
   * @default 4
   */
  scalingFactor?: number;
  /**
   * Kernel size for the blur applied to the images before the rough alignment phase.
   * @default 3
   */
  blurKernelSize?: number;
  /**
   * Factor by which to multiply the scaling factor to get the margin for the precise alignment phase.
   * @default 1.5
   */
  precisionFactor?: number;
  /**
   * Whether to auto level the images before the precise alignment phase. You can chose between `minMax`
   * leveling (span all channels from 0 to max value) or `uniform`(keep the color balance).
   * @default false
   */
  level?: LevelingAlgorithm;
  /**
   * Threshold algorithm to use for the alignment masks.
   * @default 'otsu'
   */
  thresholdAlgoritm?: ThresholdAlgorithm;
}

/**
 * Align an enlarged crop on a reference crop by doing the min difference.
 * A rough alignment is first done on the images scaled down and a precise alignment is then
 * applied on the real size images. Only part of the pixels are used for the comparison.
 * The pixel to considered are defined by a mask. The algorithm used to create the mask
 * is defined by the `thresholdAlgorithm` option.
 * @param source - The source image. Must be smaller than the destination image.
 * @param destination - The destination image.
 * @param options - Aligning options.
 * @returns The coordinates of the reference relative to the top-left corner
 * of the destination image for an optimal alignment.
 */
export function align(
  source: Image,
  destination: Image,
  options: AlignOptions = {},
): Point {
  const {
    scalingFactor = 4,
    precisionFactor = 1.5,
    thresholdAlgoritm = 'otsu',
  } = options;

  // console.log({ level: options.level });

  // rough alignment
  const small = prepareForAlign(destination, options);
  const smallRef = prepareForAlign(source, options);

  const smallMask = getAlignMask(smallRef, thresholdAlgoritm);

  const roughAlign = alignMinDifference(smallRef, small, {
    mask: smallMask,
    startStep: 1,
  });

  // precise alignment

  // number of pixels to add around the rough roi crop for the precise alignment
  const margin = scalingFactor * precisionFactor;
  const originColumn = Math.max(0, roughAlign.column * scalingFactor - margin);
  const originRow = Math.max(0, roughAlign.row * scalingFactor - margin);

  const roughCrop = destination.crop({
    origin: {
      column: originColumn,
      row: originRow,
    },
    width: Math.min(
      destination.width - originColumn,
      source.width + 2 * margin,
    ),
    height: Math.min(
      destination.height - originRow,
      source.height + 2 * margin,
    ),
  });

  const preciseCrop = prepareForAlign(roughCrop, {
    ...options,
    scalingFactor: 1,
  });
  const preciseRef = prepareForAlign(source, {
    ...options,
    scalingFactor: 1,
  });
  const refMask = getAlignMask(preciseRef, thresholdAlgoritm);

  const preciseAlign = alignMinDifference(preciseRef, preciseCrop, {
    startStep: 1,
    mask: refMask,
  });

  return {
    column: originColumn + preciseAlign.column,
    row: originRow + preciseAlign.row,
  };
}

/**
 * Prepare an image to align it with another image.
 * @param image - Crop to align.
 * @param options - Prepare for align options.
 * @returns The prepared image
 */
function prepareForAlign(image: Image, options: AlignOptions = {}): Image {
  const { scalingFactor = 4, blurKernelSize = 3, level = 'minMax' } = options;

  const blurred = image.blur({ width: blurKernelSize, height: blurKernelSize });
  if (level === 'minMax') {
    blurred.increaseContrast({ out: blurred });
  } else if (level === 'uniform') {
    blurred.increaseContrast({ uniform: true, out: blurred });
  }
  const scaled = blurred.resize({
    xFactor: 1 / scalingFactor,
    yFactor: 1 / scalingFactor,
  });
  return scaled;
}

function getAlignMask(image: Image, algorithm: ThresholdAlgorithm): Mask {
  if (image.colorModel !== ImageColorModel.GREY) {
    image = image.grey();
  }
  const mask = image
    .threshold({ algorithm })
    .invert()
    .dilate({ iterations: 2 });
  return mask;
}
