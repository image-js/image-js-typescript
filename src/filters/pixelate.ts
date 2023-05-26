import { xMedian } from 'ml-spectra-processing';

import { Image, Point } from '..';
import { assertUnreachable } from '../utils/assert';
import { getOutputImage } from '../utils/getOutputImage';

export interface PixelateOptions {
  /**
   *  range of pixelated area.
   */
  cellSize: number;
  /**
   * algorithm to use.
   *
   * @default center
   */
  algorithm?: 'center' | 'median' | 'mean';
  /**
   * Image to which to output.
   */
  out?: Image;
}

interface GetValueOptions {
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
  const { cellSize, algorithm = 'center' } = options;
  if (!Number.isInteger(cellSize)) {
    throw new TypeError('cellSize must be an integer');
  }
  if (cellSize < 2) {
    throw new RangeError('cellSize must be greater than 1');
  }
  const newImage = getOutputImage(image, options);

  const getCellValue = getCellValueFunction(algorithm);

  for (let channel = 0; channel < image.channels; channel++) {
    for (let column = 0; column < image.width; column += cellSize) {
      for (let row = 0; row < image.height; row += cellSize) {
        const currentCellWidth = Math.min(cellSize, image.width - column);
        const currentCellHeight = Math.min(cellSize, image.height - row);
        let value = getCellValue(image, channel, {
          width: currentCellWidth,
          height: currentCellHeight,
          origin: { column, row },
        });

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
 * @param image - image used for the algorithm
 * @param channel - image channel toto find center value of
 * @param options - CenterOptions
 * @returns Point
 */
function getCellCenter(
  image: Image,
  channel: number,
  options: GetValueOptions,
): number {
  const center = {
    column: Math.floor(
      (options.origin.column + options.origin.column + options.width - 1) / 2,
    ),
    row: Math.floor(
      (options.origin.row + options.origin.row + options.height - 1) / 2,
    ),
  };
  const value = image.getValue(center.column, center.row, channel);
  return value;
}

function getCellMean(image: Image, channel: number, options: GetValueOptions) {
  let sum = 0;

  for (
    let column = options.origin.column;
    column < options.origin.column + options.width;
    column++
  ) {
    for (
      let row = options.origin.row;
      row < options.origin.row + options.height;
      row++
    ) {
      sum += image.getValue(column, row, channel);
    }
  }
  return Math.floor(sum / (options.width * options.height));
}

function getCellMedian(
  image: Image,
  channel: number,
  options: GetValueOptions,
) {
  let valuesOfSector = getArrayOfValues(image, channel, {
    width: options.width,
    height: options.height,
    origin: { column: options.origin.column, row: options.origin.row },
  });

  return xMedian(valuesOfSector);
}

function getCellValueFunction(algorithm: 'center' | 'mean' | 'median') {
  switch (algorithm) {
    case 'mean':
      return getCellMean;
    case 'median':
      return getCellMedian;
    case 'center':
      return getCellCenter;
    default:
      assertUnreachable(algorithm);
      break;
  }
}

function getArrayOfValues(
  image: Image,
  channel: number,
  options: GetValueOptions,
) {
  let array = [];
  for (
    let column = options.origin.column;
    column < options.origin.column + options.width;
    column++
  ) {
    for (
      let row = options.origin.row;
      row < options.origin.row + options.height;
      row++
    ) {
      array.push(image.getValue(column, row, channel));
    }
  }
  return array;
}
