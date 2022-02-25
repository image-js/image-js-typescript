import Matrix from 'ml-matrix';

import { IJS, ImageColorModel, Mask } from '..';
import { GaussianBlurOptions } from '../filters';
import checkProcessable from '../utils/checkProcessable';
import { getIndex } from '../utils/getIndex';
import { imageToOutputMask } from '../utils/getOutputImage';

export interface CannyEdgeOptions {
  /**
   * Lower threshold of the gaussian blur (indicates the weak edges to discard).
   */
  lowThreshold?: number;
  /**
   * Higher threshold of the gaussian blur (indicates the strong edges to keep). Value must be between 0 and 1.
   */
  highThreshold?: number;
  /**
   * Standard deviation of the gaussian blur (sigma). Value must be between 0 and 1.
   *
   */
  gaussianBlurOptions?: GaussianBlurOptions;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Mask;
}

const kernelX = [
  [-1, 0, +1],
  [-2, 0, +2],
  [-1, 0, +1],
];

const kernelY = [
  [-1, -2, -1],
  [0, 0, 0],
  [+1, +2, +1],
];

/**
 * Apply Canny edge detection to an image.
 *
 * @param image - Image to process.
 * @param options - Canny edge detection options.
 * @returns The processed image.
 */
export function cannyEdgeDetector(
  image: IJS,
  options: CannyEdgeOptions = {},
): Mask {
  const {
    lowThreshold = 0.04,
    highThreshold = 0.1,
    gaussianBlurOptions = { sigma: 1 },
  } = options;

  const minValue = lowThreshold * image.maxValue;
  const maxValue = highThreshold * image.maxValue;

  checkProcessable(image, 'cannyEdgeDetector', {
    colorModel: ImageColorModel.GREY,
  });

  const width = image.width;
  const height = image.height;

  const blurred = image.gaussianBlur(gaussianBlurOptions);
  console.log({ blurred });

  const gradientX = blurred.rawDirectConvolution(kernelY);
  const gradientY = blurred.rawDirectConvolution(kernelX);
  let gradient = new Float64Array(image.size);
  for (let i = 0; i < image.size; i++) {
    gradient[i] = Math.hypot(gradientX[i]);
  }

  printArray(gradient);

  let nonMaxSuppression = new Float64Array(image.size);
  let edges = new Float64Array(image.size);

  const finalImage = imageToOutputMask(image, options);

  // Non-Maximum suppression
  for (let column = 1; column < width - 1; column++) {
    for (let row = 1; row < height - 1; row++) {
      let direction =
        (Math.round(
          Math.atan2(
            gradientY[getIndex(row, column, 0, image)],
            gradientX[getIndex(row, column, 0, image)],
          ) *
            (4 / Math.PI),
        ) +
          4) %
        4;

      if (
        !(
          (direction === 0 &&
            (gradient[getIndex(row, column, 0, image)] <=
              gradient[getIndex(row - 1, column, 0, image)] ||
              gradient[getIndex(row, column, 0, image)] <=
                gradient[getIndex(row + 1, column, 0, image)])) ||
          (direction === 1 &&
            (gradient[getIndex(row, column, 0, image)] <=
              gradient[getIndex(row + 1, column - 1, 0, image)] ||
              gradient[getIndex(row, column, 0, image)] <=
                gradient[getIndex(row - 1, column + 1, 0, image)])) ||
          (direction === 2 &&
            (gradient[getIndex(row, column, 0, image)] <=
              gradient[getIndex(row, column - 1, 0, image)] ||
              gradient[getIndex(row, column, 0, image)] <=
                gradient[getIndex(row, column + 1, 0, image)])) ||
          (direction === 3 &&
            (gradient[getIndex(row, column, 0, image)] <=
              gradient[getIndex(row - 1, column - 1, 0, image)] ||
              gradient[getIndex(row, column, 0, image)] <=
                gradient[getIndex(row + 1, column + 1, 0, image)]))
        )
      ) {
        nonMaxSuppression[getIndex(row, column, 0, image)] =
          gradient[getIndex(row, column, 0, image)];
      }
    }
  }
  printArray(nonMaxSuppression);

  for (let i = 0; i < width * height; ++i) {
    // a bug might be here
    let currentNms = nonMaxSuppression[i];
    let currentEdge = 0;
    if (currentNms > maxValue) {
      currentEdge++;
      finalImage.setValueByIndex(i, 0, 1);
    }
    if (currentNms > minValue) {
      currentEdge++;
    }

    edges[getIndex(i, 0, 0, image)] = currentEdge;
  }

  // Hysteresis: first pass
  let currentPixels: number[][] = [];
  for (let column = 1; column < width - 1; ++column) {
    for (let row = 1; row < height - 1; ++row) {
      if (edges[getIndex(row, column, 0, image)] !== 1) {
        continue;
      }

      outer: for (
        let hystColumn = column - 1;
        hystColumn < column + 2;
        ++hystColumn
      ) {
        for (let hystRow = row - 1; hystRow < row + 2; ++hystRow) {
          if (edges[getIndex(hystRow, hystColumn, 0, image)] === 2) {
            currentPixels.push([column, row]);
            finalImage.setValue(row, column, 0, 1);
            break outer;
          }
        }
      }
    }
  }

  // Hysteresis: second pass
  while (currentPixels.length > 0) {
    let newPixels = [];
    for (let currentPixel of currentPixels) {
      for (let j = -1; j < 2; ++j) {
        for (let k = -1; k < 2; ++k) {
          if (j === 0 && k === 0) {
            continue;
          }
          let row = currentPixel[0] + j;
          let column = currentPixel[1] + k;
          if (
            // there could be an error here
            edges[getIndex(row, column, 0, image)] === 1 &&
            finalImage.getValue(row, column, 0) === 0
          ) {
            newPixels.push([row, column]);
            finalImage.setValue(row, column, 0, 1);
          }
        }
      }
    }
    currentPixels = newPixels;
  }

  return finalImage;

  function printArray(array: Float64Array): void {
    // @ts-expect-error
    const matrix = Matrix.from1DArray(height, width, array);
    console.log(matrix);
  }
}
