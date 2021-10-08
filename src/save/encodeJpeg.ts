import { encode } from 'jpeg-js';

import { IJS, ImageKind, ColorDepth } from '../IJS';

export interface IEncodeJpegOptions {
  quality?: number;
}

export function encodeJpeg(
  image: IJS,
  options: IEncodeJpegOptions = {},
): Uint8Array {
  const { quality = 50 } = options;

  if (image.kind !== ImageKind.RGBA) {
    image = image.convertColor(ImageKind.RGBA);
  }
  if (image.depth !== ColorDepth.UINT8) {
    image = image.convertDepth(ColorDepth.UINT8);
  }

  // Image data after depth conversion will always be UInt8Array
  // @ts-ignore
  const buffer = encode(image, quality).data;
  return new Uint8Array(buffer, buffer.byteOffset, buffer.byteLength);
}
