import { Matrix, inverse, SingularValueDecomposition } from 'ml-matrix';

import { Image } from '../Image.js';
import type { Point } from '../utils/geometry/points.js';

type Vector = [number, number, number];
interface PerspectiveWarpOptionsWithDimensions {
  width?: number;
  height?: number;
}
interface PerspectiveWarpOptionsWithRatios {
  calculateRatio?: boolean;
}

// REFERENCES :
// https://stackoverflow.com/questions/38285229/calculating-aspect-ratio-of-perspective-transform-destination-image/38402378#38402378
// http://www.corrmap.com/features/homography_transformation.php
// https://ags.cs.uni-kl.de/fileadmin/inf_ags/3dcv-ws11-12/3DCV_WS11-12_lec04.pdf
// http://graphics.cs.cmu.edu/courses/15-463/2011_fall/Lectures/morphing.pdf

/**
 * Applies perspective warp on an image from 4 points.
 * @param image - Image to apply the algorithm on.
 * @param pts - 4 reference corners of the new image.
 * @param options - PerspectiveWarpOptions
 * @returns - New image after warp.
 */
export default function getPerspectiveWarp(
  image: Image,
  pts: Point[],
  options: PerspectiveWarpOptionsWithDimensions &
    PerspectiveWarpOptionsWithRatios = {},
) {
  const { width, height, calculateRatio } = options;

  if (pts.length !== 4) {
    throw new Error(
      `The array pts must have four elements, which are the four corners. Currently, pts have ${pts.length} elements`,
    );
  }

  const [tl, tr, br, bl] = order4Points(pts);

  let widthRect;
  let heightRect;
  if (calculateRatio) {
    [widthRect, heightRect] = computeWidthAndHeigth(
      {
        tl,
        tr,
        br,
        bl,
      },
      image.width,
      image.height,
    );
  } else if (height && width) {
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

  const newImage = Image.createFrom(image, {
    width: widthRect,
    height: heightRect,
  });
  const [x1, y1] = [0, 0];
  const [x2, y2] = [0, widthRect - 1];
  const [x3, y3] = [heightRect - 1, widthRect - 1];
  const [x4, y4] = [heightRect - 1, 0];

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
  const T = svd.solve(D); // solve S*T = D
  const [a, b, c, d, e, f, g, h] = T.to1DArray();

  for (let i = 0; i < heightRect; i++) {
    for (let j = 0; j < widthRect; j++) {
      for (let channel = 0; channel < image.channels; channel++) {
        newImage.setValue(
          j,
          i,
          channel,
          projectionPoint(i, j, a, b, c, d, e, f, g, h, image, channel),
        );
      }
    }
  }

  return newImage;
}
/**
 * Sorts 4 points in order =>[top-left,top-right,bottom-right,bottom-left].
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
/**
 * Calculates cross products between two vectors.
 * @param u - Vector1.
 * @param v - Vector2.
 * @returns new calculated vector.
 */
function crossVect(u: Vector, v: Vector): Vector {
  const result = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
  return result as Vector;
}
/**
 * Calculates dot product between two vectors.
 * @param u - Vector1.
 * @param v - Vector2.
 * @returns result of the product.
 */
function dotVect(u: Vector, v: Vector): number {
  const result = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  return result;
}
/**
 * Calculates width and height of the new image for perspective warp.
 * @param points - 4 reference corners.
 * @param points.tl - top-left corner.
 * @param points.tr - top-right corner.
 * @param points.br - bottom-right corner.
 * @param points.bl - bottom-left corner.
 * @param widthImage - image width.
 *  @param heightImage - image height.
 * @returns new width and height values.
 */
function computeWidthAndHeigth(
  points: { tl: Point; tr: Point; br: Point; bl: Point },
  widthImage: number,
  heightImage: number,
) {
  const { tl, tr, br, bl } = points;
  const w = Math.max(distance2Points(tl, tr), distance2Points(bl, br));
  const h = Math.max(distance2Points(tl, bl), distance2Points(tr, br));
  let finalW = 0;
  let finalH = 0;

  const u0 = Math.ceil(widthImage / 2);
  const v0 = Math.ceil(heightImage / 2);
  const arVis = w / h;

  const m1: Vector = [tl.column, tl.row, 1];
  const m2: Vector = [tr.column, tr.row, 1];
  const m3: Vector = [bl.column, bl.row, 1];
  const m4: Vector = [br.column, br.row, 1];
  const k2 = dotVect(crossVect(m1, m4), m3) / dotVect(crossVect(m2, m4), m3);
  const k3 = dotVect(crossVect(m1, m4), m2) / dotVect(crossVect(m3, m4), m2);

  const n2: Vector = [
    k2 * m2[0] - m1[0],
    k2 * m2[1] - m1[1],
    k2 * m2[2] - m1[2],
  ];
  const n3: Vector = [
    k3 * m3[0] - m1[0],
    k3 * m3[1] - m1[1],
    k3 * m3[2] - m1[2],
  ];

  const n21 = n2[0];
  const n22 = n2[1];
  const n23 = n2[2];

  const n31 = n3[0];
  const n32 = n3[1];
  const n33 = n3[2];

  let f =
    (1 / (n23 * n33)) *
    (n21 * n31 -
      (n21 * n33 + n23 * n31) * u0 +
      n23 * n33 * u0 * u0 +
      (n22 * n32 - (n22 * n33 + n23 * n32) * v0 + n23 * n33 * v0 * v0));
  if (f >= 0) {
    f = Math.sqrt(f);
  } else {
    f = Math.sqrt(-f);
  }

  const A = new Matrix([
    [f, 0, u0],
    [0, f, v0],
    [0, 0, 1],
  ]);
  const At = A.transpose();
  const Ati = inverse(At);
  const Ai = inverse(A);

  const n2R = Matrix.rowVector(n2);
  const n3R = Matrix.rowVector(n3);

  const arReal = Math.sqrt(
    dotVect(n2R.mmul(Ati).mmul(Ai).to1DArray() as Vector, n2) /
      dotVect(n3R.mmul(Ati).mmul(Ai).to1DArray() as Vector, n3),
  );

  if (arReal === 0 || arVis === 0) {
    finalW = Math.ceil(w);
    finalH = Math.ceil(h);
  } else if (arReal < arVis) {
    finalW = Math.ceil(w);
    finalH = Math.ceil(finalW / arReal);
  } else {
    finalH = Math.ceil(h);
    finalW = Math.ceil(arReal * finalH);
  }
  return [finalW, finalH];
}

function projectionPoint(
  x: number,
  y: number,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  g: number,
  h: number,
  image: Image,
  channel: number,
) {
  const [newX, newY] = [
    (a * x + b * y + c) / (g * x + h * y + 1),
    (d * x + e * y + f) / (g * x + h * y + 1),
  ];
  return image.getValue(Math.floor(newX), Math.floor(newY), channel);
}
