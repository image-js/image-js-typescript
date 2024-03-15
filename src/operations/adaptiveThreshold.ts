import { Image } from '../Image';
import { Mask } from '../Mask';

/**
 *
 * @param image
 * @param kernelSize
 * @param constant
 */
export function adaptiveThreshold(
  image: Image,
  kernelSize: number,
  constant: number,
): Mask {
  const mask = new Mask(image.width, image.height);
  const convolvedImage = image.blur({ width: 3, height: 3 });
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      if (
        image.getValue(column, row, 0) >
        convolvedImage.getValue(column, row, 0) - constant
      ) {
        mask.setBit(column, row, 1);
      }
    }
  }
  return mask;
}
