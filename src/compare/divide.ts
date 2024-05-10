import { Image } from '../Image';
import { getOutputImage } from '../utils/getOutputImage';
import { validateChannels } from '../utils/validators/validators';

import { OperationBasedOptions } from './multiply';

interface DivideOptions extends OperationBasedOptions {}

/**
 *
 * Divides image pixels by a certain value.
 * @param image - image to which division will be applied.
 * @param value - Value by which each pixel will be divided.
 * @param options - Divide options
 * @returns image.
 */
export function divide(
  image: Image,
  value: number,
  options: DivideOptions = {},
) {
  const {
    channels = new Array(image.channels).fill(0).map((value, index) => index),
  } = options;
  validateChannels(channels, image);
  if (value === 0) {
    throw new TypeError(`Cannot divide by 0`);
  }
  const newImage = getOutputImage(image, options, { clone: true });
  if (channels.length === 0) {
    return newImage;
  }
  for (const channel of channels) {
    for (let row = 0; row < newImage.height; row++) {
      for (let column = 0; column < newImage.width; column++) {
        const newIntensity = newImage.getValue(column, row, channel) / value;
        newImage.setClampedValue(column, row, channel, newIntensity);
      }
    }
  }
  return newImage;
}
