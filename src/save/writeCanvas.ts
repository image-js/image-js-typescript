import { IJS, ImageColorModel } from '../IJS';

export interface WriteCanvasOptions {
  /**
   * If set to `true`, the canvas element will be resized to fit the image.
   *
   * @default true
   */
  resizeCanvas?: boolean;
  /**
   * @default 0
   */
  dx?: number;
  /**
   * @default 0
   */
  dy?: number;
  /**
   * @default 0
   */
  dirtyX?: number;
  /**
   * @default 0
   */
  dirtyY?: number;
  /**
   * @default image.width
   */
  dirtyWidth?: number;
  /**
   * @default image.height
   */
  dirtyHeight?: number;
}

/**
 * Draw the image in an HTML canvas.
 *
 * @param image - The image to draw.
 * @param canvas - The HTML canvas.
 * @param options - Write canvas options.
 */
export function writeCanvas(
  image: IJS,
  canvas: HTMLCanvasElement,
  options: WriteCanvasOptions = {},
): void {
  if (image.colorModel !== ImageColorModel.RGBA) {
    image = image.convertColor(ImageColorModel.RGBA);
  }
  const {
    resizeCanvas = true,
    dx = 0,
    dy = 0,
    dirtyX = 0,
    dirtyY = 0,
    dirtyWidth = image.width,
    dirtyHeight = image.height,
  } = options;
  if (resizeCanvas) {
    canvas.width = image.width;
    canvas.height = image.height;
  }
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('could not get context from canvas element');
  }
  const data = image.getRawImage().data;
  ctx.putImageData(
    new ImageData(
      new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength),
      image.width,
      image.height,
    ),
    dx,
    dy,
    dirtyX,
    dirtyY,
    dirtyWidth,
    dirtyHeight,
  );
}
