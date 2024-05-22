import { Image } from '../Image';

/**
 *
 * @param image
 * @param padSize
 */
export function pad(image: Image, padSize: number) {
  const newWidth = image.width + padSize;
  const newHeight = image.height + padSize;

  const result = new Image(newWidth, newHeight, {
    colorModel: image.colorModel,
    bitDepth: image.bitDepth,
  });
}
