import {
  BlurOptions,
  blur,
  ConvolutionOptions,
  directConvolution,
  separableConvolution,
  gaussianBlur,
  GaussianBlurOptions,
} from './filters';
import { invert, InvertOptions } from './filters/invert';
import { convertColor, ConvertColorOptions } from './operations/convertColor';
import { convertDepth } from './operations/convertDepth';
import grey from './operations/grey';
import { split } from './operations/split';
import { ImageColorModel, colorModels } from './utils/colorModels';
import { validateChannel, validateValue } from './utils/validators';

import {
  GreyOptions,
  histogram,
  HistogramOptions,
  resize,
  ResizeOptions,
  rotate,
  RotateOptions,
  transform,
  TransformOptions,
} from '.';

export { ImageColorModel };

export type ImageDataArray = Uint8Array | Uint16Array | Uint8ClampedArray;

export enum ColorDepth {
  UINT8 = 8,
  UINT16 = 16,
}

export enum ImageCoordinates {
  CENTER = 'CENTER',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
}

export interface ImageOptions {
  /**
   * Number of bits per value in each channel.
   * Default: `ColorDepth.UINT8`.
   */
  depth?: ColorDepth;

  /**
   * Typed array holding the image data.
   */
  data?: ImageDataArray;

  /**
   * Color model of the created image.
   * Default: `ImageColorModel.RGB`.
   */
  colorModel?: ImageColorModel;
}

export interface CreateFromOptions extends ImageOptions {
  width?: number;
  height?: number;
}

export type ImageValues = [number, number, number, number];

export class IJS {
  /**
   * The number of columns of the image.
   */
  public readonly width: number;

  /**
   * The number of rows of the image.
   */
  public readonly height: number;

  /**
   * The total number of pixels in the image (width × height).
   */
  public readonly size: number;

  /**
   * The number of bits per value in each channel.
   */
  public readonly depth: ColorDepth;

  /**
   * The color model of the image.
   */
  public readonly colorModel: ImageColorModel;

  /**
   * The number of color channels in the image, excluding the alpha channel.
   * A grey image has 1 component. An RGB image has 3 components.
   */
  public readonly components: number;

  /**
   * The total number of channels in the image, including the alpha channel.
   */
  public readonly channels: number;

  /**
   * Whether the image has an alpha channel or not.
   */
  public readonly alpha: boolean;

  /**
   * The maximum value that a pixel channel can have.
   */
  public readonly maxValue: number;

  /**
   * Typed array holding the image data.
   */
  private readonly data: ImageDataArray;

  /**
   * Construct a new IJS knowing its dimensions.
   *
   * @param width - Image width.
   * @param height - Image height.
   * @param options - Image options.
   */
  public constructor(
    width: number,
    height: number,
    options: ImageOptions = {},
  ) {
    const {
      depth = ColorDepth.UINT8,
      data,
      colorModel = ImageColorModel.RGB,
    } = options;

    if (width < 1 || !Number.isInteger(width)) {
      throw new RangeError(
        `width must be an integer and at least 1. Received ${width}`,
      );
    }

    if (height < 1 || !Number.isInteger(height)) {
      throw new RangeError(
        `height must be an integer and at least 1. Received ${height}`,
      );
    }

    this.width = width;
    this.height = height;
    this.size = width * height;
    this.depth = depth;
    this.colorModel = colorModel;

    const colorModelDef = colorModels[colorModel];
    this.components = colorModelDef.components;
    this.alpha = colorModelDef.alpha;
    this.channels = colorModelDef.channels;

    this.maxValue = 2 ** depth - 1;

    if (data === undefined) {
      this.data = createPixelArray(
        this.size,
        this.channels,
        this.alpha,
        this.depth,
        this.maxValue,
      );
    } else {
      if (depth === ColorDepth.UINT8 && data instanceof Uint16Array) {
        throw new Error(`depth is ${depth} but data is Uint16Array`);
      } else if (depth === ColorDepth.UINT16 && data instanceof Uint8Array) {
        throw new Error(`depth is ${depth} but data is Uint8Array`);
      }
      const expectedLength = this.size * this.channels;
      if (data.length !== expectedLength) {
        throw new RangeError(
          `incorrect data size: ${data.length}. Expected ${expectedLength}`,
        );
      }
      this.data = data;
    }
  }

  /**
   * Create a new IJS base on the properties of an existing one.
   *
   * @param other - Reference image.
   * @param options - Image options.
   * @returns New image.
   */
  public static createFrom(other: IJS, options: CreateFromOptions = {}): IJS {
    const { width = other.width, height = other.height } = options;
    return new IJS(width, height, {
      depth: other.depth,
      colorModel: other.colorModel,
      ...options,
    });
  }

