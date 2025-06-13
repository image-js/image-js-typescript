import { Matrix, SingularValueDecomposition } from 'ml-matrix';

import type { Point } from '../utils/geometry/points.js';

interface GetPerspectiveWarpOptions {
  width?: number;
  height?: number;
}

// REFERENCES :
// https://stackoverflow.com/questions/38285229/calculating-aspect-ratio-of-perspective-transform-destination-image/38402378#38402378
// http://www.corrmap.com/features/homography_transformation.php
// https://ags.cs.uni-kl.de/fileadmin/inf_ags/3dcv-ws11-12/3DCV_WS11-12_lec04.pdf
// http://graphics.cs.cmu.edu/courses/15-463/2011_fall/Lectures/morphing.pdf
/**
 * Returns perspective warp matrix from 4 points.
 * @param pts - 4 reference corners of the new image.
 * @param options - PerspectiveWarpOptions
 * @returns - Matrix from 4 points.
 */
export default function getPerspectiveWarp(
  pts: Point[],
  options: GetPerspectiveWarpOptions = {},
) {
  if (pts.length !== 4) {
    throw new Error(
      `The array pts must have four elements, which are the four corners. Currently, pts have ${pts.length} elements`,
    );
  }
  const { width, height } = options;
  const [tl, tr, br, bl] = order4Points(pts);

  let widthRect;
  let heightRect;
  if (height && width) {
    widthRect = width;
    heightRect = height;
  } else {
    widthRect = Math.ceil(
      Math.max(distance2Points(tl, tr), distance2Points(bl, br)),
    );
    heightRect = Math.ceil(
      Math.max(distance2Points(tl, bl), distance2Points(tr, br)),
    );
  }

  const [x1, y1] = [0, 0];
  const [x2, y2] = [widthRect - 1, 0];
  const [x3, y3] = [widthRect - 1, heightRect - 1];
  const [x4, y4] = [0, heightRect - 1];

  const S = new Matrix([
    [x1, y1, 1, 0, 0, 0, -x1 * tl.column, -y1 * tl.column],
    [x2, y2, 1, 0, 0, 0, -x2 * tr.column, -y2 * tr.column],
    [x3, y3, 1, 0, 0, 0, -x3 * br.column, -y3 * br.column],
    [x4, y4, 1, 0, 0, 0, -x4 * bl.column, -y4 * bl.column],
    [0, 0, 0, x1, y1, 1, -x1 * tl.row, -y1 * tl.row],
    [0, 0, 0, x2, y2, 1, -x2 * tr.row, -y2 * tr.row],
    [0, 0, 0, x3, y3, 1, -x3 * br.row, -y3 * br.row],
    [0, 0, 0, x4, y4, 1, -x4 * bl.row, -y4 * bl.row],
  ]);
  const D = Matrix.columnVector([
    tl.column,
    tr.column,
    br.column,
    bl.column,
    tl.row,
    tr.row,
    br.row,
    bl.row,
  ]);

  const svd = new SingularValueDecomposition(S);
  const T = svd.solve(D).to1DArray(); // solve S*T = D
  T.push(1);

  const M = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(T[i * 3 + j]);
    }
    M.push(row);
  }
  return M;
}

/**
 * Sorts 4 points in order =>[top-left,top-right,bottom-right,bottom-left]. Input points must be in clockwise or counter-clockwise order.
 * @param pts - Array of 4 points.
 * @returns Sorted array of 4 points.
 */
function order4Points(pts: Point[]) {
  let tl: Point;
  let tr: Point;
  let br: Point;
  let bl: Point;

  let minX = pts[0].column;
  let indexMinX = 0;

  for (let i = 1; i < pts.length; i++) {
    if (pts[i].column < minX) {
      minX = pts[i].column;
      indexMinX = i;
    }
  }

  let minX2 = pts[(indexMinX + 1) % pts.length].column;
  let indexMinX2 = (indexMinX + 1) % pts.length;

  for (let i = 1; i < pts.length; i++) {
    if (pts[i].column < minX2 && i !== indexMinX) {
      minX2 = pts[i].column;
      indexMinX2 = i;
    }
  }

  if (pts[indexMinX2].row < pts[indexMinX].row) {
    tl = pts[indexMinX2];
    bl = pts[indexMinX];
    if (indexMinX !== (indexMinX2 + 1) % 4) {
      tr = pts[(indexMinX2 + 1) % 4];
      br = pts[(indexMinX2 + 2) % 4];
    } else {
      tr = pts[(indexMinX2 + 2) % 4];
      br = pts[(indexMinX2 + 3) % 4];
    }
  } else {
    bl = pts[indexMinX2];
    tl = pts[indexMinX];
    if (indexMinX2 !== (indexMinX + 1) % 4) {
      tr = pts[(indexMinX + 1) % 4];
      br = pts[(indexMinX + 2) % 4];
    } else {
      tr = pts[(indexMinX + 2) % 4];
      br = pts[(indexMinX + 3) % 4];
    }
  }
  return [tl, tr, br, bl];
}
/**
 *  Calculates distance between points.
 * @param p1 - Point1
 * @param p2 - Point2
 * @returns distance between points.
 */
function distance2Points(p1: Point, p2: Point) {
  return Math.hypot(p1.column - p2.column, p1.row - p2.row);
}
