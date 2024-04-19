import { Image } from '../Image';
import { Mask } from '../Mask';
import { Point } from '../geometry';

interface SampleBackgroundPointsOptions {
  numberOfRows?: number;
  numberOfColumns?: number;
  kind?: 'black' | 'white';
}
/**
 * Returns a sample of points that belongs to background.
 * @param image - Image to sample points from.
 * @param mask - Mask to check if the point belongs to background.
 * @param options - SampleBackgroundPointsOptions.
 * @returns Array of points.
 */
export function sampleBackgroundPoints(
  image: Image,
  mask: Mask,
  options: SampleBackgroundPointsOptions,
) {
  const { kind = 'black', numberOfColumns = 10, numberOfRows = 10 } = options;
  const backgroundValue = kind === 'black' ? 0 : 1;
  const background: Point[] = [];
  const verticalSpread = Math.floor(image.height / numberOfRows);
  const horizontalSpread = Math.floor(image.width / numberOfColumns);
  if (verticalSpread <= 0) {
    throw new RangeError(
      `Too many rows per image.Your number of rows:${numberOfRows}`,
    );
  }
  if (horizontalSpread <= 0) {
    throw new RangeError(
      `Too many columns per image.Your number of columns: ${numberOfColumns}`,
    );
  }
  for (
    let row = Math.floor(verticalSpread / 2);
    row < mask.height - Math.floor(verticalSpread / 2);
    row += verticalSpread
  ) {
    for (
      let column = Math.floor(horizontalSpread / 2);
      column < mask.width - Math.floor(horizontalSpread / 2);
      column += horizontalSpread
    ) {
      if (mask.getBit(column, row) === backgroundValue) {
        background.push({ column, row });
      }
    }
  }
  return background;
}
