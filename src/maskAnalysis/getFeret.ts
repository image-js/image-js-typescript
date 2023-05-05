import { Mask } from '../Mask';
import { Point } from '../geometry';
import { toDegrees } from '../utils/geometry/angles';
import { rotate } from '../utils/geometry/points';

import { getAngle } from './utils/getAngle';

export interface FeretDiameter {
  /**
   * Start and end point of the Feret diameter.
   */
  points: Point[];
  /**
   * Length of the diameter.
   */
  length: number;
  /**
   * Angle between the diameter and a horizontal line in degrees.
   */
  angle: number;
}

export interface Feret {
  /**
   * Smaller Feret diameter.
   */
  minDiameter: FeretDiameter;
  /**
   * Bigger Feret diameter.
   */
  maxDiameter: FeretDiameter;
  /**
   * Calliper lines that pass by endpoints of Feret diameters.
   */
  lines: { maxDiameter: Point[][]; minDiameter: Point[][] };
  /**
   * Ratio between the smaller and the bigger diameter.
   * Expresses how elongated the shape is. This is a value between 0 and 1.
   */
  aspectRatio: number;
}

/**
 * Computes the Feret diameters
 * https://www.sympatec.com/en/particle-measurement/glossary/particle-shape/#
 * http://portal.s2nano.org:8282/files/TEM_protocol_NANoREG.pdf
 *
 * @param mask - The mask of the ROI.
 * @returns The Feret diameters.
 */
export function getFeret(mask: Mask): Feret {
  const hull = mask.getConvexHull();
  const hullPoints = hull.points;
  if (hull.surface === 0) {
    return {
      minDiameter: {
        length: 0,
        points: [
          { column: 0, row: 0 },
          { column: 0, row: 0 },
        ],
        angle: 0,
      },
      lines: {
        maxDiameter: [
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        ],
        minDiameter: [
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
          [
            { column: 0, row: 0 },
            { column: 0, row: 0 },
          ],
        ],
      },
      maxDiameter: {
        length: 0,
        points: [
          { column: 0, row: 0 },
          { column: 0, row: 0 },
        ],
        angle: 0,
      },
      aspectRatio: 1,
    };
  }

  // Compute minimum diameter
  let minWidth = Number.POSITIVE_INFINITY;
  let minWidthAngle = 0;
  let minLinePoints: Point[] = [];
  let minLineIndex: number[] = [];
  let minCalliperXs: number[] = [];
  for (let i = 0; i < hullPoints.length; i++) {
    let angle = getAngle(
      hullPoints[i],
      hullPoints[(i + 1) % hullPoints.length],
    );

    // We rotate so that it is parallel to X axis.
    const rotatedPoints = rotate(-angle, hullPoints);
    let currentWidth = 0;
    let currentMinLinePoints: Point[] = [];
    let currentMinLineIndex: number[] = [];

    for (let j = 0; j < hullPoints.length; j++) {
      let absWidth = Math.abs(rotatedPoints[i].row - rotatedPoints[j].row);
      if (absWidth > currentWidth) {
        currentWidth = absWidth;
        currentMinLinePoints = [rotatedPoints[i], rotatedPoints[j]];
        currentMinLineIndex = [i, j];
      }
    }
    if (currentWidth < minWidth) {
      minWidth = currentWidth;
      minWidthAngle = angle;
      minLinePoints = currentMinLinePoints;
      minLineIndex = currentMinLineIndex;
      const columns = rotatedPoints.map((point) => point.column);
      const currentMin = columns.indexOf(Math.min(...columns));
      const currentMax = columns.indexOf(Math.max(...columns));
      minCalliperXs = [currentMin, currentMax];
    }
  }

  const minDiameter = {
    points: rotate(minWidthAngle, minLinePoints),
    length: minWidth,
    angle: toDegrees(minWidthAngle),
  };

  // Compute maximum diameter
  let maxLinePoints: Point[] = [];
  let maxSquaredWidth = 0;
  let maxLineIndex: number[] = [];
  for (let i = 0; i < hullPoints.length - 1; i++) {
    for (let j = i + 1; j < hullPoints.length; j++) {
      let currentSquaredWidth =
        (hullPoints[i].column - hullPoints[j].column) ** 2 +
        (hullPoints[i].row - hullPoints[j].row) ** 2;
      if (currentSquaredWidth > maxSquaredWidth) {
        maxSquaredWidth = currentSquaredWidth;
        maxLinePoints = [hullPoints[i], hullPoints[j]];
        maxLineIndex = [i, j];
      }
    }
  }

  const maxDiameter = {
    length: Math.sqrt(maxSquaredWidth),
    angle: toDegrees(getAngle(maxLinePoints[0], maxLinePoints[1])),
    points: maxLinePoints,
  };

  const lines = {
    minDiameter: getMinCalliper(hullPoints, minCalliperXs, minLineIndex),
    maxDiameter: getMaxCalliper(
      hullPoints,

      maxLineIndex,
      (maxDiameter.angle * Math.PI) / 180,
    ),
  };

  return {
    minDiameter,
    maxDiameter,
    lines,
    aspectRatio: minDiameter.length / maxDiameter.length,
  };
}
/**
 *  Checks if a line is horizontal
 *
 * @param points - enpoints of a line
 * @returns boolean
 */
