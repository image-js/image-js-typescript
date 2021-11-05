import { IJS, ImageColorModel } from '..';
import { getClamp } from '../utils/clamp';

import * as greyAlgorithms from './greyAlgorithms';

export type GreyAlgorithms = keyof typeof greyAlgorithms;

export type GreyAlgorithmCallback = (
  red: number,
  green: number,
  blue: number,
  image: IJS,
) => number;

export interface GreyOptions {
  algorithm?: GreyAlgorithms | GreyAlgorithmCallback;
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

  keepAlpha = keepAlpha && image.alpha;
  mergeAlpha = mergeAlpha && image.alpha;
  if (keepAlpha) {
    mergeAlpha = false;
  }

  let newColorModel = keepAlpha ? ImageColorModel.GREYA : ImageColorModel.GREY;
  let newImage = IJS.createFrom(image, {
    colorModel: newColorModel,
  });

  let method: GreyAlgorithmCallback;
  if (typeof algorithm === 'function') {
    method = algorithm;
  } else {
    // eslint-disable-next-line import/namespace
    method = greyAlgorithms[algorithm];
    if (!method) {
      throw new Error(`unsupported grey algorithm: ${algorithm}`);
    }
  }

  let clamp = getClamp(newImage);

  for (let i = 0; i < image.size; i++) {
    const red = image.getValueByIndex(i, 0);
    const green = image.getValueByIndex(i, 1);
    const blue = image.getValueByIndex(i, 2);
    const alpha = image.getValueByIndex(i, 3);
    let newValue;
    if (mergeAlpha) {
      newValue = clamp(
        (method(red, green, blue, image) * alpha) / image.maxValue,
      );
    } else {
      newValue = clamp(method(red, green, blue, image));
      if (keepAlpha) {
        newImage.setValueByIndex(
          i,
          newImage.channels - 1,
          image.getValueByIndex(1, image.channels - 1),
        );
      }
    }
    newImage.setValueByIndex(i, 0, newValue);
  }

  return newImage;
}
