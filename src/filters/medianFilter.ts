import { xMedian } from 'ml-spectra-processing';

import { Image } from '../Image';
import checkProcessable from '../utils/checkProcessable';
//import { validateChannels } from '../utils/validators';

/**
 *Some description
 *
 * @param image - some
 * @param data - some
 * @param options - some
 * @param options.radius - some
 * @param options.border - some
 * @param options.channels - some
 * @returns image
 */
export function medianFilter(
  image: Image,
  options: { radius?: number; border?: string; channels?: number } = {},
) {
  let { radius = 1, channels = image.channels } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  if (radius < 1) {
    throw new Error('radius must be greater than 0');
  }

  // validateChannels(options.channels as number[], image);

  let kWidth = radius;
  let kHeight = radius;
  let newImage = Image.createFrom(image);
  let size = (kWidth * 2 + 1) * (kHeight * 2 + 1);
  let kernel;
  if (image.bitDepth === 16) {
    kernel = new Uint16Array(size);
  } else {
    kernel = new Uint8Array(size);
  }

  for (let channel = 0; channel < channels; channel++) {
    for (let y = kHeight; y < image.height - kHeight; y++) {
      for (let x = kWidth; x < image.width - kWidth; x++) {
        let n = 0;
        for (let j = -kHeight; j <= kHeight; j++) {
          for (let i = -kWidth; i <= kWidth; i++) {
            kernel[n++] = image.getValue(x + i, y + j, channel);
          }
        }
        newImage.setValue(y, x, channel, xMedian(kernel));
      }
    }
  }

  // if (newImage.alpha && !channels.includes(newImage.channels)) {
  //   for (
  //     let i = newImage.components;
  //     i < image.data.length;
  //     i = i + newImage.channels
  //   ) {
  //     image.data[i] = newImage.data[i];
  //   }
  // }

  setBorder(kWidth, kHeight, image, newImage);

  return newImage;
}

function setBorder(
  kWidth: number,
  kHeight: number,
  image: Image,
  newImage: Image,
) {
  let leftRightSize = kWidth;
  let topBottomSize = kHeight;
  let channels = image.channels;

  for (let i = leftRightSize; i < image.width - leftRightSize; i++) {
    for (let k = 0; k < channels; k++) {
      let value = image.getValue(i, topBottomSize, k);
      for (let j = 0; j < topBottomSize; j++) {
        newImage.setValue(i, j, k, value);
      }
      value = image.getValue(i, image.height - topBottomSize - 1, k);
      for (let j = image.height - topBottomSize; j < image.height; j++) {
        newImage.setValue(i, j, k, value);
      }
    }
  }

  for (let j = 0; j < image.height; j++) {
    for (let k = 0; k < channels; k++) {
      let value = image.getValue(leftRightSize, j, k);
      for (let i = 0; i < leftRightSize; i++) {
        newImage.setValue(i, j, k, value);
      }
      value = image.getValue(image.width - leftRightSize - 1, j, k);

      for (let i = image.width - leftRightSize; i < image.width; i++) {
        newImage.setValue(i, j, k, value);
      }
    }
  }

  return newImage;
}
