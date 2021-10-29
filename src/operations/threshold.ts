import { Image } from '../Image';
import { getOutputImage } from '../utils/getOutputImage';
import { validateValue } from '../utils/validators';

import { otsu } from './thresholds/otsu';
import { triangle } from './thresholds/triangle';

// TODO: convert more algorithms to TS.
export enum ThresholdAlgorithm {
  // HUANG,
  // INTERMODES,
  // ISODATA,
  // LI,
  // MAX_ENTROPY,
  // MEAN,
  // MIN_ERROR,
  // MINIMUM,
  // MOMENTS,
  OTSU = 'OTSU',
  // PERCENTILE,
  // RENYI_ENTROPY,
  // SHANBHAG,
  TRIANGLE = 'TRIANGLE',
  // YEN
}

interface IThresholdOptionsBase {
  out?: Image;
}

export interface IThresholdOptionsThreshold extends IThresholdOptionsBase {
  threshold: number;
}

export interface IThresholdOptionsAlgorithm extends IThresholdOptionsBase {
  algorithm: ThresholdAlgorithm;
}

export type ThresholdOptions =
  | IThresholdOptionsThreshold
  | IThresholdOptionsAlgorithm;

/**
 * @param image
 * @param algorithm
 */
export function computeThreshold(
  image: Image,
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
 * @param image
 * @param options
 */
export function threshold(image: Image, options: ThresholdOptions): Image {
  let thresholdValue: number;
  if ('threshold' in options) {
    thresholdValue = options.threshold;
  } else {
    thresholdValue = computeThreshold(image, options.algorithm);
  }

  validateValue(thresholdValue, image);
  const result = getOutputImage(image, options);
  for (let i = 0; i < image.data.length; i++) {
    result.data[i] = image.data[i] > thresholdValue ? image.maxValue : 0;
  }

  return result;
}
