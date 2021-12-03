// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./jest.d.ts" />

import { IJS, ImageColorModel } from '../src';
import { Mask } from '../src/mask/Mask';

import { TestImagePath } from './TestImagePath';
import { createImageFromData } from './createImageFromData';

interface MatcherResult {
  message: () => string;
  pass: boolean;
}

/**
 * Match a received image to an expected image.
 *
 * @param this - Jest matcher context.
 * @param received - Received image.
 * @param expected - Expected image.
 * @returns - Jest matcher result.
 */
export function toMatchImage(
  this: jest.MatcherContext,
  received: IJS,
  expected: IJS | TestImagePath,
): MatcherResult {
  const expectedImage =
    typeof expected === 'string' ? testUtils.load(expected) : expected;
  let error: string | null = null;

  if (received === expected) {
    error = 'Expected image instances to be different';
  } else if (received.width !== expectedImage.width) {
    error = `Expected image width to be ${expectedImage.width}, but got ${received.width}`;
  } else if (received.height !== expectedImage.height) {
    error = `Expected image height to be ${expectedImage.height}, but got ${received.height}`;
  } else if (received.depth !== expectedImage.depth) {
    error = `Expected image depth to be ${expectedImage.depth}, but got ${received.depth}`;
  } else if (received.colorModel !== expectedImage.colorModel) {
    error = `Expected image color model to be ${expectedImage.colorModel}, but got ${received.colorModel}`;
  } else {
    rowsLoop: for (let row = 0; row < received.height; row++) {
      for (let col = 0; col < received.width; col++) {
        const receivedPixel = received.getPixel(row, col);
        const expectedPixel = expectedImage.getPixel(row, col);
        if (!this.equals(receivedPixel, expectedPixel)) {
          error = `Expected pixel at (${col}, ${row}) to be [${expectedPixel.join(
            ', ',
          )}], but got [${receivedPixel.join(', ')}]`;
          break rowsLoop;
        }
      }
    }
  }

  return {
    message: () => error || '',
    pass: error === null,
  };
}

/**
 * Match a received image to expected image data.
 *
 * @param this - Jest matcher context.
 * @param received - Received image.
 * @param expectedData - Expected image data.
 * @returns - Jest matcher result.
 */
export function toMatchImageData(
  this: jest.MatcherContext,
  received: IJS,
  expectedData: number[][] | string,
): MatcherResult {
  const expectedImage = createImageFromData(expectedData, received.colorModel, {
    depth: received.depth,
  });
  return toMatchImage.call(this, received, expectedImage);
}

/**
 * Match a received mask to an expected mask.
 *
 * @param this - Jest matcher context.
 * @param received - Received mask.
 * @param expected - Expected mask.
 * @returns - Jest matcher result.
 */
export function toMatchMask(
  this: jest.MatcherContext,
  received: Mask,
  expected: Mask,
): MatcherResult {
  let error: string | null = null;

  if (received === expected) {
    error = 'Expected mask instances to be different';
  } else if (received.width !== expected.width) {
    error = `Expected mask width to be ${expected.width}, but got ${received.width}`;
  } else if (received.height !== expected.height) {
    error = `Expected mask height to be ${expected.height}, but got ${received.height}`;
  } else {
    rowsLoop: for (let row = 0; row < received.height; row++) {
      for (let col = 0; col < received.width; col++) {
        const receivedBit = received.getBit(row, col);
        const expectedBit = expected.getBit(row, col);
        if (!this.equals(receivedBit, expectedBit)) {
          error = `Expected bit at (${col}, ${row}) to be ${expectedBit}, but got ${receivedBit}`;
          break rowsLoop;
        }
      }
    }
  }

  return {
    message: () => error || '',
    pass: error === null,
  };
}

/**
 * Match a received mask to expected mask data.
 *
 * @param this - Jest matcher context.
 * @param received - Received mask.
 * @param expectedData - Expected mask data.
 * @returns - Jest matcher result.
 */
export function toMatchMaskData(
  this: jest.MatcherContext,
  received: Mask,
  expectedData: number[][] | string,
): MatcherResult {
  const expectedMask = createImageFromData(
    expectedData,
    ImageColorModel.BINARY,
    {
      depth: received.depth,
    },
  ) as unknown as Mask;
  return toMatchMask.call(this, received, expectedMask);
}
