import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

import { Point } from './paintLine';

export interface PaintRectangleOptions {
  /**
   * Rectangle border color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  color?: number[];
  /**
   * rectangle fill color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  fill?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}
/**
 * Paint a rectangle defined by position, width and height.
 *
 * @memberof Image
 * @instance
 * @param image - Image to process.
 * @param position - Rectangle position.
 * @param width - Rectangle width.
 * @param height - Rectangle height.
 * @param options - Paint Line options.
 * @returns The original painted image
 */
export function paintRectangle(
  image: IJS,
  position: Point,
  width: number,
  height: number,
  options: PaintRectangleOptions = {},
) {
  let newImage = getOutputImage(image, options, { clone: true });
  const { color = getDefaultColor(image), fill = getDefaultColor(image) } =
    options;

  checkProcessable(newImage, 'paintPoints', {
    bitDepth: [8, 16],
  });

  for (let i = position.column; i < position.column + width; i++) {
    if (i === position.column || i === position.column + width - 1) {
      newImage.paintLine(
        { row: position.row, column: i },
        { row: position.row + height - 1, column: i },
        { color, out: newImage },
      );
    } else {
      if (position.row + 1 <= position.row + height - 2) {
        newImage.paintLine(
          { row: position.row + 1, column: i },
          { row: position.row + height - 2, column: i },
          { color: fill, out: newImage },
        );
        newImage.setPixel(position.row, i, color);
        newImage.setPixel(position.row + height - 1, i, color);
      } else {
        newImage.paintLine(
          { row: position.row, column: i },
          { row: position.row + height - 1, column: i },
          { color, out: newImage },
        );
      }
    }
  }
  return newImage;
}
