import { Image, Point } from '..';

/**
 *
 * @param image
 * @param cellsize
 * @param out
 */
export function pixelate(image: Image, cellsize: number, out?: Image): Image {
  if (out === undefined) {
    return getPixelization(image, cellsize);
  } else {
    const newImage = image.clone();
    return getPixelization(newImage, cellsize);
  }
}

/**
 *Find the center of a rectangle to be pixelated
 *
 * @param width - width of a rectangle to change
 * @param height - height of a rectangle to change
 * @param origin - top left corner of a rectangle
 * @returns Point
 */
function getCenter(width: number, height: number, origin: Point): Point {
  const center = {
    column: Math.floor((origin.column + width - 1) / 2),
    row: Math.floor((origin.row + height - 1) / 2),
  };

  return center;
}

function getPixelization(image: Image, cellsize: number): Image {
  for (let channel = 0; channel < image.channels; channel++) {
    for (let i = 0; i < image.width; i += cellsize) {
      for (let j = 0; j < image.height; j += cellsize) {
        if (
          image.height - (j + cellsize) >= 0 &&
          image.width - (i + cellsize) >= 0
        ) {
          const center = getCenter(cellsize, cellsize, {
            column: i,
            row: j,
          });

          const value = image.getValue(center.column, center.row, channel);

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
            const center = getCenter(image.width, cellsize, {
              column: i,
              row: j,
            });

            const value = image.getValue(center.column, center.row, channel);

            for (let n = i; n < image.width; n++) {
              for (let k = j; k < j + cellsize; k++) {
                image.setValue(n, k, channel, value);
              }
            }
          } else if (
            j >= image.height - remainingHeight - 1 &&
            i <= image.width - remainingWidth - 1
          ) {
            const center = getCenter(cellsize, image.height, {
              column: i,
              row: j,
            });

            const value = image.getValue(center.column, center.row, channel);

            for (let n = i; n < i + cellsize; n++) {
              for (let k = j; k < image.height; k++) {
                image.setValue(n, k, channel, value);
              }
            }
          } else {
            const center = getCenter(image.width, image.height, {
              column: i,
              row: j,
            });

            const value = image.getValue(center.column, center.row, channel);

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
