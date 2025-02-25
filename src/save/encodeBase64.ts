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
  const binaryArray = [];
  for (const el of buffer) {
    binaryArray.push(String.fromCodePoint(el));
  }
  const binaryString = binaryArray.join('');
  const base64String = btoa(binaryString);
  const dataURL = `data:image/${format};base64,${base64String}`;
  return dataURL;
}
