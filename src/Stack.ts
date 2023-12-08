import { Image } from './Image';
import { Point } from './geometry';
import { minImage } from './stack/minImage';
import { checkImagesValid } from './stack/utils/checkImagesValid';

export class Stack {
  /**
   * The array of images.
   */
  private readonly images: Image[];
  /**
   * The stack size.
   */
  public readonly size: number;

  /**
   * Create a new stack from an array of images.
   * The images must have the same bit depth and color model.
   * This class extends the Array class, which gives you access to methods like
   * forEach, map, reduce, ...
   * @param images - Array of images from which to create the stack.
   */
  public constructor(images: Image[]) {
    checkImagesValid(images);
    this.images = images;
    this.size = images.length;
  }

  /**
   * Clone a stack.
   * @returns A new stack with the same images.
   */
  public clone(): Stack {
    return new Stack(this.images.map((image) => image.clone()));
  }

  /**
   * Get the images of the stack. Mainly for debugging purposes.
   * @returns The images.
   */
  public getImages(): Image[] {
    return this.images;
  }

  /**
   * Get the image at the given index.
   * @param index - The index of the image.
   * @returns The image.
   */
  public getImage(index: number): Image {
    return this.images[index];
  }

  /**
   * Get a value from an image of the stack.
   * @param stackIndex - Index of the image in the stack.
   * @param row - Row index of the pixel.
   * @param column - Column index of the pixel.
   * @param channel - The channel to retrieve.
   * @returns The value at the given position.
   */
  public getValue(
    stackIndex: number,
    row: number,
    column: number,
    channel: number,
  ): number {
    return this.images[stackIndex].getValue(row, column, channel);
  }

  /**
   * Get a value from an image of the stack. Specify the pixel position using its index.
   * @param stackIndex - Index of the image in the stack.
   * @param index - The index of the pixel.
   * @param channel - The channel to retrieve.
   * @returns The value at the given position.
   */
  public getValueByIndex(
    stackIndex: number,
    index: number,
    channel: number,
  ): number {
    return this.images[stackIndex].getValueByIndex(index, channel);
  }

  /**
   * Return the image containing the minimum values of all the images in the stack for
   * each pixel.
   * @returns The minimum image.
   */
  public minImage(): Image {
    return minImage(this);
  }

  /**
   * Return the image containing the maximum values of all the images in the stack for
   * each pixel.
   */
  // public maxImage(): Image {}

  /**
   * Return the image containing the median values of all the images in the stack for
   * each pixel.
   */
  // public medianImage(): Image {}

  /**
   * Return the image containing the average values of all the images in the stack for
   * each pixel.
   */
  // public averageImage(): Image {}

  /**
   * Get the global histogram of the stack.
   */
  // public getHistogram(): Uint32Array {}

  /**
   * Align all the images of the stack on the image at the given index.
   * @param refIndex - The index of the reference image.
   */
  // public alignImages(refIndex: number): Stack {}

  /**
   * Add all the images of the stack and return a 16 bits image containing the sum.
   */
  // public sum(): Image {}
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
