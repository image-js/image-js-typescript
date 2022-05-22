import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage } from '../utils/getOutputImage';

import { Point } from './drawLine';

export interface Line {
  /**
   * Line slope.
   */
  a: number;
  /**
   * Line y-intercept.
   */
  b: number;
  /**
   * Line is vertical
   */
  vertical: boolean;
}
export interface DrawPolygonOptions {
  /**
   * Array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  color?: number[];
  /**
   * Array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  fill?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: IJS;
  /**
   * Fill polygon.
   */
  filled?: boolean;
}
/**
 * Draw a polygon defined by an array of points.
 *
 * @param image - Image to process.
 * @param points - Polygon points.
 * @param options - Draw Line options.
 * @returns The original drew image
 */
export function drawPolygon(
  image: IJS,
  points: Point[],
  options: DrawPolygonOptions = {},
) {
  const {
    fill = getDefaultColor(image),
    filled = false,
    ...otherOptions
  } = options;

  let newImage = getOutputImage(image, options, { clone: true });
  checkProcessable(newImage, 'drawPolyline', {
    bitDepth: [1, 8, 16],
  });
  const filteredPoints = deleteDouble(points);
  filteredPoints.push(filteredPoints[0]);
  if (filled === false) {
    return newImage.drawPolyline(points, otherOptions);
  } else {
    let matrixBinary: number[][] = [];
    for (let i = 0; i < newImage.height; i++) {
      matrixBinary[i] = [];
      for (let j = 0; j < newImage.width; j++) {
        matrixBinary[i].push(0);
      }
    }
    for (let point = 0; point < filteredPoints.length; point++) {
      const line = lineBetweenTwoPoints(
        filteredPoints[point],
        filteredPoints[(point + 1) % filteredPoints.length],
      );
      for (let row = 0; row < newImage.height; row++) {
        for (let column = 0; column < newImage.width; column++) {
          if (isAtTheRightOfTheLine({ column, row }, line, newImage.height)) {
            matrixBinary[row][column] = matrixBinary[row][column] === 0 ? 1 : 0;
          }
        }
      }
    }
    for (let row = 0; row < newImage.height; row++) {
      for (let column = 0; column < newImage.width; column++) {
        if (matrixBinary[row][column] === 1) {
          if (newImage.depth === 1) {
            newImage.setValue(column, row, 0, fill[0]);
          } else {
            let numberChannels = Math.min(newImage.channels, fill.length);
            for (let channel = 0; channel < numberChannels; channel++) {
              newImage.setValue(column, row, channel, fill[channel]);
            }
          }
        }
      }
    }
    return newImage.drawPolyline(points, otherOptions);
  }
}
/**
 * Delete double in polygon points.
 *
 * @param points - Polygon points array.
 * @returns Cleaned polygon points array
 */
function deleteDouble(points: Point[]): Point[] {
  let finalPoints = [];
  for (let i = 0; i < points.length; i++) {
    if (
      points[i].column === points[(i + 1) % points.length].column &&
      points[i].row === points[(i + 1) % points.length].row
    ) {
      continue;
    } else if (
      points[i].column ===
        points[(i - 1 + points.length) % points.length].column &&
      points[i].row === points[(i - 1 + points.length) % points.length].row
    ) {
      continue;
    } else if (
      points[(i + 1) % points.length].column ===
        points[(i - 1 + points.length) % points.length].column &&
      points[(i - 1 + points.length) % points.length].row ===
        points[(i + 1) % points.length].row
    ) {
      continue; // we don't consider newImage point only
    } else {
      finalPoints.push(points[i]);
    }
  }
  return finalPoints;
}
/**
 * Get line between two points.
 *
 * @param p1 - First line point.
 * @param p2 - Second line point
 * @returns Line between point
 */
function lineBetweenTwoPoints(p1: Point, p2: Point): Line {
  if (p1.column === p2.column) {
    return { a: 0, b: p1.column, vertical: true }; // we store the x of the vertical line into b
  } else {
    const a = (p2.row - p1.row) / (p2.column - p1.column);
    const b = p1.row - a * p1.column;
    return { a, b, vertical: false };
  }
}
/**
 * Check if the point is on the right of a line.
 *
 * @param point - Point.
 * @param line - Line.
 * @param height - Image height.
 * @returns Point at the right of the line
 */
function isAtTheRightOfTheLine(
  point: Point,
  line: Line,
  height: number,
): boolean {
  const { row, column } = point;
  if (line.vertical === true) {
    return line.b <= column;
  } else {
    if (line.a === 0) {
      return false;
    } else {
      const xLine = (row - line.b) / line.a;
      return xLine < column && xLine >= 0 && xLine <= height;
    }
  }
}
