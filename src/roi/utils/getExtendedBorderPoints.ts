import { Point } from '../../utils/geometry/points';
import { Roi } from '../Roi';

/**
 * Get the pixels that surround an ROI. The pixels include the top and left borders,
 * but extend the left and bottom one by one pixel.
 * This allows to compute the minimum bounding rectangle with the correct surface.
 * This method is only used to calculate minimalBoundRectangle and convexHull.
 *
 * @param roi - The ROI for which to get the extended border points.
 * @returns - The array of points.
 */
export function getExtendedBorderPoints(roi: Roi): Point[] {
  const borderPoints = roi.getBorderPoints({
    allowCorners: true,
    innerBorders: false,
  });

  let result: Point[] = [];

  for (let point of borderPoints) {
    result.push(
      point,
      { column: point.column + 1, row: point.row },
      { column: point.column + 1, row: point.row + 1 },
      { column: point.column, row: point.row + 1 },
    );
  }

  return result;
}
