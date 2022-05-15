import { IJS } from '../IJS';

import { ImageColorModel } from './colorModels';

/**
 * Get black color in image color modal
 *
 * @param image - The used image
 * @returns Black color
 */
export function getDefaultColor(image: IJS): number[] {
  if (image.colorModel === ImageColorModel.GREY) return [0];
  if (image.colorModel === ImageColorModel.GREYA) return [0, image.maxValue];
  if (image.colorModel === ImageColorModel.RGB) return [0, 0, 0];
  if (image.colorModel === ImageColorModel.RGBA) {
    return [0, 0, 0, image.maxValue];
  }
  throw new Error(`image color model ${image.colorModel} is not compatible`);
}
