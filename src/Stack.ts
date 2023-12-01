import { Image } from './Image';

export class Mask {
  /**
   * The number of images in stack.
   */
  public readonly size: number;

  public constructor(images: Image[], options: StackOptions = {}) {}

  /**
   * Return the image containing the minimum values of all the images in the stack for
   * each pixel .
   */
  public minImage(): Image {}

  /**
   * Return the image containing the maximum values of all the images in the stack for
   * each pixel .
   */
  public maxImage(): Image {}

  /**
   * Return the image containing the median values of all the images in the stack for
   * each pixel .
   */
  public medianImage(): Image {}

  /**
   * Return the image containing the average values of all the images in the stack for
   * each pixel .
   */
  public averageImage(): Image {}

  /**
   * Get the histograms of all the images of the stack.
   */
  public getHistograms(): Uint32Array {}
  /**
   * Get the global histogram of the stack.
   */
  public getHistogram(): Uint32Array {}

  /**
   * Return an array containing the maximum values of each image of the stack.
   */
  public max(): number[] {}

  /**
   * Return an array containing the minimum values of each image of the stack.
   */
  public min(): number[] {}

  /**
   * Align all the images of the stack on the image at the given index.
   * @param refIndex - The index of the reference image.
   */
  public alignImages(refIndex: number): Stack {}

  /**
   * Crop all the images of the stack to desired dimensions.
   * @param options - The cropping options.
   */
  public crop(options: CropOptions): Stack {}

  /**
   * Add all the images of the stack and return a 16 bits image containing the sum.
   */
  public sum(): Image {}
}

export interface CropOptions {
  /**
   * The top left corner of the crop rectangle.
   * @default {row: 0, column: 0}
   */
  origin?: Point;
  /**
   * The width of the crop rectangle.
   * @default image width
   */
  width?: number;
  /**
   * The height of the crop rectangle.
   * @default image height
   */
  height?: number;
}
