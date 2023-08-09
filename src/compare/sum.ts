import { Image } from '..';
import checkProcessable from '../utils/validators/checkProcessable';
import { validateForComparison } from '../utils/validators/validators';
/**
 *
 * Calculate a new image that is the sum between the current image and the otherImage.
 * @param image - Image to which to add.
 * @param otherImage - Image to add.
 * @returns The summed image.
 */
export function sum(image: Image, otherImage: Image): Image {
  if (image instanceof Image) {
    checkProcessable(image, {
      bitDepth: [1, 8, 16],
      components: [1, 3],
      alpha: false,
    });
  }

  validateForComparison(image, otherImage);

  const newImage = image.clone();
  for (let index = 0; index < image.size; index++) {
    for (let channel = 0; channel < image.channels; channel++) {
      const value =
        image.getValueByIndex(index, channel) +
        otherImage.getValueByIndex(index, channel);

      newImage.setValueByIndex(index, channel, Math.min(value, image.maxValue));
    }
  }
  return newImage;
}
