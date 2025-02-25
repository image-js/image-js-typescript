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
const binaryString = new TextDecoder('latin1').decode(Uint8Array.from(buffer));
const base64String = btoa(binaryString);
return `data:image/${format};base64,${base64String}`;
}

