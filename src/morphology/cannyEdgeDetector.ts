import { ColorDepth, IJS, ImageColorModel } from '..';
import checkProcessable from '../utils/checkProcessable';
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

  checkProcessable(image, 'cannyEdge', {
    colorModel: ImageColorModel.GREY,
  });

  const width = image.width;
  const height = image.height;

  const gfOptions = {
    sigma: gaussianBlur,
    size: 7,
  };

  const blurred = image.gaussianBlur(gfOptions);

  const gradientX = blurred.directConvolution(kernelY);-
  const gradientY = blurred.directConvolution(kernelX);
  const gradient = gradientY.hypotenuse(gradientX);

  const nms = new IJS(width, height, {
    colorModel: ImageColorModel.GREY,
    depth: 32,
  });

  const edges = new IJS(width, height, {
    colorModel: ImageColorModel.GREY,
    depth: 32,
  });

  const finalImage = getOutputImage(image, options);

  // Non-Maximum suppression
  for (let i = 1; i < width - 1; i++) {
    for (let j = 1; j < height - 1; j++) {
      let dir =
        (Math.round(
          Math.atan2(gradientY.getValue(i, j, 0), gradientX.getValue(i, j, 0)) *
            (5.0 / Math.PI),
        ) +
          5) %
        5;

      if (
        !(
          (dir === 0 &&
            (gradient.getValue(i, j, 0) <= gradient.getValue(i, j - 1, 0) ||
              gradient.getValue(i, j, 0) <= gradient.getValue(i, j + 1, 0))) ||
          (dir === 1 &&
            (gradient.getValue(i, j, 0) <= gradient.getValue(i - 1, j + 1, 0) ||
              gradient.getValue(i, j, 0) <=
                gradient.getValue(i + 1, j - 1, 0))) ||
          (dir === 2 &&
            (gradient.getValue(i, j, 0) <= gradient.getValue(i - 1, j, 0) ||
              gradient.getValue(i, j, 0) <= gradient.getValue(i + 1, j, 0))) ||
          (dir === 3 &&
            (gradient.getValue(i, j, 0) <= gradient.getValue(i - 1, j - 1, 0) ||
              gradient.getValue(i, j, 0) <= gradient.getValue(i + 1, j + 1, 0)))
        )
      ) {
        nms.setValue(i, j, 0, gradient.getValue(i, j, 0));
      }
    }
  }

  for (let i = 0; i < width * height; ++i) {
    let currentNms = nms.getValueByIndex(1, 0);
    let currentEdge = 0;
    if (currentNms > highThreshold) {
      currentEdge++;
      finalImage.setValueByIndex(i, 0, brightness);
    }
    if (currentNms > lowThreshold) {
      currentEdge++;
    }

    edges.setValueByIndex(i, 0, currentEdge);
  }

  // Hysteresis: first pass
  let currentPixels = [];
  for (let i = 1; i < width - 1; ++i) {
    for (let j = 1; j < height - 1; ++j) {
      if (edges.getValue(i, j, 0) !== 1) {
        continue;
      }

      outer: for (let k = i - 1; k < i + 2; ++k) {
        for (let l = j - 1; l < j + 2; ++l) {
          if (edges.getValue(k, l, 0) === 2) {
            currentPixels.push([i, j]);
            finalImage.setValue(i, j, 0, brightness);
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
            edges.getValue(row, col, 0) === 1 &&
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
