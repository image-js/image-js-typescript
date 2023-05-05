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
  /**
   * Calliper lines that pass by endpoints of Feret diameters.
   */
  lines: Point[][];
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
        lines: [
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
        lines: [
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
      aspectRatio: 1,
    };
  }

  // Compute minimum diameter
  let minWidth = Number.POSITIVE_INFINITY;
  let minWidthAngle = 0;
  let minLinePoints: Point[] = [];
  let minLines = [
    [
      { column: 0, row: 0 },
      { column: 0, row: 0 },
    ],
    [
      { column: 0, row: 0 },
      { column: 0, row: 0 },
    ],
  ];
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
      const currentMin = findPointsOfExtremeColumns(rotatedPoints).minIndex;
      const currentMax = findPointsOfExtremeColumns(rotatedPoints).maxIndex;
      minLines = formMinLines(
        minWidthAngle,
        currentMin,
        currentMax,
        rotatedPoints,
        minLinePoints,
      );
    }
  }

  const minDiameter = {
    points: rotate(minWidthAngle, minLinePoints),
    length: minWidth,
    angle: toDegrees(minWidthAngle),
    lines: minLines,
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
  const maxAngle = getAngle(maxLinePoints[0], maxLinePoints[1]);
  let rotatedMaxPoints = rotate(-maxAngle, hullPoints);

  const currentMin = findPointsOfExtremeRows(rotatedMaxPoints).minIndex;
  const currentMax = findPointsOfExtremeRows(rotatedMaxPoints).maxIndex;
  let maxLines = formMaxLines(
    maxAngle,
    currentMin,
    currentMax,
    rotatedMaxPoints,
    maxLineIndex,
  );
  const maxDiameter = {
    length: Math.sqrt(maxSquaredWidth),
    angle: toDegrees(getAngle(maxLinePoints[0], maxLinePoints[1])),
    points: maxLinePoints,
    lines: maxLines,
  };

  return {
    minDiameter,
    maxDiameter,
    aspectRatio: minDiameter.length / maxDiameter.length,
  };
}

function findPointsOfExtremeColumns(points: Point[]): {
  minIndex: number;
  maxIndex: number;
} {
  let max = 0;
  let min = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
      if (points[i].column > points[max].column) {
        max = i;
      }
      if (points[j].column < points[min].column) {
        min = j;
      }
    }
  }
  return { minIndex: min, maxIndex: max };
}
function findPointsOfExtremeRows(points: Point[]): {
  minIndex: number;
  maxIndex: number;
} {
  let max = 0;
  let min = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
      if (points[i].row > points[max].row) {
        max = i;
      }
      if (points[j].row < points[min].row) {
        min = j;
      }
    }
  }
  return { minIndex: min, maxIndex: max };
}

function formMinLines(
  angle: number,
  min: number,
  max: number,
  rotatedPoints: Point[],
  feretPoints: Point[],
): Point[][] {
  let minLine1: Point[] = [
    { column: rotatedPoints[min].column, row: feretPoints[0].row },
    {
      column: rotatedPoints[max].column,
      row: feretPoints[0].row,
    },
  ];
  let minLine2: Point[] = [
    {
      column: rotatedPoints[min].column,
      row: feretPoints[1].row,
    },
    {
      column: rotatedPoints[max].column,
      row: feretPoints[1].row,
    },
  ];

  const lines = [rotate(angle, minLine1), rotate(angle, minLine2)];
  return lines;
}
function formMaxLines(
  angle: number,
  min: number,
  max: number,
  rotatedPoints: Point[],
  index: number[],
): Point[][] {
  let maxLine1: Point[] = [
    { column: rotatedPoints[index[0]].column, row: rotatedPoints[min].row },
    {
      column: rotatedPoints[index[0]].column,
      row: rotatedPoints[max].row,
    },
  ];
  let maxLine2: Point[] = [
    { column: rotatedPoints[index[1]].column, row: rotatedPoints[min].row },
    {
      column: rotatedPoints[index[1]].column,
      row: rotatedPoints[max].row,
    },
  ];

  const lines = [rotate(angle, maxLine1), rotate(angle, maxLine2)];
  return lines;
}
