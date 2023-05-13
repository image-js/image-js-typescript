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
    for (let i = 0; i < image.width; i += cellSize) {
      for (let j = 0; j < image.height; j += cellSize) {
        const currentCellWidth = Math.min(cellSize, image.width - i);
        const currentCellHeight = Math.min(cellSize, image.height - j);
        //first case: image gets pixelated without any small parts remaining

        const center = getCenter(currentCellWidth, currentCellHeight, {
          column: i,
          row: j,
        });

        const value = image.getValue(center.column, center.row, channel);

        for (let n = i; n < i + currentCellWidth; n++) {
          for (let k = j; k < j + currentCellHeight; k++) {
            newImage.setValue(n, k, channel, value);
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
 * @returns Point
 */
function getCenter(width: number, height: number, origin: Point): Point {
  const center = {
    column: Math.floor((origin.column + origin.column + width - 1) / 2),
    row: Math.floor((origin.row + origin.row + height - 1) / 2),
  };

  return center;
}
