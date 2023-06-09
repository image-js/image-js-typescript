import { xMedian } from 'ml-spectra-processing';

import { Image } from '../Image';
import checkProcessable from '../utils/checkProcessable';
//import { validateChannels } from '../utils/validators';

/**
 * Apply a median filter to the image.
 *
 * @param image - Image to be filtered.
 * @param options - Options to apply for median filter.
 * @param options.radius - Size of the area to calculate median value from.
 * @param options.channels - Number of channels.
 * @param options.cellSize
 * @returns Image after median filter.
 */
export function medianFilter(
  image: Image,
  options: { cellSize?: number; channels?: number } = {},
) {
  let { cellSize = 1, channels = image.channels } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  if (cellSize < 1) {
    throw new RangeError('radius must be greater than 0');
  }

  // validateChannels(options.channels as number[], image);

  let kSize = cellSize;
  let newImage = Image.createFrom(image);
  let size = (kSize * 2 + 1) * (kSize * 2 + 1);
  let kernel;
  if (image.bitDepth === 16) {
    kernel = new Uint16Array(size);
  } else {
    kernel = new Uint8Array(size);
  }

  for (let channel = 0; channel < channels; channel++) {
    for (let row = kSize; row < image.height - kSize; row++) {
      for (let column = kSize; column < image.width - kSize; column++) {
        let n = 0;
        for (let cellSizeRow = -kSize; cellSizeRow <= kSize; cellSizeRow++) {
          for (
            let cellSizeColumn = -kSize;
            cellSizeColumn <= kSize;
            cellSizeColumn++
          ) {
            kernel[n++] = image.getValue(
              column + cellSizeColumn,
              row + cellSizeRow,
              channel,
            );
          }
        }

        newImage.setValue(column, row, channel, xMedian(kernel));
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
  setBorder(kSize, image, newImage);
  return newImage;
}

function setBorder(kSize: number, image: Image, newImage: Image) {
  let borderSize = kSize;

  let channels = image.channels;

  for (let column = borderSize; column < image.width - borderSize; column++) {
    for (let channel = 0; channel < channels; channel++) {
      let value = newImage.getValue(column, borderSize, channel);

      for (let row = 0; row < borderSize; row++) {
        newImage.setValue(column, row, channel, value);
      }
      value =
        newImage.getValue(column, image.height - borderSize - 1, channel) ||
        image.getValue(column, image.height - borderSize, channel);

      for (let row = image.height - borderSize; row < image.height; row++) {
        newImage.setValue(column, row, channel, value);
      }
    }
  }

  for (let row = 0; row < image.height; row++) {
    for (let channel = 0; channel < channels; channel++) {
      let value = newImage.getValue(borderSize, row, channel);

      for (let column = 0; column < borderSize; column++) {
        newImage.setValue(column, row, channel, value);
      }
      value =
        newImage.getValue(image.width - borderSize - 1, row, channel) ||
        image.getValue(image.width - borderSize, row, channel);

      for (
        let column = image.width - borderSize;
        column < image.width;
        column++
      ) {
        newImage.setValue(column, row, channel, value);
      }
    }
  }

  return newImage;
}
