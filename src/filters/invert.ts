import { IJS } from '../IJS';
import { getOutputImage } from '../utils/getOutputImage';

export interface IInvertOptions {
  out?: IJS;
}

/**
 * Invert the colors of an image.
 * @param image - The image to invert.
 */
export function invert(image: IJS, options?: IInvertOptions): IJS {
  const newImage = getOutputImage(image, options);
  const { maxValue } = newImage;
  for (let i = 0; i < newImage.size; i++) {
    for (let c = 0; c < newImage.channels; c++) {
      newImage.setValueByIndex(i,c, maxValue - image.getValueByIndex(i,c));
    }
  }

   return newImage;
}
