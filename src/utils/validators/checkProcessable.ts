import { Depth, Image, ImageColorModel, Mask } from '../..';

// @ts-expect-error Intl types don't exist yet
const formatter = new Intl.ListFormat('en', { type: 'disjunction' });

interface CheckOptions {
  depth?: Depth[] | Depth;
  alpha?: boolean[] | boolean;
  colorModel?: ImageColorModel[] | ImageColorModel;
  components?: number[] | number;
  channels?: number[] | number;
}

/**
 * This method checks if a process can be applied on the current image.
 * @param image - Image for which compatibility has to be checked.
 * @param options - Check processable options.
 */
export default function checkProcessable(
  image: Image | Mask,
  options: CheckOptions = {},
) {
  let { depth, alpha, colorModel, components, channels } = options;
  if (depth) {
    if (!Array.isArray(depth)) {
      depth = [depth];
    }
    if (!depth.includes(image.depth)) {
      throw new RangeError(
        `image depth must be ${format(depth)} to apply this algorithm`,
      );
    }
  }
  if (alpha) {
    if (!Array.isArray(alpha)) {
      alpha = [alpha];
    }
    if (!alpha.includes(image.alpha)) {
      throw new RangeError(
        `image alpha must be ${format(alpha)} to apply this algorithm`,
      );
    }
  }
  if (colorModel) {
    if (!Array.isArray(colorModel)) {
      colorModel = [colorModel];
    }
    if (!colorModel.includes(image.colorModel)) {
      throw new RangeError(
        `image colorModel must be ${format(
          colorModel,
        )} to apply this algorithm`,
      );
    }
  }
  if (components) {
    if (!Array.isArray(components)) {
      components = [components];
    }
    if (!components.includes(image.components)) {
      const errorMessage = `image components must be ${format(
        components,
      )} to apply this algorithm`;
      if (components.length === 1 && components[0] === 1) {
        throw new RangeError(
          `${errorMessage}. The image can be converted using "image.grey()"`,
        );
      } else {
        throw new RangeError(errorMessage);
      }
    }
  }
  if (channels) {
    if (!Array.isArray(channels)) {
      channels = [channels];
    }
    if (!channels.includes(image.channels)) {
      throw new RangeError(
        `image channels must be ${format(channels)} to apply this algorithm`,
      );
    }
  }
}

type ArrayType = number[] | ImageColorModel[] | Depth[] | boolean[];

/**
 * Format array to a string.
 * @param array - Array to format.
 * @returns The formatted string.
 */
export function format(array: ArrayType) {
  return formatter.format(array.map(String));
}
