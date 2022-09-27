import { Image } from '../Image';
import { Mask } from '../Mask';
import checkProcessable from '../utils/checkProcessable';
import { Point } from '../utils/geometry/points';
import { getDefaultColor } from '../utils/getDefaultColor';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage';

export interface DrawRectangleOptions<OutType> {
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   *
   * @default {row: 0, column: 0}
   */
  origin?: Point;
  /**
   * Specify the width of the rectangle.
   *
   * @default image.width
   */
  width?: number;
  /**
   * Specify the width of the rectangle
   *
   * @default image.height
   */
  height?: number;
  /**
   * Color of the rectangle's border. Should be an array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   * @default black
   */
  strokeColor?: number[] | 'none';
  /**
   * Stroke width in pixels.
   *
   * @default 0
   */
  strokeWidth?: number;
  /**
   * Rectangle fill color array of N elements (e.g. R, G, B or G, A), N being the number of channels.
   *
   */
  fillColor?: number[];
  /**
   * Image to which the resulting image has to be put.
   */
  out?: OutType;
}

export function drawRectangle(
  image: Image,
  options?: DrawRectangleOptions<Image>,
): Image;
export function drawRectangle(
  image: Mask,
  options?: DrawRectangleOptions<Mask>,
): Mask;
/**
 * Draw a rectangle defined by position of the top-left corner, width and height.
 *
 * @param image - Image to process.
 * @param options - Draw rectangle options.
 * @returns The image with the rectangle drawing.
 */
export function drawRectangle(
  image: Image | Mask,
  options: DrawRectangleOptions<Mask | Image> = {},
): Image | Mask {
  const {
    origin = { column: 0, row: 0 },
    width = image.width,
    height = image.height,
    strokeColor = getDefaultColor(image),
    strokeWidth = 0,
    fillColor: fill,
  } = options;
  const { column, row } = origin;

  let newImage;
  if (image instanceof Image) {
    checkProcessable(image, 'drawRectangle', {
      bitDepth: [8, 16],
    });
    newImage = getOutputImage(image, options, { clone: true });
  } else {
    newImage = maskToOutputMask(image, options, { clone: true });
  }

  if (fill) {
    for (
      let currentRow = row + 1;
      currentRow < row + height - 1;
      currentRow++
    ) {
      for (
        let currentColumn = column + 1;
        currentColumn < column + width - 1;
        currentColumn++
      ) {
        newImage.setVisiblePixel(currentColumn, currentRow, fill);
        newImage.setVisiblePixel(currentColumn, currentRow, fill);
      }
    }
  }

  if (strokeColor !== 'none') {
    const points = [
      { row: 0, column: 0 },
      { row: 0, column: width - 1 },
      { row: height - 1, column: width - 1 },
      { row: height - 1, column: 0 },
      { row: 0, column: 0 },
    ];
    newImage = newImage.drawPolygon(points, {
      origin,
      strokeColor,
      strokeWidth,
    });
  }

  return newImage;
}