  /**
   * Get all the channels of a pixel.
   *
   * @param row - Row index.
   * @param column - Column index.
   * @returns Channels of the pixel.
   */
  public getPixel(row: number, column: number): number[] {
    const result = [];
    const start = (row * this.width + column) * this.channels;
    for (let i = 0; i < this.channels; i++) {
      result.push(this.data[start + i]);
    }
    return result;
  }

  /**
   * Set all the channels of a pixel.
   *
   * @param row - Row index.
   * @param column - Column index.
   * @param value - New channel values of the pixel to set.
   */
  public setPixel(row: number, column: number, value: number[]): void {
    const start = (row * this.width + column) * this.channels;
    for (let i = 0; i < this.channels; i++) {
      this.data[start + i] = value[i];
    }
  }

  /**
   * Get the value of a specific pixel channel. Select pixel using coordinates.
   *
   * @param row - Row index.
   * @param column - Column index.
   * @param channel - Channel index.
   * @returns Value of the specified channel of one pixel.
   */
  public getValue(row: number, column: number, channel: number): number {
    return this.data[(row * this.width + column) * this.channels + channel];
  }

  /**
   * Set the value of a specific pixel channel. Select pixel using coordinates.
   *
   * @param row - Row index.
   * @param column - Column index.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  public setValue(
    row: number,
    column: number,
    channel: number,
    value: number,
  ): void {
    this.data[(row * this.width + column) * this.channels + channel] = value;
  }

  /**
   * Get the value of a specific pixel channel. Select pixel using index.
   *
   * @param index - Index of the pixel.
   * @param channel - Channel index.
   * @returns Value of the channel of the pixel.
   */
  public getValueByIndex(index: number, channel: number): number {
    return this.data[index * this.channels + channel];
  }
  /**
   * Set the value of a specific pixel channel. Select pixel using index.
   *
   * @param index - Index of the pixel.
   * @param channel - Channel index.
   * @param value - Value to set.
   */
  public setValueByIndex(index: number, channel: number, value: number): void {
    this.data[index * this.channels + channel] = value;
  }

  /**
   * Return the raw image data.
   *
   * @returns The raw data.
   */
  public getRawImage() {
    return {
      width: this.width,
      height: this.height,
      data: this.data,
      channels: this.channels,
      depth: this.depth,
    };
  }

  public [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `IJS {
  width: ${this.width}
  height: ${this.height}
  depth: ${this.depth}
  colorModel: ${this.colorModel}
  channels: ${this.channels}
  data: ${printData(this)}
}`;
  }

  /**
   * Fill the image with a value or a color.
   *
   * @param value - Value or color.
   * @returns The image instance.
   */
  public fill(value: number | number[]): this {
    if (typeof value === 'number') {
      validateValue(value, this);
      this.data.fill(value);
      return this;
    } else {
      if (value.length !== this.channels) {
        throw new RangeError(
          `the size of value must match the number of channels (${this.channels}). Got ${value.length} instead`,
        );
      }
      value.forEach((val) => validateValue(val, this));
      for (let i = 0; i < this.data.length; i += this.channels) {
        for (let j = 0; j <= this.channels; j++) {
          this.data[i + j] = value[j];
        }
      }
      return this;
    }
  }

  /**
   * Fill one channel with a value.
   *
   * @param channel - The channel to fill.
   * @param value - The new value.
   * @returns The image instance.
   */
  public fillChannel(channel: number, value: number): this {
    validateChannel(channel, this);
    validateValue(value, this);
    for (let i = channel; i < this.data.length; i += this.channels) {
      this.data[i] = value;
    }
    return this;
  }

  /**
   * Fill the alpha channel with the specified value.
   *
   * @param value - New channel value.
   * @returns The image instance.
   */
  public fillAlpha(value: number): this {
    validateValue(value, this);
    if (!this.alpha) {
      throw new Error(
        'fillAlpha can only be called if the image has an alpha channel',
      );
    }
    const alphaIndex = this.channels - 1;
    return this.fillChannel(alphaIndex, value);
  }

  /**
   * Create a copy of this image.
   *
   * @returns The image clone.
   */
  public clone(): IJS {
    return IJS.createFrom(this, { data: this.data.slice() });
  }

