import { Mask } from '..';
import { borderIterator } from '../utils/borderIterator';
import { maskToOutputMask } from '../utils/getOutputImage';

export interface ClearBorderOptions {
  /**
   * Consider pixels connected by corners?
   *
   * @default false
   */
  allowCorners?: boolean;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Mask;
}

const MAX_ARRAY = 65536; // 65536 should be enough for most of the cases
const toProcess = new Uint32Array(MAX_ARRAY);

/**
 * Set the pixels connected to the border of the mask to zero. You can chose to allow corner connection of not with the `allowCorners` option.
 *
 * @param mask - The mask to process.
 * @param options - Clear border options.
 * @returns The image with cleared borders.
 */
export function clearBorder(
  mask: Mask,
  options: ClearBorderOptions = {},
): Mask {
  let { allowCorners = false } = options;

  let newMask = maskToOutputMask(mask, options, { clone: true });

  let alreadyConsidered = Mask.createFrom(mask);

  const maxValue = mask.maxValue;

  let from = 0;
  let to = 0;

  // find relevant border pixels
  for (let pixelIndex of borderIterator(mask)) {
    if (newMask.getBitByIndex(pixelIndex) === maxValue) {
      toProcess[to++ % MAX_ARRAY] = pixelIndex;
      alreadyConsidered.setBitByIndex(pixelIndex, 1);
      newMask.setBitByIndex(pixelIndex, 0);
    }
  }

  // find pixels connected to the border pixels
  while (from < to) {
    if (to - from > MAX_ARRAY) {
      throw new Error(
        'clearBorder: could not process image, overflow in the data processing array.',
      );
    }
    const currentPixel = toProcess[from++ % MAX_ARRAY];
    newMask.setBitByIndex(currentPixel, 0);

    // check if pixel is on a border
    const topBorder = currentPixel < mask.width;
    const leftBorder = currentPixel % mask.width === 0;
    const rightBorder = currentPixel % mask.width === mask.width - 1;
    const bottomBorder = currentPixel > mask.size - mask.width;

    // check neighbours

    if (!bottomBorder) {
      const bottom = currentPixel + mask.width;

      addToProcess(bottom);
    }
    if (!leftBorder) {
      const left = currentPixel - 1;
      addToProcess(left);
    }
    if (!topBorder) {
      const top = currentPixel - mask.width;
      addToProcess(top);
    }
    if (!rightBorder) {
      const right = currentPixel + 1;
      addToProcess(right);
    }
    if (allowCorners) {
      if (!topBorder) {
        if (!leftBorder) {
          const topLeft = currentPixel - mask.width - 1;
          addToProcess(topLeft);
        }
        if (!rightBorder) {
          const topRight = currentPixel - mask.width + 1;
          addToProcess(topRight);
        }
      }
      if (!bottomBorder) {
        if (!leftBorder) {
          const bottomLeft = currentPixel + mask.width - 1;
          addToProcess(bottomLeft);
        }
        if (!rightBorder) {
          const bottomRight = currentPixel + mask.width + 1;
          addToProcess(bottomRight);
        }
      }
    }
  }

  return newMask;

  function addToProcess(pixel: number): void {
    if (alreadyConsidered.getBitByIndex(pixel)) return;
    if (newMask.getBitByIndex(pixel) === mask.maxValue) {
      toProcess[to++ % MAX_ARRAY] = pixel;
      alreadyConsidered.setBitByIndex(pixel, 1);
    }
  }
}
