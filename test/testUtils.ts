import { readFileSync } from 'fs';
import { join } from 'path';

import { IJS, ImageColorModel, readSync } from '../src';

import { TestImagePath } from './TestImagePath';
import { createImageFromData } from './createImageFromData';

/**
 * Retrun the path to a given image.
 *
 * @param name - Test image name.
 * @returns The path to the image.
 */
export function getPath(name: TestImagePath): string {
  return join(__dirname, 'img/', name);
}

/**
 * Returns a buffer of the given image.
 *
 * @param path - Path to the image.
 * @returns Buffer of the image.
 */
export function loadBuffer(path: TestImagePath): Uint8Array {
  return readFileSync(join(__dirname, 'img', path));
}

/**
 * Load an image from the test/img directory.
 *
 * @param path - Path to the image.
 * @returns The image.
 */
export function load(path: TestImagePath): IJS {
  return readSync(join(__dirname, 'img', path));
}
/**
 * Create an image from 8-bit Grey data.
 *
 * @param imageData - Raw image data.
 * @returns The grey image.
 */
export function createGreyImage(imageData: number[][] | string): IJS {
  return createImageFromData(imageData, ImageColorModel.GREY);
}

/**
 * Create an image from 8-bit Greya data.
 *
 * @param imageData - Raw image data.
 * @returns The greya Image.
 */
export function createGreyaImage(imageData: number[][] | string): IJS {
  return createImageFromData(imageData, ImageColorModel.GREYA);
}
/**
 * Create an image from 8-bit RGB data.
 *
 * @param imageData - Raw image data.
 * @returns The RGB image.
 */
export function createRgbImage(imageData: number[][] | string): IJS {
  return createImageFromData(imageData, ImageColorModel.RGB);
}

/**
 * Create an image from 8-bit RGBA data.
 *
 * @param imageData - Raw image data.
 * @returns The RGBA image.
 */
export function createRgbaImage(imageData: number[][] | string): IJS {
  return createImageFromData(imageData, ImageColorModel.RGBA);
}

declare global {
  // eslint-disable-next-line no-var
  var testUtils: {
    getPath: typeof getPath;
    loadBuffer: typeof loadBuffer;
    load: typeof load;
    createGreyImage: typeof createGreyImage;
    createGreyaImage: typeof createGreyaImage;
    createRgbImage: typeof createRgbImage;
    createRgbaImage: typeof createRgbaImage;
  };
}
