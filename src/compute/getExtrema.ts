import { Image, Mask, Point } from '..';
import { assertUnreachable } from '../utils/validators/assert';
import checkProcessable from '../utils/validators/checkProcessable';

interface ExtremaOptions {
  /**
   * Chooses what kind of extremum to compute.
   * @default 'maximum'
   */
  kind?: 'minimum' | 'maximum';
  /**
   * Uses mask to check if a point belongs to a ROI or not
   */
  mask?: Mask;
  /**
   * Chooses what kind of coverage algorithm to use to compute the extremum.
   * @default 'star'
   */
  algorithm?: 'cross' | 'square' | 'star';
  /**
   * Maximum number of points that can be equal to the extremum
   * @default 2
   */
  maxEquals?: number;
}
/**
 * Checks the surrounding values of a point. If they are all bigger or smaller than the pixel in question then this point is considered an extremum.
 * @param image - Image to find extrema from.
 * @param options - ExtremaOptions
 * @returns Array of Points.
 */
export default function getExtrema(
  image: Image,
  options: ExtremaOptions,
): Point[] {
  let { kind = 'maximum', mask, algorithm = 'star', maxEquals = 2 } = options;
  checkProcessable(image, {
    bitDepth: [8, 16],
    components: image.components,
  });
  let searchingMinimum = kind === 'minimum';

  let maskExpectedValue = searchingMinimum ? 0 : 1;

  const dx = [+1, 0, -1, 0, +1, +1, -1, -1, +2, 0, -2, 0, +2, +2, -2, -2];
  const dy = [0, +1, 0, -1, +1, -1, +1, -1, 0, +2, 0, -2, +2, -2, +2, -2];
  switch (algorithm) {
    case 'cross':
      dx.length = 4;
      dy.length = 4;
      break;
    case 'square':
      dx.length = 8;
      dy.length = 8;
      break;
    case 'star':
      break;
    default:
      assertUnreachable(algorithm);
  }
  let shift = dx.length <= 8 ? 1 : 2; // deal with borders
  let points: Point[] = [];
  for (let channel = 0; channel < image.channels; channel++) {
    for (let currentY = shift; currentY < image.height - shift; currentY++) {
      for (let currentX = shift; currentX < image.width - shift; currentX++) {
        if (mask && mask.getBit(currentX, currentY) !== maskExpectedValue) {
          continue;
        }
        let counter = 0;
        let nbEquals = 0;
        let currentValue = image.getValue(currentX, currentY, channel);
        for (let dir = 0; dir < dx.length; dir++) {
          if (searchingMinimum) {
            // we search for minima
            if (
              image.getValue(currentX + dx[dir], currentY + dy[dir], channel) >
              currentValue
            ) {
              counter++;
            }
          } else if (
            image.getValue(currentX + dx[dir], currentY + dy[dir], channel) <
            currentValue
          ) {
            counter++;
          }
          if (
            image.getValue(currentX + dx[dir], currentY + dy[dir], channel) ===
            currentValue
          ) {
            nbEquals++;
          }
        }
        if (counter + nbEquals === dx.length && nbEquals <= maxEquals) {
          points.push({ column: currentX, row: currentY });
        }
      }
    }
  }

  // TODO How to make a more performant and general way
  // we don't deal correctly here with groups of points that should be grouped if at the
  // beginning one of them is closer to another
  // Seems that we would ened to calculate a matrix and then split this matrix in 'independant matrices'
  // Or to assign a cluster to each point and regroup them if 2 clusters are close to each other
  // later approach seems much better
  return points;
}