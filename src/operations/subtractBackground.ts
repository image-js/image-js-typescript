import Matrix from 'ml-matrix';
//@ts-expect-error check test
import * as Regression from 'ml-regression';

import { Image } from '../Image';
import { Point } from '../geometry';
import checkProcessable from '../utils/validators/checkProcessable';
/**
 * Subtracts background from an image for baseline correction.
 * @param image - Image to subtract background from.
 * @param background - Points that are considered the background of an image.
 * @param order - Order of regression function.
 * @returns Image with corrected baseline.
 */
export function subtractBackground(
  image: Image,
  background: Point[],
  order: number,
) {
  checkProcessable(image, { colorModel: ['GREY'] });
  const Xs = new Matrix(background.length, 2);
  const Ys = new Matrix(background.length, 1);
  for (let i = 0; i < background.length; i++) {
    Xs.setRow(i, [
      0.5 - background[i].column / (image.width - 1),
      0.5 - background[i].row / (image.height - 1),
    ]);
    Ys.setRow(i, [image.getValue(background[i].column, background[i].row, 0)]);
  }
  const model = new Regression.PolinomialFitting2D(Xs, Ys, { order });
  const X = new Array(image.width * image.height);

  for (let i = 0; i < image.height; i++) {
    for (let j = 0; j < image.width; j++) {
      X[i * image.width + j] = [
        0.5 - j / (image.width - 1),
        0.5 - i / (image.height - 1),
      ];
    }
  }
  const Y = model.predict(X);

  for (let i = 0; i < image.height; i++) {
    for (let j = 0; j < image.width; j++) {
      const value = Math.abs(Y[i * image.width + j] - image.getValue(j, i, 0));
      image.setValue(j, i, 0, value);
    }
  }
  return image;
}
