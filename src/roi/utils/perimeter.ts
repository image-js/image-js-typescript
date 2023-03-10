/**
 *
 * @param vertices
 */
export function perimeter(vertices: number[][]): number {
  let total = 0;
  for (let i = 0; i < vertices.length; i++) {
    let fromX = vertices[i][0];
    let fromY = vertices[i][1];
    let toX = vertices[i === vertices.length - 1 ? 0 : i + 1][0];
    let toY = vertices[i === vertices.length - 1 ? 0 : i + 1][1];
    total += Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
  }
  return total;
}
