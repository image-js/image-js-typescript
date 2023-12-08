import { Image } from '../../Image';

/**
 * Verify all images of array have the same bit depth and color model.
 * @param images - Images to process
 */
export function checkImagesValid(images: Image[]) {
  const colorModel = images[0].colorModel;
  const bitDepth = images[0].bitDepth;

  for (const image of images) {
    if (image.colorModel !== colorModel || image.bitDepth !== bitDepth) {
      throw new RangeError(
        `images must all have the same bit depth and color model`,
      );
    }
  }
}
