import { Point } from './points';
/**
 *
 * @param points
 * @param removeClosePoints
 */
export function combinePoints(points: Point[], removeClosePoints: number) {
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
