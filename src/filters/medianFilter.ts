import { xMedian } from 'ml-spectra-processing';

import { Image } from '../Image';
import checkProcessable from '../utils/checkProcessable';
// import { validateChannels } from '../utils/validators';

/**
 *
 * @param image
 * @param data
 * @param options
 * @param options.radius
 * @param options.border
 * @param options.channels
 */
export function medianFilter(
  image: Image,
  data: number[],
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

  for (let channel = 1; channel <= channels; channel++) {
    let c = channel;
    for (let y = kHeight; y < image.height - kHeight; y++) {
      for (let x = kWidth; x < image.width - kWidth; x++) {
        let n = 0;
        for (let j = -kHeight; j <= kHeight; j++) {
          for (let i = -kWidth; i <= kWidth; i++) {
            let index = ((y + j) * image.width + x + i) * image.channels + c;
            kernel[n++] = data[index];
          }
        }

        let index = (y * image.width + x) * image.channels + c;

        newImage.data[index] = xMedian(kernel);
      }
    }
  }
  // if (newImage.alpha && !channels.includes(newImage.channels)) {
  //   for (
  //     let i = newImage.components;
  //     i < data.length;
  //     i = i + newImage.channels
  //   ) {
  //     data[i] = newImage.data[i];
  //   }
  // }

  // setBorder(kWidth, kHeight, newImage);

  return newImage;
}

// function setBorder(kWidth: number, kHeight: number, image: Image) {
//   let leftRightSize = kWidth;
//   let topBottomSize = kHeight;
//   let channels = image.channels;

//   for (let i = leftRightSize; i < image.width - leftRightSize; i++) {
//     for (let k = 0; k < channels; k++) {
//       let value =
//         image.color[k] ||
//         image.data[(i + image.width * topBottomSize) * channels + k];
//       for (let j = 0; j < topBottomSize; j++) {
//         image.data[(j * image.width + i) * channels + k] = value;
//       }
//       value =
//         color[k] ||
//         image.data[
//           (i + image.width * (image.height - topBottomSize - 1)) * channels + k
//         ];
//       for (let j = image.height - topBottomSize; j < image.height; j++) {
//         image.data[(j * image.width + i) * channels + k] = value;
//       }
//     }
//   }

//   for (let j = 0; j < image.height; j++) {
//     for (let k = 0; k < channels; k++) {
//       let value =
//         color[k] ||
//         image.data[(j * image.width + leftRightSize) * channels + k];
//       for (let i = 0; i < leftRightSize; i++) {
//         image.data[(j * image.width + i) * channels + k] = value;
//       }
//       value =
//         color[k] ||
//         image.data[
//           (j * image.width + image.width - leftRightSize - 1) * channels + k
//         ];
//       for (let i = this.width - leftRightSize; i < image.width; i++) {
//         image.data[(j * image.width + i) * channels + k] = value;
//       }
//     }
//   }

//   return image;
// }
