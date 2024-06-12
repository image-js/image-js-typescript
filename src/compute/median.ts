// @ts-expect-error: median-quisckselect has no types
import quickMedian from 'median-quickselect';

import { Image } from '../Image';
import { Point } from '../geometry';

export interface MedianOptions {
  /**
   * Points to calculate median from.
   */
  points: Point[];
}
/**
 * Returns the median pixel of the image. The median is computed on each channel individually.
 * @param image - Image to process.
 * @param options - Median options.
 * @returns Median pixel.
 */
export function median(image: Image, options?: MedianOptions): number[] {
  const pixel = new Array<number>(image.channels).fill(0);
  if (options) {
    //console.log(options.points.length);
    if (options.points.length === 0) {
      throw new RangeError('Array of coordinates is empty.');
    }
    for (let i = 0; i < image.channels; i++) {
      const channel: number[] = [];
      for (const point of options.points) {
        const index = point.row * image.width + point.column;
        if (index < 0 || index >= image.size) {
          throw new RangeError(
            `Invalid coordinate: {column: ${point.column}, row: ${point.row}}.`,
          );
        }
        channel.push(image.getValue(point.column, point.row, i));
      }
      pixel[i] = quickMedian(channel);
    }
  } else {
    for (let i = 0; i < image.channels; i++) {
      const channel = image.getChannel(i);
      pixel[i] = quickMedian(channel);
    }
  }

  return pixel;
}
