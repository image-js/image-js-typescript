import Matrix from 'ml-matrix';
//@ts-expect-error check test
import * as Regression from 'ml-regression';

import { Image } from '../Image';
import { Point } from '../geometry';
import checkProcessable from '../utils/validators/checkProcessable';

interface SubtractBackgroundOptions {
  /**
   * @param background - Points that are considered the background of an image.
   */
  background: Point[];
  /**
   * @param order - Order of regression function.
   * @default `2`
   */
  order?: number;
  /**
   * Checks if the image background is light or dark. If the background is
   *  light, the output image will be inverted.
   * @default `'light'`
   */
  backgroundKind?: 'dark' | 'light';
}

/**
 * Subtracts background from an image for baseline correction.
 * @param image - Image to subtract background from.
 * @param options - SubtractBackgroundOptions.
 * @returns Image with corrected baseline.
 */
export function subtractBackground(
  image: Image,
  options: SubtractBackgroundOptions,
) {
  const { background, order = 2, backgroundKind = 'light' } = options;
  checkProcessable(image, { colorModel: ['GREY'] });
  const Xs = new Matrix(background.length, 2);
  const Ys = new Matrix(background.length, 1);
  for (let point = 0; point < background.length; point++) {
    Xs.setRow(point, [
      0.5 - background[point].column / (image.width - 1),
      0.5 - background[point].row / (image.height - 1),
    ]);
    Ys.setRow(point, [
      image.getValue(background[point].column, background[point].row, 0),
    ]);
  }
  const model = new Regression.PolinomialFitting2D(Xs, Ys, { order });
  const X = new Array(image.width * image.height);

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      X[row * image.width + column] = [
        0.5 - column / (image.width - 1),
        0.5 - row / (image.height - 1),
      ];
    }
  }
  const Y = model.predict(X);

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      const value = Math.abs(
        image.getValue(column, row, 0) - Y[row * image.width + column],
      );
      image.setValue(column, row, 0, value);
    }
  }
  if (backgroundKind === 'light') {
    return image.invert();
  } else {
    return image;
  }
}
