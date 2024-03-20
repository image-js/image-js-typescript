import { Point } from '../utils/geometry/points';
import { Image } from '../Image';
import { rotatePoint } from '../point/operations';
import { getAngle } from '../maskAnalysis/utils/getAngle';
import { transform, TransformOptions } from '../geometry';

export type CropRectangleOptions = Omit<
  TransformOptions,
  'width' | 'height' | 'inverse' | 'fullImage'
>;

/**
 * Crop an oriented rectangle from an image.
 * If the rectangle's length or width are not an integers, its dimension is expanded in both directions such as the length and width are integers.
 * @param points The points of the rectangle. Points must be circling around the rectangle (clockwise or anti-clockwise)
 *
 */
export function cropRectangle(
  image: Image,
  points: Point[],
  options?: CropRectangleOptions,
): Image {
  if (points.length !== 4) {
    throw new Error('The points array must contain 4 points');
  }

  // Compute the angle between the first segment defined by the points
  // And the horizontal axis
  const angle = getSmallestAngle(points);

  const center: Point = {
    row: (points[0].row + points[2].row) / 2,
    column: (points[0].column + points[2].column) / 2,
  };

  // Rotated points form a straight rectangle
  const rotatedPoints = points.map((p) => rotatePoint(p, center, angle));
  const [p1, p2, p3] = rotatedPoints;

  const originalWidth = Math.max(
    Math.abs(p1.column - p2.column),
    Math.abs(p2.column - p3.column),
  );
  const originalHeight = Math.max(
    Math.abs(p1.row - p2.row),
    Math.abs(p2.row - p3.row),
  );
  // Deal with numerical imprecision when the rectangle actually had a whole number width or height
  const width = Math.min(
    Math.ceil(originalWidth),
    Math.ceil(originalWidth - 1e-10),
  );
  const height = Math.min(
    Math.ceil(originalHeight),
    Math.ceil(originalHeight - 1e-10),
  );

  const expandedTopLeft = {
    row:
      Math.min(...rotatedPoints.map((p) => p.row)) -
      (height - originalHeight) / 2,
    column:
      Math.min(...rotatedPoints.map((p) => p.column)) -
      (width - originalWidth) / 2,
  };

  const translation = rotatePoint(expandedTopLeft, center, -angle);

  const angleCos = Math.cos(-angle);
  const angleSin = Math.sin(-angle);
  const matrix = [
    [angleCos, -angleSin, translation.column],
    [angleSin, angleCos, translation.row],
  ];
  console.log(
    `<path d="M${points.map((p) => `${p.column},${p.row}`).join('L')}Z" stroke-width="0.03" stroke="black" fill="transparent"/>`,
    imagePointsSvg(width, height, matrix),
  );
  return transform(image, matrix, {
    inverse: true,
    width: width,
    height: height,
    ...options,
  });
}

function transformPoint(transform: number[][], point: Point): Point {
  const nx =
    transform[0][0] * point.column +
    transform[0][1] * point.row +
    transform[0][2];
  const ny =
    transform[1][0] * point.column +
    transform[1][1] * point.row +
    transform[1][2];
  return {
    column: nx,
    row: ny,
  };
}

function imagePointsSvg(width: number, height: number, transform: number[][]) {
  const points: string[] = [];
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const point = transformPoint(transform, { row, column });
      points.push(pointToSvg(point));
    }
  }
  return points.join('\n');
}

function pointToSvg(point: Point) {
  return `<circle cx="${point.column}" cy="${point.row}" r="0.04" stroke="blue" stroke-width="0.02" fill="transparent" />`;
}

function toDeg(rad: number) {
  return (rad / Math.PI) * 180;
}

/**
 * Get the smallest angle to put the rectangle in an upright position
 * @param points
 */
function getSmallestAngle(points: Point[]) {
  let angleHorizontal = -getAngle(points[1], points[0]);

  if (angleHorizontal > Math.PI / 2) {
    angleHorizontal -= Math.PI;
  } else if (angleHorizontal < -Math.PI / 2) {
    angleHorizontal += Math.PI;
  }

  // angle is between -π/4 and π/4
  let angle = angleHorizontal;
  if (Math.abs(angleHorizontal) > Math.PI / 4) {
    angle =
      angleHorizontal > 0
        ? -Math.PI / 2 + angleHorizontal
        : Math.PI / 2 + angleHorizontal;
  }
  return angle;
}
