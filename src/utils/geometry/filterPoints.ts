import { Image } from '../..';

import { Point } from './points';

interface FilterPointsOptions {
  /**
   * The number of points that should be removed if they are close to extremum.
   */
  removeClosePoints: number;
  /**Shows what kind of extremum is being computed */
  kind: 'minimum' | 'maximum';
}
/**
 * Finds extreme values of an image which are not stacked together.
 *
 * @param points - Array of points that should be combined to improve.
 * @param image - Image which extrema are calculated from.
 * @param options - FilterPointsOptions
 * @returns Array of Points.
 */
export function filterPoints(
  points: Point[],
  image: Image,
  options: FilterPointsOptions,
) {
  let { removeClosePoints = 0, kind = 'maximum' } = options;
  const isMax = kind === 'maximum';

  let sortedPoints = points
    .sort((a, b) => {
      return Math.min(
        image.getValue(a.column, a.row, 0),
        image.getValue(b.column, b.row, 0),
      );
    })
    .reverse();

  if (removeClosePoints > 0) {
    for (let i = 0; i < sortedPoints.length; i++) {
      for (let j = i + 1; j < sortedPoints.length; j++) {
        if (
          Math.hypot(
            sortedPoints[i].column - sortedPoints[j].column,
            sortedPoints[i].row - points[j].row,
          ) < removeClosePoints &&
          image.getValue(sortedPoints[i].column, sortedPoints[i].row, 0) >=
            image.getValue(sortedPoints[j].column, sortedPoints[j].row, 0)
        ) {
          if (isMax) {
            sortedPoints.splice(j, 1);
            j--;
          } else {
            sortedPoints.splice(i, 1);
            i--;
          }
        }
      }
    }
  }
  return points;
}
