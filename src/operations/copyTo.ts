import { IJS } from '..';
import { getOutputImage } from '../utils/getOutputImage';

export interface CopyToOptions {
  columnOffset?: number;
  rowOffset?: number;
  out?: IJS;
}

/**
 * Copy the image to a bigger one by specifying the location in the big image.
 *
 * @param source - The source image
 * @param target - The target image
 * @param options - copyTo options
 */
export default function copyTo(
  source: IJS,
  target: IJS,
  options: CopyToOptions = {},
): IJS {
  const { columnOffset = 0, rowOffset = 0 } = options;

  if (source.colorModel !== target.colorModel) {
    throw new Error("Source and target aren't of the same color model.");
  }

  // todo: handle what happens if source is copied outside of target

  const newSource = getOutputImage(source, options);

  if (newSource.alpha) {
    for (let row = 0; row < newSource.height; row++) {
      for (let column = 0; column < newSource.width; column++) {
        let sourceAlpha = newSource.getValue(
          row,
          column,
          newSource.channels - 1,
        );
        let targetAlpha = target.getValue(
          row + rowOffset,
          column + columnOffset,
          newSource.channels - 1,
        );
        let newAlpha =
          sourceAlpha + targetAlpha * (newSource.maxValue - targetAlpha);
        target.setValue(
          row + rowOffset,
          column + columnOffset,
          target.channels - 1,
          newAlpha,
        );
        for (let channel = 0; channel < newSource.channels; channel++) {
          let sourceChannel = newSource.getValue(row, column, channel);
          let targetChannel = target.getValue(
            row + rowOffset,
            columnOffset + columnOffset,
            channel,
          );

          let newChannel =
            (sourceChannel * sourceAlpha +
              targetChannel *
                targetAlpha *
                (newSource.maxValue - sourceAlpha)) /
            targetAlpha;
          target.setValue(
            row + rowOffset,
            column + columnOffset,
            channel,
            newChannel,
          );
        }
      }
    }
  } else {
    for (let row = 0; row < newSource.height; row++) {
      for (let column = 0; column < newSource.width; column++) {
        for (let channel = 0; channel < newSource.channels; channel++) {
          let sourceChannel = newSource.getValue(row, column, channel);
          target.setValue(
            row + rowOffset,
            column + columnOffset,
            channel,
            sourceChannel,
          );
        }
      }
    }
  }
  return newSource;
}
