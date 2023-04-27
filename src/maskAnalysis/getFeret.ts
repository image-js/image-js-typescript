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

  for (let i = 0; i < hullPoints.length; i++) {
    let angle = getAngle(
      hullPoints[i],
      hullPoints[(i + 1) % hullPoints.length],
    );

    // We rotate so that it is parallel to X axis.
    const rotatedPoints = rotate(-angle, hullPoints);

    let currentWidth = 0;
    let currentMinLinePoints: Point[] = [];

    for (let j = 0; j < hullPoints.length; j++) {
      let absWidth = Math.abs(rotatedPoints[i].row - rotatedPoints[j].row);
      if (absWidth > currentWidth) {
        currentWidth = absWidth;
        currentMinLinePoints = [rotatedPoints[i], rotatedPoints[j]];
      }
    }
    if (currentWidth < minWidth) {
      minWidth = currentWidth;
      minWidthAngle = angle;
      minLinePoints = currentMinLinePoints;
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
  for (let i = 0; i < hullPoints.length - 1; i++) {
    for (let j = i + 1; j < hullPoints.length; j++) {
      let currentSquaredWidth =
        (hullPoints[i].column - hullPoints[j].column) ** 2 +
        (hullPoints[i].row - hullPoints[j].row) ** 2;
      if (currentSquaredWidth > maxSquaredWidth) {
        maxSquaredWidth = currentSquaredWidth;
        maxLinePoints = [hullPoints[i], hullPoints[j]];
      }
    }
  }

  const maxDiameter = {
    length: Math.sqrt(maxSquaredWidth),
    angle: toDegrees(getAngle(maxLinePoints[0], maxLinePoints[1])),
    points: maxLinePoints,
  };

  let lines = {
    minDiameter: getCalliperLines(minDiameter, hullPoints, false),
    maxDiameter: getCalliperLines(maxDiameter, hullPoints, true),
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
 * Calculates calliper lines from Feret diameter
 *
 * @param diameter - Feret diameter(max or min)
 * @param hullPoints - points that constitute convexHull
 * @param isMax - a parameter to check if a Feret diameter is max or min
 * @returns array of arrays with two points
 */
function getCalliperLines(
  diameter: FeretDiameter,
  hullPoints: Point[],
  isMax: boolean,
) {
  let shift = 0;
  let slope = 0;
  let lowerLength = 0;
  let higherLength = 0;
  if (isHorizontal(diameter.points)) {
    const horizontal = diameter.points[0].row;
    for (let point of hullPoints) {
      const distance = Math.abs(
        Math.cos((diameter.angle * Math.PI) / 180) *
          (diameter.points[0].row - point.row) -
          Math.sin((diameter.angle * Math.PI) / 180) *
            (diameter.points[0].column - point.column),
      );
      if (point.row < horizontal) {
        if (lowerLength < distance) {
          lowerLength = distance;
        }
      } else if (point.row > horizontal) {
        if (higherLength < distance) {
          higherLength = distance;
        }
      }
    }
  } else if (isVertical(diameter.points)) {
    const vertical = diameter.points[0].column;
    for (let point of hullPoints) {
      const distance = Math.abs(
        Math.cos((diameter.angle * Math.PI) / 180) *
          (diameter.points[0].row - point.row) -
          Math.sin((diameter.angle * Math.PI) / 180) *
            (diameter.points[0].column - point.column),
      );
      if (point.row < vertical) {
        if (lowerLength < distance) {
          lowerLength = distance;
        }
      } else if (point.row > vertical) {
        if (higherLength < distance) {
          higherLength = distance;
        }
      }
    }
  } else {
    slope =
      (diameter.points[1].row - diameter.points[0].row) /
      (diameter.points[1].column - diameter.points[0].column);
    shift = diameter.points[1].row - diameter.points[1].column * slope;

    for (let point of hullPoints) {
      let distance = Math.abs(
        Math.cos((diameter.angle * Math.PI) / 180) *
          (diameter.points[0].row - point.row) -
          Math.sin((diameter.angle * Math.PI) / 180) *
            (diameter.points[0].column - point.column),
      );
      if (point.row < point.column * slope + shift) {
        if (lowerLength < distance) {
          lowerLength = distance;
        }
      } else if (point.row > point.column * slope + shift) {
        if (higherLength < distance) {
          higherLength = distance;
        }
      }
    }
  }
  //for maxDiameter
  if (isMax) {
    let line3 = [
      {
        column:
          diameter.points[0].column +
          higherLength * Math.cos((diameter.angle + 90) * (Math.PI / 180)),
        row:
          diameter.points[0].row +
          higherLength * Math.sin((diameter.angle + 90) * (Math.PI / 180)),
      },
      {
        column:
          diameter.points[0].column -
          lowerLength * Math.cos((diameter.angle + 90) * (Math.PI / 180)),
        row:
          diameter.points[0].row -
          lowerLength * Math.sin((diameter.angle + 90) * (Math.PI / 180)),
      },
    ];
    let line4 = [
      {
        column:
          diameter.points[1].column +
          higherLength * Math.cos((diameter.angle + 90) * (Math.PI / 180)),
        row:
          diameter.points[1].row +
          higherLength * Math.sin((diameter.angle + 90) * (Math.PI / 180)),
      },
      {
        column:
          diameter.points[1].column -
          lowerLength * Math.cos((diameter.angle + 90) * (Math.PI / 180)),
        row:
          diameter.points[1].row -
          lowerLength * Math.sin((diameter.angle + 90) * (Math.PI / 180)),
      },
    ];
    return [line3, line4];
  } else {
    //for minDiameter
    let line1 = [
      {
        column:
          diameter.points[0].column +
          higherLength * Math.cos((diameter.angle + 90) * (Math.PI / 180)),
        row:
          diameter.points[0].row +
          higherLength * Math.sin((diameter.angle + 90) * (Math.PI / 180)),
      },
      {
        column:
          diameter.points[0].column -
          lowerLength * Math.cos((diameter.angle + 90) * (Math.PI / 180)),
        row:
          diameter.points[0].row -
          lowerLength * Math.sin((diameter.angle + 90) * (Math.PI / 180)),
      },
    ];
    let line2 = [
      {
        column:
          diameter.points[1].column +
          higherLength * Math.cos((diameter.angle + 90) * (Math.PI / 180)),
        row:
          diameter.points[1].row +
          higherLength * Math.sin((diameter.angle + 90) * (Math.PI / 180)),
      },
      {
        column:
          diameter.points[1].column -
          lowerLength * Math.cos((diameter.angle + 90) * (Math.PI / 180)),
        row:
          diameter.points[1].row -
          lowerLength * Math.sin((diameter.angle + 90) * (Math.PI / 180)),
      },
    ];
    return [line1, line2];
  }
}
