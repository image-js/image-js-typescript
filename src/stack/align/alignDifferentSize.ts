import { Image, Point } from '../..';
import { prepareForAlign } from '../../align/align';

export interface AlignDifferentSizeOptions {
  xFactor?: number;
  yFactor?: number;
  /**
   * Scaling factor for rough alignment.
   * @default 4
   */
  scalingFactor?: number;
}

/**
 *
 * @param source
 * @param destination
 * @param options
 */
export function alignDifferentSize(
  source: Image,
  destination: Image,
  options: AlignDifferentSizeOptions,
): Point {
  const { xFactor = 0.5, yFactor = 0.5, scalingFactor = 4 } = options;

  const leftRightMargin = Math.round(xFactor * source.width);
  const topBottomMargin = Math.round(yFactor * source.height);

  // Rough alignment
  const small = prepareForAlign(source, { scalingFactor });
}
