import { IJS } from '../IJS';
import { Mask } from '../Mask';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';
import { setBlendedPixel } from '../utils/setBlendedPixel';

export interface PaintMaskOptions {
  /**
   * X offset for the copy, the top left corner of the target image is the reference.
   *
   * @default 0
   */
  column?: number;
  /**
   * Y offset for the copy, the top left corner of the target image is the reference.
   *
   * @default 0
   */
  row?: number;
  /**
   * Color with which to blend the image pixel.
   *
   * @default Opaque black.
   */
  color?: number[];
  /**
   * Image to which to output.
   */
  out?: IJS;
}

/**
 * Paint a mask onto an image and the given position and with the given color.
 *
 * @param image - Image on which to paint the mask.
 * @param mask - Mask to paint on the image.
 * @param options - Paint mask options.
 * @returns The painted image.
 */
export function paintMask(
  image: IJS,
  mask: Mask,
  options: PaintMaskOptions = {},
): IJS {
  const { column = 0, row = 0, color = getDefaultColor(image) } = options;

  if (color.length !== image.channels) {
    throw new Error(
      'paintMask: the given color is not compatible with the image',
    );
  }

  const result = getOutputImage(image, options, { clone: true });

  for (
    let currentRow = Math.max(row, 0);
    currentRow < Math.min(mask.height + row, image.height);
    currentRow++
  ) {
    for (
      let currentColumn = Math.max(column, 0);
      currentColumn < Math.min(mask.width + column, image.width);
      currentColumn++
    ) {
      if (mask.getBit(currentColumn - column, currentRow - row)) {
        setBlendedPixel(result, currentColumn, currentRow, {
          color,
        });
      }
    }
  }

  return result;
}
