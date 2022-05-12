import { IJS } from '../IJS';
import { copyAlpha } from '../operations';
import { copyData } from '../utils/copyData';
import { getOutputImage } from '../utils/getOutputImage';

import flipX from './flipX';
import flipY from './flipY';

export interface FlipOptions {
  /**
   * Image to which the resulting image has to be put.
   *
   * @default 'horizontal'
   */
  axis?: 'horizontal' | 'vertical' | 'both';
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}

/**
 *
 * Apply a flip filter to an image.
 *
 * @param image - Image to process.
 * @param options - Flip options.
 * @returns - The processed image.
 */
export function flip(image: IJS, options: FlipOptions = {}): IJS {
  const { axis = 'horizontal' } = options;
  let newImage = getOutputImage(image, options);
  copyData(image, newImage);
  if (image.alpha) {
    copyAlpha(image, newImage);
  }
  if (axis === 'horizontal') {
    return flipX(newImage);
  } else if (axis === 'vertical') {
    return flipY(newImage);
  } else {
    return flipY(flipX(newImage));
  }
}
