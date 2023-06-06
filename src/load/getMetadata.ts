import { decode } from 'tiff';

type TiffIfd = ReturnType<typeof decode>[number];

export interface ImageMetadata {
  tiff: {
    fields: Map<number, unknown>;
    tags: Record<string, unknown>;
  };
  exif: Record<string, unknown>;
}

export function getMetadata(ifd: TiffIfd) {
  return {
    tiff: {
      fields: ifd.fields,
      tags: ifd.map,
    },
    exif: ifd.exif as unknown as Record<string, unknown>,
  };
}
