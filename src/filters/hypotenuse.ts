import { colorModels, IJS } from '..';
import checkProcessable from '../utils/checkProcessable';
import { validateChannels } from '../utils/validators';

export interface HypotenuseOptions {
  depth?: number;
  /**
   * To which channels to apply the filter. By default all but alpha.
   */
  channels?: number[];
}

/**
 * Calculate a new image that is the hypotenuse between the current image and the otherImage.
 *
 * @param image - First image to process.
 * @param otherImage - Second image.
 * @param options - Hypotenuse options.
 * @returns Hypotenuse of the two images.
 */
export default function hypotenuse(
  image: IJS,
  otherImage: IJS,
  options: HypotenuseOptions = {},
): IJS {
  let { depth = image.depth, channels } = options;

  for (let i = 0; i < image.components; i++) {
    channels.push(i);
  }

  checkProcessable(image, 'hypotenuse', {
    bitDepth: [8, 16, 32],
  });

  if (image.width !== otherImage.width || image.height !== otherImage.height) {
    throw new Error('hypotenuse: both images must have the same size');
  }
  if (image.alpha !== otherImage.alpha || image.depth !== otherImage.depth) {
    throw new Error(
      'hypotenuse: both images must have the same alpha and bitDepth',
    );
  }
  if (image.channels !== otherImage.channels) {
    throw new Error(
      'hypotenuse: both images must have the same number of channels',
    );
  }

  let newImage = IJS.createFrom(image, { depth });

  validateChannels(channels, image);

  let clamped = newImage.isClamped;

  for (const channel of channels) {
    for (let i = channel; i < image.size; i += image.channels) {
      let value = Math.hypot(image.data[i], otherImage.data[i]);
      if (clamped) {
        // we calculate the clamped result
        newImage.data[i] = Math.min(
          Math.max(Math.round(value), 0),
          newImage.maxValue,
        );
      } else {
        newImage.data[i] = value;
      }
    }
  }

  return newImage;
}
