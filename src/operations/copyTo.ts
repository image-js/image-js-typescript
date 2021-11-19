import { IJS } from '..';

interface CopyToOptions {
  columnOffset?: number;
  rowOffset?: number;
}

/**
 * Copy the image to a bigger one by specifying the location in the big image.
 *
 * @param source
 * @param target - The target image
 * @param options - copyTo options
 */
export default function copyTo(
  source: IJS,
  target: IJS,
  options: CopyToOptions,
) {
  const { columnOffset = 0, rowOffset = 0 } = options;

  if (source.alpha) {
    for (let row = 0; row < source.height; row++) {
      for (let column = 0; column < source.width; column++) {
        let sourcePixel = source.getPixel(row, column);
        let sourceAlpha = sourcePixel[source.components - 1];
        for (let channel = 0; channel < source.channels; channel++) {
          let sourceChannel = sourcePixel[channel];
        }
      }
    }
  }
}

function getNewValue(
  sourceColor: number,
  sourceAlpha: number,
  targetColor: number,
): number[] {
  let newAlpha =
    sourcePixel.alpha + targetPixel.alpha * (source - sourcePixel.alpha);
}
