import { IJS } from '../IJS';
import { getOutputImage } from '../utils/getOutputImage';

export interface InvertOptions {
  /**
   * Image to which the inverted image has to be put.
   */
  out?: IJS;
}

/**
 * Invert the colors and the alpha channel (if applicable) of an image.
 *
 * @param image - The image to invert.
 * @param options - Invert options.
 * @returns The inverted image.
 */

export function invert(image: IJS, options?: InvertOptions): IJS {
  const newImage = getOutputImage(image, options);
  const { maxValue } = newImage;
  for (let i = 0; i < newImage.size; i++) {
    for (let channel = 0; channel < image.channels; channel++) {
      newImage.setValueByIndex(
        i,
        channel,
        maxValue - image.getValueByIndex(i, channel),
      );
    }
  }

  return newImage;
}