function isHorizontal(points: Point[]) {
  if (points[0].row - points[1].row === 0) {
    return true;
  }
  return false;
}
/**
 * Checks if a line is vertical or not
 *
 * @param points - endpoints of a line
 * @returns boolean
 */
function isVertical(points: Point[]) {
  if (points[0].column - points[1].column === 0) {
    return true;
  }
  return false;
}
/**
 * Calculates calliper lines for Feret minDiameter
 *
 * @param hullPoints - points that constitute convexHull
 * @param roiEdges
 * @param index - saved indexes of feretDiameter max/min points
 * @param angle - angle of feretDiameter max/min
 * @returns array of arrays with two points
 */

function getMinCalliper(
  hullPoints: Point[],
  roiEdges: number[],
  index: number[],
) {
  //look for 2 hull points which are adjacent to feret points and which form the same slope
  const checkCoeffs1 = [-1, 1, 1, -1];
  const checkCoeffs2 = [1, -1, 1, -1];
  const feretPoint1 = hullPoints[index[0]];
  const feretPoint2 = hullPoints[index[1]];

  let feretSlope = 1;
  let checkHull1: Point = { column: 0, row: 0 };
  let checkHull2: Point = { column: 0, row: 0 };
  //checks if the index is not out of array's range
  for (let i = 0; i < checkCoeffs1.length; i++) {
    if (index[0] + checkCoeffs1[i] < 0) {
      checkHull1 = hullPoints[hullPoints.length - 1];
    } else if (index[0] + checkCoeffs1[i] >= hullPoints.length) {
      checkHull1 = hullPoints[0];
    } else {
      checkHull1 = hullPoints[index[0] + checkCoeffs1[i]];
    }
    if (index[1] + checkCoeffs2[i] < 0) {
      checkHull2 = hullPoints[hullPoints.length - 1];
    } else if (index[1] + checkCoeffs2[i] >= hullPoints.length) {
      checkHull2 = hullPoints[0];
    } else {
      checkHull2 = hullPoints[index[1] + checkCoeffs2[i]];
    }
    if (
      (feretPoint1.row - checkHull1.row) /
        (feretPoint1.column - checkHull1.column) ===
      (feretPoint2.row - checkHull2.row) /
        (feretPoint2.column - checkHull2.column)
    ) {
      feretSlope =
        (feretPoint1.row - checkHull1.row) /
        (feretPoint1.column - checkHull1.column);
    }
  }

  let point1: Point = { column: 0, row: 0 };
  let point2: Point = { column: 0, row: 0 };
  let point3: Point = { column: 0, row: 0 };
  let point4: Point = { column: 0, row: 0 };

  if (isVertical([feretPoint2, checkHull2])) {
    point1 = {
      column: feretPoint1.column,
      row: hullPoints[roiEdges[0]].row,
    };
    point2 = {
      column: feretPoint1.column,
      row: hullPoints[roiEdges[1]].row,
    };
    point3 = {
      column: feretPoint2.column,
      row: hullPoints[roiEdges[0]].row,
    };
    point4 = {
      column: feretPoint2.column,
      row: hullPoints[roiEdges[1]].row,
    };

    return [
      [point1, point2],
      [point3, point4],
    ];
  } else if (isHorizontal([feretPoint2, checkHull2])) {
    point1 = {
      column: hullPoints[roiEdges[0]].column,
      row: feretPoint1.row,
    };
    point2 = { column: hullPoints[roiEdges[1]].column, row: feretPoint1.row };
    point3 = {
      column: hullPoints[roiEdges[0]].column,
      row: feretPoint2.row,
    };
    point4 = {
      column: hullPoints[roiEdges[1]].column,
      row: feretPoint2.row,
    };

    return [
      [point1, point2],
      [point3, point4],
    ];
  } else {
    //calculate 4 lines that are formed though points of feret diameter and edges of ROI which were calculated earlier. Then calculate points of intersection which will be our calliper lines
    let calliperSlope = -1 / feretSlope;
    const calliperLineShift1 =
      feretPoint1.row - feretPoint1.column * feretSlope;
    const calliperLineShift2 =
      feretPoint2.row - feretPoint2.column * feretSlope;
    const perpendicularLineShift1 =
      hullPoints[roiEdges[0]].row -
      hullPoints[roiEdges[0]].column * calliperSlope;
    const perpendicularLineShift2 =
      hullPoints[roiEdges[1]].row -
      hullPoints[roiEdges[1]].column * calliperSlope;
    point1.column =
      (calliperLineShift1 - perpendicularLineShift1) /
      (calliperSlope - feretSlope);
    point1.row = point1.column * feretSlope + calliperLineShift1;
    point2.column =
      (calliperLineShift1 - perpendicularLineShift2) /
      (calliperSlope - feretSlope);
    point2.row = point2.column * feretSlope + calliperLineShift1;
    point3.column =
      (calliperLineShift2 - perpendicularLineShift1) /
      (calliperSlope - feretSlope);
    point3.row = point3.column * feretSlope + calliperLineShift2;
    point4.column =
      (calliperLineShift2 - perpendicularLineShift2) /
      (calliperSlope - feretSlope);
    point4.row = point4.column * feretSlope + calliperLineShift2;

    return [
      [point1, point2],
      [point3, point4],
    ];
  }
}
/**
 * Calculates calliper lines for Feret maxDiameter
 *
 * @param hullPoints - points that constitute convexHull
 * @param index - saved indexes of feretDiameter max/min points
 * @param angle - angle of feretDiameter max/min
 * @returns array of arrays with two points
 */

