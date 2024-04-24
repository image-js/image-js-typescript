import { Image } from '../Image';
import { Mask } from '../Mask';
import { Point } from '../geometry';

interface SampleBackgroundPointsOptions {
  /**
   * Number of rows in the grid.
   * @default `image.height`
   */
  gridHeight: number;
  /**
   * Number of columns in the grid.
   * @default `image.width`
   */
  gridWidth: number;
  /**
   * The kind of background to sample.
   * @default `'black'`
   */
  kind: 'black' | 'white';
}
/**
 * Applies the grid that samples points that belong to background.
 * @param image - Image to sample points from.
 * @param mask - Mask to check if the point belongs to background.
 * @param options - SampleBackgroundPointsOptions.
 * @returns Array of points.
 */
export function sampleBackgroundPoints(
  image: Image,
  mask: Mask,
  options?: Partial<SampleBackgroundPointsOptions>,
) {
  const kind = options?.kind ?? 'black';
  const gridHeight = options?.gridHeight ?? image.height;
  const gridWidth = options?.gridWidth ?? image.width;

  const backgroundValue = kind === 'black' ? 0 : 1;
  const background: Point[] = [];
  const verticalSpread = Math.floor(image.height / gridHeight);
  const horizontalSpread = Math.floor(image.width / gridWidth);
  if (verticalSpread <= 0) {
    throw new RangeError(
      `The grid has bigger height than the image. Grid's height:${gridHeight}`,
    );
  }
  if (horizontalSpread <= 0) {
    throw new RangeError(
      `The grid has bigger width than the image. Grid's width: ${gridWidth}`,
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
