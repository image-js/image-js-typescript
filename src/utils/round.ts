/**
 * Round a pixel value.
 *
 * @param value - Value of the pixel.
 * @returns The rounded value.
 */
export function round(value: number): number {
  const integer = value >> 0;
  const decimal = value - integer;
  if (decimal < 0.5) {
    return integer;
  } else if (decimal > 0.5) {
    return integer + 1;
  } else {
    return integer % 2 === 0 ? integer : integer + 1;
  }
}
