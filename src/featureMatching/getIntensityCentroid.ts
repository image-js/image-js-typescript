import { Image } from '../Image';
import { Point } from '../geometry';

import { getIntensityMoment } from './getIntensityMoment';

/**
 * Compute the intensity centroid of an image for each channel.
 * The algorithm comes from the ORB article DOI: 10.1109/ICCV.2011.6126544,
 * but is also described on Wikipedia:
 *
 * @see {@link https://en.wikipedia.org/wiki/Image_moment}
 * @param image - Image to process.
 * @returns The intensity centroid of each channel of the image.
 */
export function getIntensityCentroid(image: Image): Point[] {
  const moment10 = getIntensityMoment(image, 1, 0);
  const moment01 = getIntensityMoment(image, 0, 1);
  const moment00 = getIntensityMoment(image, 0, 0);
  let centroid: Point[] = [];

  for (let channel = 0; channel < image.channels; channel++) {
    if (moment00[channel] === 0) {
      centroid.push({
        column: 0,
        row: 0,
      });
    } else {
      centroid.push({
        column: moment10[channel] / moment00[channel],
        row: moment01[channel] / moment00[channel],
      });
    }
  }

  return centroid;
}
