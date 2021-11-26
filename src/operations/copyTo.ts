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
 * @returns The target with the source copied to it
 */
export default function copyTo(
  source: IJS,
  target: IJS,
  options: CopyToOptions = {},
): IJS {
  const { columnOffset = 0, rowOffset = 0 } = options;

  if (source.colorModel !== target.colorModel) {
    throw new Error('Source and target should have the same color model.');
  }

  const result = getOutputImage(target, options, { clone: true });
  console.log({ result });

  if (source.alpha) {
    for (let row = 0; row < target.height; row++) {
      for (let column = 0; column < target.width; column++) {
        if (row >= rowOffset && column >= columnOffset) {
          let sourceAlpha = source.getValue(
            row - rowOffset,
            column - columnOffset,
            source.channels - 1,
          );
          let targetAlpha = target.getValue(row, column, source.channels - 1);

          let newAlpha =
            sourceAlpha + targetAlpha * (1 - sourceAlpha / source.maxValue);

          result.setValue(row, column, target.channels - 1, newAlpha);
          for (let component = 0; component < source.components; component++) {
            let sourceComponent = source.getValue(
              row - rowOffset,
              column - columnOffset,
              component,
            );
            let targetComponent = target.getValue(row, column, component);

            let newComponent =
              (sourceComponent * sourceAlpha +
                targetComponent *
                  targetAlpha *
                  (1 - sourceAlpha / source.maxValue)) /
              newAlpha;

            result.setValue(row, column, component, newComponent);
          }
        } else {
          for (let channel = 0; channel < source.channels; channel++) {
            let targetChannel = target.getValue(row, column, channel);
            result.setValue(row, column, channel, targetChannel);
          }
        }
      }
    }
  } else {
    for (let row = 0; row < target.height; row++) {
      for (let column = 0; column < target.width; column++) {
        if (row >= rowOffset && column >= columnOffset) {
          for (let component = 0; component < target.components; component++) {
            let sourceComponent = source.getValue(
              row - rowOffset,
              column - columnOffset,
              component,
            );
            result.setValue(row, column, component, sourceComponent);
          }
        } else {
          for (let component = 0; component < source.components; component++) {
            let targetComponent = target.getValue(row, column, component);
            result.setValue(row, column, component, targetComponent);
          }
        }
      }
    }
  }
  return result;
}
