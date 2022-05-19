import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

import { Point } from './paintLine';

export interface PaintPolygonOptions {
  /**
   * Array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  color?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
}
/**
 * Paint a polygon defined by an array of points.
 *
 * @memberof Image
 * @instance
 * @param image - Image to process.
 * @param points - Polygon points.
 * @param options - Paint Line options.
 * @returns The original painted image
 */
export function paintPolygon(
  image: IJS,
  points: Point[],
  options: PaintPolygonOptions = {},
) {
  let newImage = getOutputImage(image, options, { clone: true });

  const { color = getDefaultColor(image) } = options;
  checkProcessable(newImage, 'paintPolyline', {
    bitDepth: [8, 16],
  });

  const numberChannels = Math.min(newImage.channels, color.length);
  for (let i = 0; i < points.length; i++) {
    const from = points[i];
    const to = points[i < points.length - 1 ? i + 1 : 0];

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
  //TODO :Scan Line fill polygone

  return newImage;
}
