import { encode, PngEncoderOptions } from 'fast-png';

import { Image } from '../Image';

export type EncodePngOptions = PngEncoderOptions;

/**
 * Creates a PNG buffer from an image.
 * @param image - The image instance.
 * @param options - PNG encoding options.
 * @returns The buffer.
 */
export function encodePng(
  image: Image,
  options?: EncodePngOptions,
): Uint8Array {
  return encode(
    {
      data: image.getRawImage().data,
      width: image.getRawImage().width,
      height: image.getRawImage().height,
      channels: image.getRawImage().channels,
      depth: image.getRawImage().bitDepth,
    },
    options,
  );
}
