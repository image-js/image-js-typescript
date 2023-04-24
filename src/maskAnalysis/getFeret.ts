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

  let line1 = [
    {
      column:
        minDiameter.points[0].column + mask.width * Math.cos(minDiameter.angle),
      row: minDiameter.points[0].row + mask.width * Math.sin(minDiameter.angle),
    },
    {
      column:
        minDiameter.points[0].column - mask.width * Math.cos(minDiameter.angle),
      row: minDiameter.points[0].row - mask.width * Math.sin(minDiameter.angle),
    },
  ];
  let line2 = [
    {
      column:
        minDiameter.points[1].column + mask.width * Math.cos(minDiameter.angle),
      row: minDiameter.points[1].row + mask.width * Math.sin(minDiameter.angle),
    },
    {
      column:
        minDiameter.points[1].column - mask.width * Math.cos(minDiameter.angle),
      row: minDiameter.points[1].row - mask.width * Math.sin(minDiameter.angle),
    },
  ];

  const minLines = [line1, line2];

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
  let line3 = [
    {
      column:
        maxDiameter.points[0].column +
        mask.width * Math.cos(maxDiameter.angle + 90),
      row:
        maxDiameter.points[0].row +
        mask.width * Math.sin(maxDiameter.angle + 90),
    },
    {
      column:
        maxDiameter.points[0].column -
        mask.width * Math.cos(maxDiameter.angle + 90),
      row:
        maxDiameter.points[0].row -
        mask.width * Math.sin(maxDiameter.angle + 90),
    },
  ];
  let line4 = [
    {
      column:
        maxDiameter.points[1].column +
        mask.width * Math.cos(maxDiameter.angle + 90),
      row:
        maxDiameter.points[1].row +
        mask.width * Math.sin(maxDiameter.angle + 90),
    },
    {
      column:
        maxDiameter.points[1].column -
        mask.width * Math.cos(maxDiameter.angle + 90),
      row:
        maxDiameter.points[1].row -
        mask.width * Math.sin(maxDiameter.angle + 90),
    },
  ];
  const maxLines = [line3, line4];
  let lines = {
    maxDiameter: maxLines,
    minDiameter: minLines,
  };

  return {
    minDiameter,
    maxDiameter,
    lines,
    aspectRatio: minDiameter.length / maxDiameter.length,
  };
}
