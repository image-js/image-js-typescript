import { Image } from '../Image';

import {
  FastKeypoint,
  getFastKeypoints,
  GetFastKeypointsOptions,
} from './getFastKeypoints';

export interface GetOrientedFastKeypointsOptions
  extends GetFastKeypointsOptions {}

export interface OrientedFastKeypoint extends FastKeypoint {
  /**
   * Anti-clockwise angle of the keypoint in degrees with regard to a horizontal line.
   */
  angle: number;
}

/**
 * Find the oriented FAST features in a GREY image.
 * How to add orientation to FAST is described in: http://www.gwylab.com/download/ORB_2012.pdf
 * Basically, the intensity centroid of the window around the corner is computed and the
 * orientation is given by the vector from the center to the intensity centroid.
 *
 * @param image - The image to process.
 * @param options - Get oriented FAST keypoints options.
 * @returns The oriented FAST keypoints.
 */
export function getOrientedFastKeypoints(
  image: Image,
  options: GetOrientedFastKeypointsOptions = {},
): OrientedFastKeypoint[] {
  const { windowSize = 7 } = options;

  const fastKeypoints = getFastKeypoints(image, options);
}
