import { Point } from './points';

/**
 * Finds extreme values of an image which are not stacked together.
 *
 * @param points - Array of points that should be combined to improve.
 * @param removeClosePoints.removeClosePoints
 * @param removeClosePoints - the number of points that should be removed if they are close to extremum.
 * @param removeClosePoints.image
 * @param removeClosePoints.extremum
 * @returns Array of Points.
 */
export function filterPoints(points: Point[], removeClosePoints = 0) {
  if (removeClosePoints > 0) {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (
          Math.hypot(
            points[i].column - points[j].column,
            points[i].row - points[j].row,
          ) < removeClosePoints
        ) {
          points[i].column = (points[i].column + points[j].column) >> 1;
          points[i].row = (points[i].row + points[j].row) >> 1;
          points.splice(j, 1);
          j--;
        }
      }
    }
  }
  return points;
}
