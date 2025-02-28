import { toBase64 } from '@jsonjoy.com/base64';

import type { Image } from '../Image.js';

import { encode } from './encode.js';
import type { ImageFormat } from './encode.js';
/**
 * Converts image into a base64 URL string.
 * @param image - Image to get base64 encoding from.
 * @param format - Image format.
 * @returns base64 string.
 */
export function encodeBase64(image: Image, format: ImageFormat) {
  const buffer = encode(image, { format });
  const base64String = toBase64(buffer);
  const dataURL = `data:image/${format};base64,${base64String}`;
  return dataURL;
}
