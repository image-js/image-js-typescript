import { Image } from '../Image';

import { copyTo } from './copyTo';

/**
 * Adds padding to the image.
 * @param image - Target image.
 * @param padSize - Padding thickness.
 * @param color - Padding color.
 * @returns image with padding.
 */
export function pad(image: Image, padSize: number, color: number[]): Image {
  if (color.length !== image.channels) {
    throw new RangeError('the given color is not compatible with the image');
  }
  const newWidth = image.width + padSize * 2;
  const newHeight = image.height + padSize * 2;

  let result = Image.createFrom(image, {
    width: newWidth,
    height: newHeight,
  });
  result.fill(color);
  result = copyTo(image, result, { origin: { column: padSize, row: padSize } });

  return result;
}
