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
  borderValue: number;
  /**
   * The radius of the cell to extract xMedian from. Must be odd.
   *
   * @default 1
   */
  cellSize: number;
}
/**
 * Apply a median filter to the image.
 *
 * @param image - Image to be filtered.
 * @param options - MedianFilterOptions
 * @returns Image after median filter.
 */
export function medianFilter(image: Image, options: MedianFilterOptions) {
  let { cellSize = 1, borderType = 'reflect101', borderValue } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  if (cellSize < 1) {
    throw new RangeError('cellSize must be greater than 0');
  }

  if (cellSize % 2 === 0) {
    throw new RangeError('cellSize must be an odd number');
  }

  // validateChannels(options.channels as number[], image);
  let interpolateBorder = getBorderInterpolation(borderType, borderValue);
  let kSize = cellSize;
  let newImage = Image.createFrom(image);
  let size = (kSize * 2 + 1) * (kSize * 2 + 1);
  let cellValues;
  if (image.bitDepth === 16) {
    cellValues = new Uint16Array(size);
  } else {
    cellValues = new Uint8Array(size);
  }

  for (let channel = 0; channel < image.channels; channel++) {
    for (let row = 0; row < image.height; row++) {
      for (let column = 0; column < image.width; column++) {
        let n = 0;
        for (let cellRow = -kSize; cellRow <= kSize; cellRow++) {
          for (let cellColumn = -kSize; cellColumn <= kSize; cellColumn++) {
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
