import { Image } from '../../../src';

/**
 * Draw a rectangle on the image.
 *
 * @param image - Input image.
 * @returns The image with the rectangle.
 */
export function testDrawRectangle(image: Image): Image {
  const result = image.drawRectangle({
    origin: { column: 50, row: 50 },
    width: 100,
    height: 100,
    strokeColor: [0, 255, 0, 255],
    strokeWidth: 20,
    fillColor: [0, 50, 0, 255],
  });

  return result;
}
