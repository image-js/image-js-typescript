import { Point } from '../utils/geometry/points';

export function rotatePoint(
  point: Point,
  rotationCenter: Point,
  angle: number,
): Point {
  const angleCos = Math.cos(angle);
  const angleSin = Math.sin(angle);

  const column =
    point.column * angleCos -
    point.row * angleSin +
    (1 - angleCos) * rotationCenter.column +
    rotationCenter.row * angleSin;
  const row =
    point.column * angleSin +
    point.row * angleCos +
    (1 - angleCos) * rotationCenter.row -
    rotationCenter.column * angleSin;
  return { column, row };
}
