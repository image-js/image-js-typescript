import { IJS } from '../IJS';
import { BorderType } from '../utils/interpolateBorder';

import { separableConvolution } from './convolution';

interface GaussianBlurBaseOptions {
  /**
   * Size of the kernel
   */
  size: number;
  /**
   * Specify how borders must be handled.
   */
  borderType?: BorderType;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}

export interface GaussianBlurSigmaOptions extends GaussianBlurBaseOptions {
  /**
   * The standard deviation. Specifies the width of the gaussian function in the case where it is the same for x and y.
   */
  sigma: number;
}

export interface GaussianBlurXYOptions extends GaussianBlurBaseOptions {
  /**
   * The standard deviation for the x axis. Specifies the width of the gaussian function along x.
   */
  sigmaX: number;
  /**
   * The standard deviation for the y axis. Specifies the width of the gaussian function along y.
   */
  sigmaY: number;
}

export type GaussianBlurOptions =
  | GaussianBlurSigmaOptions
  | GaussianBlurXYOptions;

function getRadius(size: number): number {
  if (size % 2 !== 1 || size < 0) {
    throw new Error('gaussian blur size must be positive and odd');
  }
  return (size - 1) / 2;
}

/**
 * Apply a gaussian filter to an image.
 *
 * @param image - Image to blur.
 * @param options - Gaussian blur options.
 * @returns The blurred image.
 */
export function gaussianBlur(image: IJS, options: GaussianBlurOptions): IJS {
  if ('sigma' in options) {
    const { size, sigma } = options;
    const radius = getRadius(size);
    const kernel = getKernel(radius, sigma);
    console.log({ kernel });
    return separableConvolution(image, kernel, kernel, {
      borderType: options.borderType,
    });
  } else {
    getRadius(options.size);
    const { sigmaX, sigmaY } = options;
    const radius = getRadius(options.size);
    const kernelX = getKernel(radius, sigmaX);
    const kernelY = getKernel(radius, sigmaY);
    return separableConvolution(image, kernelX, kernelY, {
      borderType: options.borderType,
    });
  }
}

function getKernel(radius: number, sigma: number): number[] {
  const n = radius * 2 + 1;
  const kernel = new Array(n);
  const sigmaX = sigma ? sigma : ((n - 1) * 0.5 - 1) * 0.3 + 0.8;
  const scale2X = -0.5 / (sigmaX * sigmaX);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x = i - radius;
    const t = Math.exp(scale2X * x * x);
    kernel[i] = t;
    sum += t;
  }

  for (let i = 0; i < n; i++) {
    kernel[i] /= sum;
  }
  return kernel;
}