function getMaxCalliper(hullPoints: Point[], index: number[], angle: number) {
  const feretSlope = Math.tan(angle);
  const feretPoint1 = hullPoints[index[0]];
  const feretPoint2 = hullPoints[index[1]];
  const rotatedPoints = rotate(-angle, hullPoints);
  const rows = rotatedPoints.map((point) => point.row);
  const roiEdge1 = rows.indexOf(Math.min(...rows));
  const roiEdge2 = rows.indexOf(Math.max(...rows));

  let point1: Point = { column: 0, row: 0 };
  let point2: Point = { column: 0, row: 0 };
  let point3: Point = { column: 0, row: 0 };
  let point4: Point = { column: 0, row: 0 };
  if (isVertical([feretPoint1, feretPoint2])) {
    point1 = {
      column: hullPoints[roiEdge1].column,
      row: feretPoint1.row,
    };
    point2 = {
      column: hullPoints[roiEdge2].column,
      row: feretPoint1.row,
    };
    point3 = {
      column: hullPoints[roiEdge1].column,
      row: feretPoint2.row,
    };
    point4 = {
      column: hullPoints[roiEdge2].column,
      row: feretPoint2.row,
    };

    return [
      [point1, point2],
      [point3, point4],
    ];
  } else if (isHorizontal([feretPoint1, feretPoint2])) {
    point1 = {
      column: feretPoint1.column,
      row: hullPoints[roiEdge1].row,
    };
    point2 = {
      column: feretPoint1.column,
      row: hullPoints[roiEdge2].row,
    };
    point3 = {
      column: feretPoint2.column,
      row: hullPoints[roiEdge1].row,
    };
    point4 = {
      column: feretPoint2.column,
      row: hullPoints[roiEdge2].row,
    };

    return [
      [point1, point2],
      [point3, point4],
    ];
  } else {
    let calliperSlope = -(1 / feretSlope);

    const shift1 = feretPoint1.row - feretPoint1.column * calliperSlope;
    const shift2 = feretPoint2.row - feretPoint2.column * calliperSlope;
    const shift3 =
      hullPoints[roiEdge1].row - hullPoints[roiEdge1].column * feretSlope;
    const shift4 =
      hullPoints[roiEdge2].row - hullPoints[roiEdge2].column * feretSlope;

    point1.column = (shift3 - shift1) / (calliperSlope - feretSlope);
    point1.row = point1.column * calliperSlope + shift1;
    point2.column = (shift4 - shift1) / (calliperSlope - feretSlope);
    point2.row = point2.column * calliperSlope + shift1;
    point3.column = (shift4 - shift2) / (calliperSlope - feretSlope);
    point3.row = point3.column * calliperSlope + shift2;
    point4.column = (shift3 - shift2) / (calliperSlope - feretSlope);
    point4.row = point4.column * calliperSlope + shift2;

    return [
      [point1, point2],
      [point3, point4],
    ];
  }
}
