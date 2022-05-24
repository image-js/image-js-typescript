import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

import { Point } from './drawLine';

export interface DrawCircleOptions {
  /**
   * Circle border color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  color?: number[];
  /**
   * Draw a filled circle.
   *
   * @default black
   */
  filled?: boolean;
  /**
   * Circle fill color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
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
 *
 * Draw a circle defined by center and radius.
 *
 * @param image - Image to process.
 * @param center - Circle center point.
 * @param radius - Circle radius.
 * @param options - Draw circle options.
 * @returns The original drawn image
 */
export function drawCircle(
  image: IJS,
  center: Point,
  radius: number,
  options: DrawCircleOptions = {},
): IJS {
  const newImage = getOutputImage(image, options, { clone: true });
  const {
    color = getDefaultColor(newImage),
    fill = getDefaultColor(newImage),
    filled = false,
  } = options;

  checkProcessable(newImage, 'paintPoints', {
    bitDepth: [8, 16],
  });

  const numberChannels = Math.min(newImage.channels, color.length);
  const p1 = { row: center.row, column: center.column - radius };
  const p2 = { row: center.row, column: center.column + radius };
  for (
    let column = center.column - radius;
    column <= center.column + radius;
    column++
  ) {
    let row = center.row;
    for (
      ;
      distanceSquare(p1, { row, column }) +
        distanceSquare(p2, { row, column }) <
      Math.pow(radius * 2, 2);
      row++
    ) {
      if (filled) {
        for (let channel = 0; channel < numberChannels; channel++) {
          newImage.setValue(column, row, channel, fill[channel]);
          newImage.setValue(
            column,
            2 * center.row - row, //  center.row - (row - center.row) (symmetric)
            channel,
            fill[channel],
          );
        }
      }
    }
    if (
      distanceSquare(p1, { row, column }) +
        distanceSquare(p2, { row, column }) ===
      Math.pow(radius * 2, 2)
    ) {
      for (let channel = 0; channel < numberChannels; channel++) {
        newImage.setValue(column, row, channel, color[channel]);
        newImage.setValue(
          column,
          2 * center.row - row, //  center.row - (row - center.row) (symmetric)
          channel,
          color[channel],
        );
      }
    } else {
      for (let channel = 0; channel < numberChannels; channel++) {
        newImage.setValue(column, row - 1, channel, color[channel]);
        newImage.setValue(
          column,
          2 * center.row - row + 1, //  center.row - (row - 1 - center.row) (symmetric)
          channel,
          color[channel],
        );
      }
    }
  }
  return newImage;
}
function distanceSquare(p1: Point, p2: Point) {
  return Math.pow(p1.row - p2.row, 2) + Math.pow(p1.column - p2.column, 2);
}
