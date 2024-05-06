import { Image } from '../Image';
import { getOutputImage } from '../utils/getOutputImage';
import { validateChannels } from '../utils/validators/validators';

interface MultiplyOptions {
  /**
   * Channels where value will be multiplied.
   * @default all channels
   */
  channels?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
}

/**
 *
 * Multiplies points by a certain value.
 * @param image - image to whcih multiplication will be applied.
 * @param value - Value by which each pixel will be multiplied.
 * @param options - Multiply options
 * @returns image.
 */
export function multiply(
  image: Image,
  value: number,
  options: MultiplyOptions = {},
) {
  const {
    channels = new Array(image.components).fill(0).map((value, index) => index),
  } = options;
  validateChannels(channels, image);

  const newImage = getOutputImage(image, options, { clone: true });
  if (channels.length === 0) {
    return newImage;
  }
  for (let channel = 0; channel < channels.length; channel++) {
    for (let row = 0; row < newImage.height; row++) {
      for (let column = 0; column < newImage.width; column++) {
        const newIntensity =
          newImage.getValue(column, row, channels[channel]) * value;
        newImage.setClampedValue(column, row, channel, newIntensity);
      }
    }
  }
  return newImage;
}
