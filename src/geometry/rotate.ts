import { IJS, ImageCoordinates } from '../IJS';
import { BorderType } from '../utils/interpolateBorder';
import { InterpolationType } from '../utils/interpolatePixel';

import { transform } from './transform';

export interface RotateOptions {
  center?: ImageCoordinates | [number, number];
  scale?: number;
  width?: number;
  height?: number;
  /*
    Bypasses width, height, and center options to include
    every pixel of the original image inside the rotated image
  */
  fullImage?: boolean;
  interpolationType?: InterpolationType;
  borderType?: BorderType;
  borderValue?: number;
}

/**
 * Rotate an image of a given angle.
 *
 * @param image - Original image.
 * @param angle - Angle in degrees.
 * @param options - Rotate options.
 * @returns A new rotated image.
 */
export function rotate(
  image: IJS,
  angle: number,
  options: RotateOptions = {},
): IJS {
  const { center = ImageCoordinates.CENTER, scale = 1 } = options;

  let centerCoordinates;
  if (typeof center === 'string') {
    centerCoordinates = image.getCoordinates(center);
  } else {
    centerCoordinates = center;
  }
  const transformMatrix = getRotationMatrix(angle, centerCoordinates, scale);

  return transform(image, transformMatrix, options);
}

/**
 * Generates a rotation matrix for the given angle.
 *
 * @param angle - Angle in degrees.
 * @param center - Center point of the image.
 * @param scale - Scalinf factor.
 * @returns Rotation matrix.
 */
function getRotationMatrix(
  angle: number,
  center: [number, number],
  scale: number,
): number[][] {
  const angleRadians = (angle * Math.PI) / 180;
  const alpha = scale * Math.cos(angleRadians);
  const beta = scale * Math.sin(angleRadians);
  return [
    [alpha, beta, (1 - alpha) * center[0] - beta * center[1]],
    [-beta, alpha, beta * center[0] + (1 - alpha) * center[1]],
  ];
}
