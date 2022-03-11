import { IJS } from '..';
import {
  PREWITT_X,
  PREWITT_Y,
  ROBERTS_X,
  ROBERTS_Y,
  SCHARR_X,
  SCHARR_Y,
  SOBEL_X,
  SOBEL_Y,
} from '../utils/kernels';

export enum DerivativeFilters {
  SOBEL = 'SOBEL',
  SCHARR = 'SCHARR',
  PREWITT = 'PREWITT',
  ROBERTS = 'ROBERTS',
}

export interface DerivativeFilterOptions {
  /**
   * Algorithm to use for the derivative filter.
   */
  filter?: DerivativeFilters;
}

/**
 * Apply a derivative filter to an image.
 *
 * @param image - Image to process.
 * @param options - Derivative filter options.
 * @returns The processed image.
 */
export function derivativeFilter(
  image: IJS,
  options: DerivativeFilterOptions = {},
): IJS {
  const { filter = DerivativeFilters.SOBEL } = options;
  let kernelX = SOBEL_X;
  let kernelY = SOBEL_Y;

  switch (filter) {
    case DerivativeFilters.SOBEL:
      break;
    case DerivativeFilters.SCHARR:
      kernelX = SCHARR_X;
      kernelY = SCHARR_Y;
      break;
    case DerivativeFilters.PREWITT:
      kernelX = PREWITT_X;
      kernelY = PREWITT_Y;
      break;
    case DerivativeFilters.ROBERTS:
      kernelX = ROBERTS_X;
      kernelY = ROBERTS_Y;
      break;
    default:
      throw new Error('derivativeFilter: unrecognised derivative filter.');
  }

  return image.gradientFilter({ kernelX, kernelY });
}
