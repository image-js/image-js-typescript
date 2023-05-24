import { xMean, xMedian } from 'ml-spectra-processing';

import { Image, Point } from '..';
import { getOutputImage } from '../utils/getOutputImage';

export interface PixelateOptions {
  /**
   *  range of pixelated area.
   */
  cellSize: number;
  /**
   * algorithm to use.
   */
  algorithm?: 'center' | 'median' | 'mean';
  /**
   * Image to which to output.
   */
  out?: Image;
}

interface CenterOptions {
  /*
   * width of a region to look for center
   */
  width: number;
  /*
   * height of a region to look for center
   */
  height: number;
  /*
   * top left point of a region which serves as point of origin
   */
  origin: Point;
}

/**
 *Function to pixelate an image
 *
 * @param image - image to be pixelated
 * @param options - PixelateOptions
 * @returns pixelated Image
 */
export function pixelate(image: Image, options: PixelateOptions): Image {
  const { cellSize, algorithm } = options;
  if (!Number.isInteger(cellSize)) {
    throw new TypeError('cellSize must be an integer');
  }
  if (cellSize < 2) {
    throw new RangeError('cellSize must be greater than 1');
  }
  const newImage = getOutputImage(image, options);
  let value: number;
  for (let channel = 0; channel < image.channels; channel++) {
    for (let column = 0; column < image.width; column += cellSize) {
      for (let row = 0; row < image.height; row += cellSize) {
        const currentCellWidth = Math.min(cellSize, image.width - column);
        const currentCellHeight = Math.min(cellSize, image.height - row);
        let arrayOfValues = getArrayOfValues(image, channel, {
          width: currentCellWidth,
          height: currentCellHeight,
          origin: { column, row },
        });
        if (algorithm === 'mean') {
          value = xMean(arrayOfValues);
        } else if (algorithm === 'median') {
          value = xMedian(arrayOfValues);
        } else {
          let center = getCenter({
            width: currentCellWidth,
            height: currentCellHeight,
            origin: {
              column,
              row,
            },
          });
          value = image.getValue(center.column, center.row, channel);
        }
        for (
          let newColumn = column;
          newColumn < column + currentCellWidth;
          newColumn++
        ) {
          for (let newRow = row; newRow < row + currentCellHeight; newRow++) {
            newImage.setValue(newColumn, newRow, channel, value);
          }
        }
      }
    }
  }

  return newImage;
}

/**
 *Find the center of a rectangle to be pixelated
 *
 *
 * @param options - CenterOptions
 * @returns Point
 */
function getCenter(options: CenterOptions): Point {
  const center = {
    column: Math.floor(
      (options.origin.column + options.origin.column + options.width - 1) / 2,
    ),
    row: Math.floor(
      (options.origin.row + options.origin.row + options.height - 1) / 2,
    ),
  };

  return center;
}

function getArrayOfValues(
  image: Image,
  channel: number,
  options: CenterOptions,
) {
  let array = [];
  for (
    let i = options.origin.column;
    i < options.origin.column + options.width;
    i++
  ) {
    for (
      let j = options.origin.row;
      j < options.origin.row + options.height;
      j++
    ) {
      array.push(image.getValue(i, j, channel));
    }
  }
  return array;
}
