import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';

/**
 * Apply a flipY filter to an image.
 *
 * @param image - Image to process.
 * @returns The processed image.
 */
export default function flipY(image: IJS): IJS {
  checkProcessable(image, 'flipY', {
    bitDepth: [8, 16],
  });

  for (let i = 0; i < Math.floor(image.height / 2); i++) {
    for (let j = 0; j < image.width; j++) {
      const ligneCurrent = i;
      const ligneOpposite = image.height - i - 1;
      const tmp = image.getPixel(ligneCurrent, j);
      image.setPixel(ligneCurrent, j, image.getPixel(ligneOpposite, j));
      image.setPixel(ligneOpposite, j, tmp);
    }
  }

  return image;
}
