//@ts-expect-error ts package not ready yet
import * as bmp from 'fast-bmp';

import { Mask } from '../Mask';

/**
 *
 * @param image
 * @param options
 * @param mask
 */
export function encodeBmp(mask: Mask) {
  return bmp.encode(mask);
}