  public changeEach(cb: (value: number) => number): void {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = cb(this.data[i]);
    }
  }

  public getCoordinates(
    coordinates: ImageCoordinates,
    round = false,
  ): [number, number] {
    switch (coordinates) {
      case ImageCoordinates.CENTER: {
        const centerX = (this.width - 1) / 2;
        const centerY = (this.height - 1) / 2;
        if (round) {
          return [Math.round(centerX), Math.round(centerY)];
        } else {
          return [centerX, centerY];
        }
      }
      case ImageCoordinates.TOP_LEFT:
        return [0, 0];
      case ImageCoordinates.TOP_RIGHT:
        return [this.width - 1, 0];
      case ImageCoordinates.BOTTOM_LEFT:
        return [0, this.height - 1];
      case ImageCoordinates.BOTTOM_RIGHT:
        return [this.width - 1, this.height - 1];
      default:
        throw new Error(`Unknow image coordinates ${coordinates}`);
    }
  }

  // COMPUTE
  public histogram(options?: HistogramOptions): number[] {
    return histogram(this, options);
  }

  // OPERATIONS

  public split(): IJS[] {
    return split(this);
  }

  public convertColor(
    colorModel: ImageColorModel,
    options?: ConvertColorOptions,
  ): IJS {
    return convertColor(this, colorModel, options);
  }

  public convertDepth(newDepth: ColorDepth): IJS {
    return convertDepth(this, newDepth);
  }

  public grey(options?: GreyOptions): IJS {
    return grey(this, options);
  }

  // FILTERS

  public blur(options: BlurOptions): IJS {
    return blur(this, options);
  }

  public directConvolution(
    kernel: number[][],
    options?: ConvolutionOptions,
  ): IJS {
    return directConvolution(this, kernel, options);
  }

  public separableConvolution(
    kernelX: number[],
    kernelY: number[],
    options?: ConvolutionOptions,
  ): IJS {
    return separableConvolution(this, kernelX, kernelY, options);
  }

  public gaussianBlur(options: GaussianBlurOptions): IJS {
    return gaussianBlur(this, options);
  }

  /**
   * Invert the colors of the image.
   *
   * @param options - Inversion options
   * @returns The inverted image.
   */
  public invert(options?: InvertOptions): IJS {
    return invert(this, options);
  }

  // GEOMETRY

  public rotate(angle: number, options: RotateOptions): IJS {
    return rotate(this, angle, options);
  }

  public resize(options: ResizeOptions): IJS {
    return resize(this, options);
  }

  public transform(
    transformMatrix: number[][],
    options: TransformOptions,
  ): IJS {
    return transform(this, transformMatrix, options);
  }
}

/**
 * Create data array and set alpha channel to max value if applicable.
 *
 * @param size - Number of pixels.
 * @param channels - Number of channels.
 * @param alpha - Specify if there is alpha channel.
 * @param depth - Number of bits per channel.
 * @param maxValue - Maximal acceptable value for the channels.
 * @returns The new pixel array.
 */
function createPixelArray(
  size: number,
  channels: number,
  alpha: boolean,
  depth: ColorDepth,
  maxValue: number,
): ImageDataArray {
  const length = channels * size;
  let arr;
  switch (depth) {
    case ColorDepth.UINT8:
      arr = new Uint8Array(length);
      break;
    case ColorDepth.UINT16:
      arr = new Uint16Array(length);
      break;
    default:
      throw new Error(`unexpected color depth: ${depth}`);
  }

  // Alpha channel is 100% by default.
  if (alpha) {
    for (let i = channels - 1; i < length; i += channels) {
      arr[i] = maxValue;
    }
  }

  return arr;
}

/**
 * Returns the image data as a formatted string.
 *
 * @param img - The image instance.
 * @returns Formatted string containing the image data.
 */
function printData(img: IJS): string {
  const channels = [];
  for (let c = 0; c < img.channels; c++) {
    channels.push(`[${printChannel(img, c)}]`);
  }
  return `{
    ${channels.join('\n\n    ')}
  }`;
}

/**
 * Returns all values of a channel as a string.
 *
 * @param img - Input image.
 * @param channel - Specified channel.
 * @returns Formatted string with all values of a channel.
 */
function printChannel(img: IJS, channel: number): string {
  const result = [];
  const padding = img.depth === 8 ? 3 : 5;
  for (let i = 0; i < img.height; i++) {
    const line = [];
    for (let j = 0; j < img.width; j++) {
      line.push(String(img.getValue(i, j, channel)).padStart(padding, ' '));
    }
    result.push(`[${line.join(' ')}]`);
  }
  return result.join('\n     ');
}
