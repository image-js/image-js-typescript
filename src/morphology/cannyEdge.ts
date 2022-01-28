import { IJS, ImageColorModel } from '..';
import checkProcessable from '../utils/checkProcessable';

export interface CannyEdgeOptions {
  lowThreshold: number;
  highThreshold: number;
  gaussianBlur: number;
  brightness: number;
}

const Gx = [
  [-1, 0, +1],
  [-2, 0, +2],
  [-1, 0, +1],
];

const Gy = [
  [-1, -2, -1],
  [0, 0, 0],
  [+1, +2, +1],
];

const convOptions = {
  bitDepth: 32,
  mode: 'periodic',
};

/**
 * Apply Canny edge detection to an image.
 *
 * @param image - Image to process.
 * @param options - Canny edge detection options.
 * @returns The processed image.
 */
export default function cannyEdgeDetector(
  image: IJS,
  options: CannyEdgeOptions,
): IJS {
  const {
    lowThreshold = 10,
    highThreshold = 30,
    gaussianBlur = 1.1,
    brightness = image.maxValue,
  } = options;

  checkProcessable(image, 'cannyEdge', {
    bitDepth: 8,
    channels: 1,
    components: 1,
  });

  const width = image.width;
  const height = image.height;

  const gfOptions = {
    sigma: gaussianBlur,
    radius: 3,
  };

  const gf = image.gaussianBlur(gfOptions);

  const gradientX = gf.convolution(Gy, convOptions);
  const gradientY = gf.convolution(Gx, convOptions);

  const G = gradientY.hypotenuse(gradientX);

  const nms = new IJS(width, height, {
    colorModel: ImageColorModel.GREY,
    depth: 32,
  });

  const edges = new IJS(width, height, {
    colorModel: ImageColorModel.GREY,
    depth: 32,
  });

  const finalImage = new IJS(width, height, {
    colorModel: ImageColorModel.GREY,
  });

  // Non-Maximum suppression
  for (let i = 1; i < width - 1; i++) {
    for (let j = 1; j < height - 1; j++) {
      let dir =
        (Math.round(
          Math.atan2(
            gradientY.getValueXY(i, j, 0),
            gradientX.getValueXY(i, j, 0),
          ) *
            (5.0 / Math.PI),
        ) +
          5) %
        5;

      if (
        !(
          (dir === 0 &&
            (G.getValueXY(i, j, 0) <= G.getValueXY(i, j - 1, 0) ||
              G.getValueXY(i, j, 0) <= G.getValueXY(i, j + 1, 0))) ||
          (dir === 1 &&
            (G.getValueXY(i, j, 0) <= G.getValueXY(i - 1, j + 1, 0) ||
              G.getValueXY(i, j, 0) <= G.getValueXY(i + 1, j - 1, 0))) ||
          (dir === 2 &&
            (G.getValueXY(i, j, 0) <= G.getValueXY(i - 1, j, 0) ||
              G.getValueXY(i, j, 0) <= G.getValueXY(i + 1, j, 0))) ||
          (dir === 3 &&
            (G.getValueXY(i, j, 0) <= G.getValueXY(i - 1, j - 1, 0) ||
              G.getValueXY(i, j, 0) <= G.getValueXY(i + 1, j + 1, 0)))
        )
      ) {
        nms.setValueXY(i, j, 0, G.getValueXY(i, j, 0));
      }
    }
  }

  for (let i = 0; i < width * height; ++i) {
    let currentNms = nms.data[i];
    let currentEdge = 0;
    if (currentNms > highThreshold) {
      currentEdge++;
      finalImage.data[i] = brightness;
    }
    if (currentNms > lowThreshold) {
      currentEdge++;
    }

    edges.data[i] = currentEdge;
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
