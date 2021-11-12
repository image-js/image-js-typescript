import { IJS } from '../IJS';
import { getOutputImage } from '../utils/getOutputImage';
import { validateValue } from '../utils/validators';

import { otsu } from './thresholds/otsu';
import { triangle } from './thresholds/triangle';

// TODO: convert more algorithms to TS.
export enum ThresholdAlgorithm {
  HUANG = 'HUANG',
  INTERMODES = 'INTERMODES',
  ISODATA = 'ISODATA',
  LI = 'LI',
  MAX_ENTROPY = 'MAX_ENTROPY',
  MEAN = 'MEAN',
  MIN_ERROR = 'MIN_ERROR',
  MINIMUM = 'MINIMUM',
  MOMENTS = 'MOMENTS',
  OTSU = 'OTSU',
  PERCENTILE = 'PERCENTILE',
  RENYI_ENTROPY = 'RENYI_ENTROPY',
  SHANBHAG = 'SHANBHAG',
  TRIANGLE = 'TRIANGLE',
  YEN = 'YEN',
}

interface ThresholdOptionsBase {
  out?: IJS;
}

export interface ThresholdOptionsThreshold extends ThresholdOptionsBase {
  threshold: number;
}

export interface ThresholdOptionsAlgorithm extends ThresholdOptionsBase {
  algorithm: ThresholdAlgorithm;
}

export type ThresholdOptions =
  | ThresholdOptionsThreshold
  | ThresholdOptionsAlgorithm;

/**
 * Compute threshold value for an image using the specified algorithm.
 *
 * @param image - The grey image.
 * @param algorithm - Algorithm that defines the threshold.
 * @returns The threshold value for the image.
 */
export function computeThreshold(
  image: IJS,
  algorithm: ThresholdAlgorithm,
): number {
  if (image.channels !== 1) {
    throw new Error(
      'threshold can only be computed on images with one channel',
    );
  }
  const histogram = image.histogram();

  switch (algorithm) {
    case ThresholdAlgorithm.OTSU:
      return otsu(histogram, image.size);
    case ThresholdAlgorithm.TRIANGLE:
      return triangle(histogram);
    default:
      throw new RangeError(`unsupported threshold algorithm: ${algorithm}`);
  }
}

// TODO: add support for other threshold types.
// See: https://docs.opencv.org/4.0.1/d7/d1b/group__imgproc__misc.html#gaa9e58d2860d4afa658ef70a9b1115576
/**
 * Create a black and white image based on a threshold value.
 *
 * @param image - The grey image to convert.
 * @param options - Threshold options.
 * @returns The converted image.
 */
export function threshold(image: IJS, options: ThresholdOptions): IJS {
  let thresholdValue: number;
  if ('threshold' in options) {
    thresholdValue = options.threshold;
  } else {
    thresholdValue = computeThreshold(image, options.algorithm);
  }

  validateValue(thresholdValue, image);
  const result = getOutputImage(image, options);
  for (let i = 0; i < image.size; i++) {
    result.setValueByIndex(
      i,
      0,
      image.getValueByIndex(i, 0) > thresholdValue ? image.maxValue : 0,
    );
  }
  return result;
}
