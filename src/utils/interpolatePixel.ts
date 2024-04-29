import { Image } from '../Image';

import { round } from './round';
import { BorderInterpolationFunction, ClampFunction } from './utils.types';

export const InterpolationType = {
  NEAREST: 'nearest',
  BILINEAR: 'bilinear',
  BICUBIC: 'bicubic',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type InterpolationType =
  (typeof InterpolationType)[keyof typeof InterpolationType];

interface InterpolationNeighbourFunctionOptions {
  /**
   * The image to interpolate.
   */
  image: Image;
  /**
   * column index.
   */
  column: number;
  /**
   * row index.
   */
  row: number;
  /**
   * channel index.
   */
  channel: number;
  /**
   * Border interpolation function.
   */
  interpolateBorder: BorderInterpolationFunction;
  /**
   * Clamp function.
   */
  clamp: ClampFunction;
}
type InterpolationNeighbourFunction = (
  options: InterpolationNeighbourFunctionOptions,
) => number;

/**
 * Get the interpolation neighbour function based on its name.
 * @param interpolationType - Specified interpolation type.
 * @returns The interpolation function.
 */
export function getInterpolationNeighbourFunction(
  interpolationType: InterpolationType,
): InterpolationNeighbourFunction {
  switch (interpolationType) {
    case 'nearest': {
      return interpolateNeighbourNearest;
    }
    case 'bilinear': {
      return interpolateNeighbourBilinear;
    }
    case 'bicubic': {
      return interpolateNeighbourBicubic;
    }
    default: {
      throw new RangeError(`invalid interpolationType: ${interpolationType}`);
    }
  }
}

/**
 * Interpolate using nearest neighbor.
 * @param options - configuration for interpolateNeighbourNearest
 * @returns The interpolated value.
 */
function interpolateNeighbourNearest(
  options: InterpolationNeighbourFunctionOptions,
): number {
  const { interpolateBorder, row, column, channel, image } = options;
  return interpolateBorder(Math.round(column), Math.round(row), channel, image);
}

/**
 * Interpolate using bilinear interpolation.
 * @param options - configuration for interpolateBilinear
 * @returns The interpolated value.
 */
function interpolateNeighbourBilinear(
  options: InterpolationNeighbourFunctionOptions,
): number {
  const { image, column, row, channel, interpolateBorder } = options;

  const px0 = Math.floor(column);
  const py0 = Math.floor(row);

  const px1 = px0 + 1;
  const py1 = py0 + 1;

  if (px1 < image.width && py1 < image.height && px0 >= 0 && py0 >= 0) {
    const vx0y0 = image.getValue(px0, py0, channel);
    const vx1y0 = image.getValue(px1, py0, channel);
    const vx0y1 = image.getValue(px0, py1, channel);
    const vx1y1 = image.getValue(px1, py1, channel);

    const r1 = (px1 - column) * vx0y0 + (column - px0) * vx1y0;
    const r2 = (px1 - column) * vx0y1 + (column - px0) * vx1y1;
    return round((py1 - row) * r1 + (row - py0) * r2);
  } else {
    const vx0y0 = interpolateBorder(px0, py0, channel, image);
    const vx1y0 = interpolateBorder(px1, py0, channel, image);
    const vx0y1 = interpolateBorder(px0, py1, channel, image);
    const vx1y1 = interpolateBorder(px1, py1, channel, image);

    const r1 = (px1 - column) * vx0y0 + (column - px0) * vx1y0;
    const r2 = (px1 - column) * vx0y1 + (column - px0) * vx1y1;
    return round((py1 - row) * r1 + (row - py0) * r2);
  }
}

/**
 * Interpolate using bicubic interpolation.
 * @param options - configuration for interpolateBilinear
 * @returns The interpolated value.
 */
function interpolateNeighbourBicubic(
  options: InterpolationNeighbourFunctionOptions,
): number {
  const { image, column, row, channel, interpolateBorder, clamp } = options;

  const px1 = Math.floor(column);
  const py1 = Math.floor(row);

  if (px1 === column && py1 === row) {
    return interpolateBorder(px1, py1, channel, image);
  }

  const xNorm = column - px1;
  const yNorm = row - py1;

  const vx0y0 = interpolateBorder(px1 - 1, py1 - 1, channel, image);
  const vx1y0 = interpolateBorder(px1, py1 - 1, channel, image);
  const vx2y0 = interpolateBorder(px1 + 1, py1 - 1, channel, image);
  const vx3y0 = interpolateBorder(px1 + 2, py1 - 1, channel, image);
  const v0 = cubic(vx0y0, vx1y0, vx2y0, vx3y0, xNorm);

  const vx0y1 = interpolateBorder(px1 - 1, py1, channel, image);
  const vx1y1 = interpolateBorder(px1, py1, channel, image);
  const vx2y1 = interpolateBorder(px1 + 1, py1, channel, image);
  const vx3y1 = interpolateBorder(px1 + 2, py1, channel, image);
  const v1 = cubic(vx0y1, vx1y1, vx2y1, vx3y1, xNorm);

  const vx0y2 = interpolateBorder(px1 - 1, py1 + 1, channel, image);
  const vx1y2 = interpolateBorder(px1, py1 + 1, channel, image);
  const vx2y2 = interpolateBorder(px1 + 1, py1 + 1, channel, image);
  const vx3y2 = interpolateBorder(px1 + 2, py1 + 1, channel, image);
  const v2 = cubic(vx0y2, vx1y2, vx2y2, vx3y2, xNorm);

  const vx0y3 = interpolateBorder(px1 - 1, py1 + 2, channel, image);
  const vx1y3 = interpolateBorder(px1, py1 + 2, channel, image);
  const vx2y3 = interpolateBorder(px1 + 1, py1 + 2, channel, image);
  const vx3y3 = interpolateBorder(px1 + 2, py1 + 2, channel, image);
  const v3 = cubic(vx0y3, vx1y3, vx2y3, vx3y3, xNorm);

  return round(clamp(cubic(v0, v1, v2, v3, yNorm)));
}

/**
 * Cubic function.
 * @param a - First value.
 * @param b - Second value.
 * @param c - Third value.
 * @param d - Fourth value.
 * @param x - X value.
 * @returns The interpolated value.
 */
function cubic(a: number, b: number, c: number, d: number, x: number): number {
  return (
    b +
    0.5 *
      x *
      (c - a + x * (2 * a - 5 * b + 4 * c - d + x * (3 * (b - c) + d - a)))
  );
}

interface InterpolationPositionFunctionOptions {
  /**
   * originalMax / targetMax
   */
  ratio: number;
  /**
   * (originalMax - 1) / (targetMax - 1)
   */
  minOneRatio: number;
  targetValue: number;
}
type InterpolationPositionFunction = (
  options: InterpolationPositionFunctionOptions,
) => number;

/**
 * Get the interpolation position function based on its name.
 * @param interpolationType - Specified interpolation type.
 * @returns The interpolation function.
 */
export function getInterpolationPositionFunction(
  interpolationType: InterpolationType,
): InterpolationPositionFunction {
  switch (interpolationType) {
    case 'nearest': {
      return interpolatePositionNearest;
    }
    case 'bilinear': {
      return interpolatePositionBilinear;
    }
    case 'bicubic': {
      return interpolatePositionBicubic;
    }
    default: {
      throw new RangeError(`invalid interpolationType: ${interpolationType}`);
    }
  }
}

function interpolatePositionNearest(
  options: InterpolationPositionFunctionOptions,
): number {
  const { targetValue, ratio } = options;
  return Math.floor((targetValue + 0.5) * ratio);
}

function interpolatePositionBilinear(
  options: InterpolationPositionFunctionOptions,
) {
  const { targetValue, minOneRatio } = options;
  return Math.round(targetValue * minOneRatio);
}

function interpolatePositionBicubic(
  options: InterpolationPositionFunctionOptions,
) {
  const { targetValue, minOneRatio } = options;
  return Math.round(targetValue * minOneRatio);
}
