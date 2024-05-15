//@ts-expect-error ts package not ready yet
import * as bmp from 'fast-bmp';

import { Mask } from '../Mask';

/**
 * Creates a BMP buffer from a mask.
 * @param mask - The mask instance.
 * @returns The buffer.
 */
export function encodeBmp(mask: Mask) {
  return bmp.encode(mask);
}
