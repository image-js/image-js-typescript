import { Stack } from '../../Stack';
import { format } from '../../utils/validators/checkProcessable';

interface CheckStackOptions {
  /**
   * All images should have the same dimensions.
   * @default `false`
   */
  sameDimensions?: boolean;
  /**
   * Verify that the images have or don't have an alpha channel.
   */
  alpha?: boolean;
  /**
   *
   */
  depth?: number | number[];
}

/**
 * This method checks if a process can be applied on the stack.
 * @param stack - Stack to verify.
 * @param options - Check processable options.
 */
export function checkProcessable(
  stack: Stack,
  options: CheckStackOptions = {},
) {
  const { sameDimensions = false, alpha } = options;
  let { depth } = options;
  if (sameDimensions) {
    const width = stack.getImage(0).width;
    const height = stack.getImage(0).height;

    for (let i = 1; i < stack.size; i++) {
      const currentImage = stack.getImage(i);
      if (currentImage.width !== width || currentImage.height !== height) {
        throw new RangeError(
          `images must all have same dimensions to apply this algorithm`,
        );
      }
    }
  }
  if (alpha !== undefined && alpha !== stack.alpha) {
    throw new RangeError(
      `stack images ${
        alpha ? 'should' : 'should not'
      } have an alpha channel to apply this algorithm`,
    );
  }
  if (depth) {
    if (!Array.isArray(depth)) {
      depth = [depth];
    }
    if (!depth.includes(stack.depth)) {
      throw new RangeError(
        `image depth must be ${format(depth)} to apply this algorithm`,
      );
    }
  }
}
