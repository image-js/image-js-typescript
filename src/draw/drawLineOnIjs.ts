import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';
import { Point } from '../utils/types';

export interface DrawLineOnIjsOptions {
  /**
   * Color of the line. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default 'black'
   */
  strokeColor?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}

/**
 * Draw a line defined by two points onto an image.
 *
 * @param image - Image to process.
 * @param from - Line starting point.
 * @param to - Line ending point.
 * @param options - Draw Line options.
 * @returns The mask with the line drawing.
 */
export function drawLineOnIjs(
  image: IJS,
  from: Point,
  to: Point,
  options: DrawLineOnIjsOptions = {},
): IJS {
  const newImage = getOutputImage(image, options, { clone: true });
  const { strokeColor: color = getDefaultColor(newImage) } = options;

  checkProcessable(newImage, 'drawLine', {
    bitDepth: [8, 16],
  });

  if (from.column === to.column && from.row === to.row) {
    return newImage;
  }
  let { row, column } = from;
  const { row: rowEnd, column: columnEnd } = to;

  const dColumn = Math.abs(columnEnd - column);
  const columnIncrement = column < columnEnd ? 1 : -1;
  const dRow = -Math.abs(rowEnd - row);
  const rowIncrement = row < rowEnd ? 1 : -1;
  let err = dColumn + dRow;
  let drawing = true;
  let e2;

  while (drawing) {
    newImage.setPixel(column, row, color);
    e2 = 2 * err;
    if (e2 >= dRow) {
      if (column === columnEnd) {
        drawing = false;
      } else {
        err += dRow;
        column += columnIncrement;
      }
    }
    if (e2 <= dColumn) {
      if (row === rowEnd) {
        drawing = false;
      } else {
        err += dColumn;
        row += rowIncrement;
      }
    }
  }

  return newImage;
}
