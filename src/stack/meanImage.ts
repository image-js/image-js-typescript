import { Image, ImageDataArray } from '../Image';
import { Stack } from '../Stack';

import { checkProcessable } from './utils/checkProcessable';

/**
 *  Returns a new image with the average values of each pixel of the images of the stack.
 * @param stack - Stack to process.
 * @returns The mean image.
 */
export function meanImage(stack: Stack): Image {
  checkProcessable(stack, { sameSize: true, bitDepth: [8, 16] });

  const image = stack.getImage(0);
  const dataSize = image.size * stack.channels;
  const sum = new Uint32Array(dataSize).fill(0);

  for (let i = 0; i < stack.size; i++) {
    for (let j = 0; j < image.size; j++) {
      for (let channel = 0; channel < stack.channels; channel++) {
        sum[j * stack.channels + channel] += stack.getValueByIndex(
          i,
          j,
          channel,
        );
      }
    }
  }

  let meanArray: ImageDataArray;
  switch (image.bitDepth) {
    case 8:
      meanArray = new Uint8Array(dataSize);
      break;
    case 16:
      meanArray = new Uint16Array(dataSize);
      break;
    default:
      throw new Error('unknown bitDepth');
  }
  for (let i = 0; i < image.size; i++) {
    for (let channel = 0; channel < stack.channels; channel++) {
      const index = i * stack.channels + channel;
      meanArray[index] = sum[index] / stack.size;
    }
  }

  return new Image(image.width, image.height, {
    data: meanArray,
    colorModel: stack.colorModel,
  });
}
