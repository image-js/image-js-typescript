import { Image, Point } from '..';
import { getOutputImage } from '../utils/getOutputImage';

export interface PixelateOptions {
  /**
   *  range of pixelated area
   */
  cellSize: number;
  /**
   * Image to which to output.
   */
  out?: Image;
}

interface CenterOptions {
  width: number;
  height: number;
  origin: Point;
}

/**
 *Function to pixelate an image
 *
 * @param image - image to be pixelated
 * @param options
 * @returns pixelated Image
 */
export function pixelate(image: Image, options: PixelateOptions): Image {
  const { cellSize } = options;
  const newImage = getOutputImage(image, options);

  for (let channel = 0; channel < image.channels; channel++) {
    for (let column = 0; column < image.width; column += cellSize) {
      for (let row = 0; row < image.height; row += cellSize) {
        const currentCellWidth = Math.min(cellSize, image.width - column);
        const currentCellHeight = Math.min(cellSize, image.height - row);
        //first case: image gets pixelated without any small parts remaining

        const center = getCenter({
          width: currentCellWidth,
          height: currentCellHeight,
          origin: {
            column,
            row,
          },
        });

        const value = image.getValue(center.column, center.row, channel);

        for (
          let newColumn = column;
          newColumn < column + currentCellWidth;
          newColumn++
        ) {
          for (let newRow = row; newRow < row + currentCellHeight; newRow++) {
            newImage.setValue(newColumn, newRow, channel, value);
          }
        }
      }
    }
  }

  return newImage;
}

/**
 *Find the center of a rectangle to be pixelated
 *
 * @param width - width of a rectangle to change
 * @param height - height of a rectangle to change
 * @param origin - top left corner of a rectangle
 * @param options
 * @returns Point
 */
function getCenter(options: CenterOptions): Point {
  const center = {
    column: Math.floor(
      (options.origin.column + options.origin.column + options.width - 1) / 2,
    ),
    row: Math.floor(
      (options.origin.row + options.origin.row + options.height - 1) / 2,
    ),
  };

  return center;
}
