import { Image } from '../Image';
import { Point } from '../geometry';

export interface MeanOptions {
  /**
   * Points to calculate mean from.
   */
  points: Point[];
}

/**
 * Compute the mean of an image. The mean can be either computed on each channel
 * individually or on the whole image.
 * @param image - Image to process.
 * @param options - Mean options.
 * @returns The mean pixel.
 */
export function mean(image: Image, options?: MeanOptions): number[] {
  const pixelSum = new Array<number>(image.channels).fill(0);
  const nbValues = options ? options.points.length : image.size;
  if (options) {
    for (const point of options.points) {
      for (let channel = 0; channel < image.channels; channel++) {
        pixelSum[channel] += image.getValueByPoint(point, channel);
      }
    }
  } else {
    for (let row = 0; row < image.height; row++) {
      for (let column = 0; column < image.width; column++) {
        for (let channel = 0; channel < image.channels; channel++) {
          pixelSum[channel] += image.getValue(column, row, channel);
        }
      }
    }
  }
  return pixelSum.map((channelSum) => channelSum / nbValues);
}
