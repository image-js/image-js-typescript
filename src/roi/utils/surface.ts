/**
 * Returns the surface represented by the points (a polygon)
 *
 * @param points:number[][]
 * @param vertices:number[][]
 * @param vertices
 * @returns number
 */
export function surface(vertices: number[][]): number {
  let total = 0;

  for (let i = 0; i < vertices.length; i++) {
    let addX = vertices[i][0];
    let addY = vertices[i === vertices.length - 1 ? 0 : i + 1][1];
    let subX = vertices[i === vertices.length - 1 ? 0 : i + 1][0];
    let subY = vertices[i][1];

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
}
