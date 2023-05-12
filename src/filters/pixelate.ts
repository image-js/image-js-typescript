import { Image } from '..';

/**
 *
 * @param image
 * @param cellsize
 * @param out
 */
export function pixelate(image: Image, cellsize: number) {
  for (let channel = 0; channel < image.channels; channel++) {
    for (let i = 0; i < image.width; i += cellsize) {
      for (let j = 0; j < image.height; j += cellsize) {
        if (
          image.height - (j + cellsize) >= 0 &&
          image.width - (i + cellsize) >= 0
        ) {
          let centerRow = Math.floor((j + j + cellsize - 1) / 2);
          let centerColumn = Math.floor((i + i + cellsize - 1) / 2);

          const value = image.getValue(centerColumn, centerRow, channel);

          for (let n = i; n < i + cellsize; n++) {
            for (let k = j; k < j + cellsize; k++) {
              image.setValue(n, k, channel, value);
            }
          }
        } else {
          let remainingWidth = image.width % cellsize;
          let remainingHeight = image.height % cellsize;
          if (
            i >= image.width - remainingWidth - 1 &&
            j <= image.height - remainingHeight - 1
          ) {
            let centerColumn = Math.floor((i + image.width - 1) / 2);
            let centerRow = Math.floor((j + j + cellsize - 1) / 2);

            const value = image.getValue(centerColumn, centerRow, channel);

            for (let n = i; n < image.width; n++) {
              for (let k = j; k < j + cellsize; k++) {
                image.setValue(n, k, channel, value);
              }
            }
          } else if (
            j >= image.height - remainingHeight - 1 &&
            i <= image.width - remainingWidth - 1
          ) {
            let centerColumn = Math.floor((i + i + cellsize - 1) / 2);
            let centerRow = Math.floor((j + image.height - 1) / 2);

            const value = image.getValue(centerColumn, centerRow, channel);

            for (let n = i; n < i + cellsize; n++) {
              for (let k = j; k < image.height; k++) {
                image.setValue(n, k, channel, value);
              }
            }
          } else {
            let centerColumn = Math.floor((i + image.width - 1) / 2);
            let centerRow = Math.floor((j + image.height - 1) / 2);

            const value = image.getValue(centerColumn, centerRow, channel);

            for (let n = i; n < image.width; n++) {
              for (let k = j; k < image.height; k++) {
                image.setValue(n, k, channel, value);
              }
            }
          }
        }
      }
    }
  }

  return image;
}
