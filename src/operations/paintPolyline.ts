import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getOutputImage } from '../utils/getOutputImage';

export interface Point {
  /**
   * point row
   *
   */
  row: number;
  /**
   * point column
   *
   */
  column: number;
}
export interface PaintPolylineOptions {
  /**
   * Array of 3 elements (R, G, B),or 4 elements (R, G, B, A) default is red.
   *
   * @default [image.maxValue, 0, 0]
   */
  color?: [number, number, number] | [number, number, number, number];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}
/**
 * Paint a polyline defined by an array of points.
 *
 * @memberof Image
 * @instance
 * @param image - Image to process.
 * @param points - Polyline points.
 * @param options - Paint Line options.
 * @returns The original painted image
 */
export function paintPolyline(
  image: IJS,
  points: Point[],
  options: PaintPolylineOptions = {},
) {
  let newImage = getOutputImage(image, options, { clone: true });

  const { color = [newImage.maxValue, 0, 0] } = options;
  checkProcessable(newImage, 'paintPolyline', {
    bitDepth: [8, 16],
  });

  const numberChannels = Math.min(newImage.channels, color.length);
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    // todo: use paintLine here
    const dx = to.row - from.row;
    const dy = to.column - from.column;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = from.row;
    let y = from.column;

    for (let j = 0; j <= steps; j++) {
      const xPoint = Math.round(x);
      const yPoint = Math.round(y);
      if (
        xPoint >= 0 &&
        yPoint >= 0 &&
        xPoint < newImage.height &&
        yPoint < newImage.width
      ) {
        for (let channel = 0; channel < numberChannels; channel++) {
          newImage.setValue(xPoint, yPoint, channel, color[channel]);
        }
      }

      x = x + xIncrement;
      y = y + yIncrement;
    }
  }
  return newImage;
}
