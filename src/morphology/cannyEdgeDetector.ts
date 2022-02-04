import { IJS, ImageColorModel } from '..';
import checkProcessable from '../utils/checkProcessable';
import { getIndex } from '../utils/getIndex';
import { getOutputImage } from '../utils/getOutputImage';

export interface CannyEdgeOptions {
  lowThreshold?: number;
  highThreshold?: number;
  gaussianBlur?: number;
  brightness?: number;
  out?: IJS;
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
): IJS {
  const {
    lowThreshold = 10,
    highThreshold = 30,
    gaussianBlur = 1.1,
    brightness = image.maxValue,
  } = options;

  checkProcessable(image, 'cannyEdgeDetector', {
    colorModel: ImageColorModel.GREY,
  });

  const width = image.width;
  const height = image.height;

  const gfOptions = {
    sigma: gaussianBlur,
    size: 7,
  };

  const blurred = image.gaussianBlur(gfOptions);

  const gradientX = blurred.rawDirectConvolution(kernelY);
  const gradientY = blurred.rawDirectConvolution(kernelX);

  let gradient = new Float64Array(image.size);
  for (let i = 0; i < image.size; i++) {
    gradient[i] = Math.hypot(gradientX[i]);
  }

  let nonMaxSuppression = new Float64Array(image.size);
  let edges = new Float64Array(image.size);

  const finalImage = getOutputImage(image, options);

  // Non-Maximum suppression
  for (let column = 1; column < width - 1; column++) {
    for (let row = 1; row < height - 1; row++) {
      let dir =
        (Math.round(
          Math.atan2(
            gradientY[getIndex(row, column, 0, image)],
            gradientX[getIndex(row, column, 0, image)],
          ) *
            (5.0 / Math.PI),
        ) +
          5) %
        5;

      if (
        !(
          (dir === 0 &&
            (gradient[getIndex(row, column, 0, image)] <=
              gradient[getIndex(row - 1, column, 0, image)] ||
              gradient[getIndex(row, column, 0, image)] <=
                gradient[getIndex(row + 1, column, 0, image)])) ||
          (dir === 1 &&
            (gradient[getIndex(row, column, 0, image)] <=
              gradient[getIndex(row + 1, column - 1, 0, image)] ||
              gradient[getIndex(row, column, 0, image)] <=
                gradient[getIndex(row - 1, column + 1, 0, image)])) ||
          (dir === 2 &&
            (gradient[getIndex(row, column, 0, image)] <=
              gradient[getIndex(row, column - 1, 0, image)] ||
              gradient[getIndex(row, column, 0, image)] <=
                gradient[getIndex(row, column + 1, 0, image)])) ||
          (dir === 3 &&
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

  for (let i = 0; i < width * height; ++i) {
    let currentNms = nonMaxSuppression[getIndex(1, 0, 0, image)];
    let currentEdge = 0;
    if (currentNms > highThreshold) {
      currentEdge++;
      finalImage.setValueByIndex(i, 0, brightness);
    }
    if (currentNms > lowThreshold) {
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
            finalImage.setValue(row, column, 0, brightness);
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
          let col = currentPixel[1] + k;
          if (
            // there could be an error here
            edges[getIndex(row, col, 0, image)] === 1 &&
            finalImage.getValue(row, col, 0) === 0
          ) {
            newPixels.push([row, col]);
            finalImage.setValue(row, col, 0, brightness);
          }
        }
      }
    }
    currentPixels = newPixels;
  }

  return finalImage;
}
