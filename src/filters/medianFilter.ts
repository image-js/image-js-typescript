import { xMedian } from 'ml-spectra-processing';

import { Image } from '../Image';
import checkProcessable from '../utils/checkProcessable';
import { getBorderInterpolation, BorderType } from '../utils/interpolateBorder';

export interface MedianFilterOptions {
  /**
   * Type of border algorithm to interpolate from.
   *
   * @default 'reflect101'
   */
  borderType: BorderType;
  /**
   * Value of border.
   */
  borderValue?: number;
  /**
   * The radius of the cell to extract median value from. Must be odd.
   *
   * @default 1
   */
  cellSize: number;
}
/**
 * Calculate a new image that replaces all pixel values by the median value inside the square area set in the options
 *
 * @param image - Image to be filtered.
 * @param options - MedianFilterOptions
 * @returns Image after median filter.
 */
export function medianFilter(image: Image, options: MedianFilterOptions) {
  let { cellSize = 3, borderType = 'reflect101', borderValue } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  if (cellSize < 1) {
    throw new RangeError('cellSize must be greater than 0');
  }

  if (cellSize % 2 === 0) {
    throw new RangeError('cellSize must be an odd number');
  }

  let interpolateBorder = getBorderInterpolation(
    borderType,
    borderValue as number,
  );

  let newImage = Image.createFrom(image);
  let size = cellSize ** 2;
  let cellValues = new Uint16Array(size);

  let halfCellSize = (cellSize - 1) / 2;

  for (let channel = 0; channel < image.channels; channel++) {
    for (let row = 0; row < image.height; row++) {
      for (let column = 0; column < image.width; column++) {
        let n = 0;
        for (let cellRow = -halfCellSize; cellRow <= halfCellSize; cellRow++) {
          for (
            let cellColumn = -halfCellSize;
            cellColumn <= halfCellSize;
            cellColumn++
          ) {
            cellValues[n++] = interpolateBorder(
              column + cellColumn,
              row + cellRow,
              channel,
              image,
            );
          }
        }
        newImage.setValue(column, row, channel, xMedian(cellValues));
      }
    }
  }
  return newImage;
}
