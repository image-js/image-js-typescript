import { IJS, ImageColorModel } from '..';

import * as greyAlgorithms from './greyAlgorithms';

export interface GreyOptions {
  algorithm?: string;
  keepAlpha?: boolean;
  mergeAlpha?: boolean;
}
/**
 * Call back that converts the RGB channels to grey. It is clamped afterwards.
 *
 * @callback GreyAlgorithmCallback
 * @param {number} red - value of the red channel
 * @param {number} green - value of the green channel
 * @param {number} blue - value of the blue channel
 * @returns {number} value of the grey channel
 */

/**
 * Convert the current image to grayscale.
 * The source image has to be RGB or RGBA.
 * If there is an alpha channel you have to specify what to do:
 * keepAlpha :  keep the alpha channel, you will get a GREYA image
 * mergeAlpha : multiply each pixel of the image by the alpha
 *
 * @param image - Original image to convert to grey.
 * @param options - The grey conversion options.
 * @returns The grey image.
 */
export default function grey(image: IJS, options: GreyOptions = {}): IJS {
  let { algorithm = 'luma709', keepAlpha = false, mergeAlpha = true } = options;

  if (typeof algorithm !== 'string' && typeof algorithm !== 'function') {
    throw new TypeError('algorithm must be a string or a function');
  }

  if (
    image.colorModel !== ImageColorModel.RGB &&
    image.colorModel !== ImageColorModel.RGBA
  ) {
    throw new Error('Image color model is not RGB or RGBA');
  }

  if (image.components === 1) {
    algorithm = 'red'; // actually we just take the first channel if it is a grey image
  }

  keepAlpha = keepAlpha && image.alpha;
  mergeAlpha = mergeAlpha && image.alpha;
  if (keepAlpha) {
    mergeAlpha = false;
  }

  let newImage = getOutputImage(image, options, {
    components: 1,
    alpha: keepAlpha,
    colorModel: ImageColorModel.GREY,
  });

  let method;
  if (typeof algorithm === 'function') {
    method = algorithm;
  } else {
    method = methods[algorithm.toLowerCase()];
    if (!method) {
      throw new Error(`unsupported grey algorithm: ${algorithm}`);
    }
  }

  let ptr = 0;
  for (let i = 0; i < image.size; i++) {
    if (mergeAlpha) {
      newImage.data[ptr++] = clamp(
        (method(image.data[i], image.data[i + 1], image.data[i + 2], image) *
          image.data[i + image.components]) /
          image.maxValue,
        image,
      );
    } else {
      newImage.data[ptr++] = clamp(
        method(image.data[i], image.data[i + 1], image.data[i + 2], image),
        image,
      );
      if (newImage.alpha) {
        newImage.data[ptr++] = image.data[i + image.components];
      }
    }
  }

  return newImage;
}
