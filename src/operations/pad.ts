import { Image } from '../Image';

import { copyTo } from './copyTo';

/**
 * Adds padding to the image.
 * @param image - Target image.
 * @param pad
 * @param pad.vertPad
 * @param color - Padding color.
 * @param pad.horPad
 * @returns image with padding.
 */
export function pad(
  image: Image,
  pad: { vertPad: number; horPad: number },
  color: number[],
): Image {
  if (color.length !== image.channels) {
    throw new RangeError('the given color is not compatible with the image');
  }
  const newWidth = image.width + pad.vertPad * 2;
  const newHeight = image.height + pad.horPad * 2;

  let result = Image.createFrom(image, {
    width: newWidth,
    height: newHeight,
  });
  result.fill(color);
  result = copyTo(image, result, {
    origin: { column: pad.vertPad, row: pad.horPad },
  });

  return result;
}
