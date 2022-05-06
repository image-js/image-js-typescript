import { IJS, ImageColorModel } from '../../../src';

/**
 * Extract the pixels of a mask from the image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testExtract(image: IJS): IJS {
  const background = new IJS(image.width, image.height, {
    colorModel: ImageColorModel.RGBA,
  });

  background.fill([0, 255, 0, 255]);

  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold();

  const extracted = image.extract(mask);

  return extracted.copyTo(background);
}
