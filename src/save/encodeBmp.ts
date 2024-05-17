//@ts-expect-error ts package not ready yet
import * as bmp from 'fast-bmp';

import { Mask } from '../Mask';

/**
 * Creates a BMP buffer from a mask.
 * @param mask - The mask instance.
 * @returns The buffer.
 */
export function encodeBmp(mask: Mask) {
  const encodedMask = new Uint8Array(Math.ceil(mask.size / 8));

  let destIndex = 0;
  for (let index = 0; index < mask.size; index++) {
    if (index % 8 === 0 && index !== 0) {
      destIndex++;
    }
    if (destIndex !== encodedMask.length - 1) {
      encodedMask[destIndex] <<= 1;
      encodedMask[destIndex] |= mask.getBitByIndex(index);
    } else {
      encodedMask[destIndex] |= mask.getBitByIndex(index);
      encodedMask[destIndex] <<= 7 - (index % 8);
    }
  }

  return bmp.encode({
    width: mask.width,
    height: mask.height,
    components: 1,
    bitDepth: 1,
    channels: 1,
    data: encodedMask,
  });
}
