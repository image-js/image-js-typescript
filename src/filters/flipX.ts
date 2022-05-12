import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';

/**
 * Apply a flipX filter to an image.
 *
 * @param image - Image to process.
 * @returns The processed image.
 */
export default function flipX(image: IJS): IJS {
  checkProcessable(image, 'flipX', {
    bitDepth: [8, 16],
  });
  for (let i = 0; i < image.height; i++) {
    for (let j = 0; j < Math.floor(image.width / 2); j++) {
      const colCurrent = j;
      const colOpposite = image.width - j - 1;
      const tmp = image.getPixel(i, colCurrent);
      image.setPixel(i, colCurrent, image.getPixel(i, colOpposite));
      image.setPixel(i, colOpposite, tmp);
    }
  }

  return image;
}
