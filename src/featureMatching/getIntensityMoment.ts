import { Image } from '../Image';
import { Point } from '../geometry';

export interface GetIntensityMomentOptions {
  /**
   * Origin for the moment computation.
   *
   * @default The center of the image.
   */
  origin?: Point;
}

/**
 * Compute the pq order intensity moment of the image.
 *
 * @param image - Image to process. Should have an odd number of rows and columns.
 * @param p - Order along x.
 * @param q - Order along y.
 * @param options - Get intensity moment options.
 * @returns The intensity moment of order pq.
 */
export function getIntensityMoment(
  image: Image,
  p: number,
  q: number,
  options: GetIntensityMomentOptions = {},
) {
  if (image.height % 2 || image.width % 2) {
    throw new Error('getIntensityMoment: image dimensions should be odd');
  }
  const { origin = { row: image.height / 2, column: image.width / 2 } } =
    options;

  let moment = 0;
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      const xDistance = row - origin.row;
      const yDistance = column - origin.column;
      const intensity = image.getValue(row, column, 0);

      moment += xDistance ** p * yDistance ** q * intensity;
    }
  }
  return moment;
}
