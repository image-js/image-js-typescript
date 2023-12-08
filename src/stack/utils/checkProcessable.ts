import { Stack } from '../../Stack';

interface CheckStackOptions {
  /**
   * All images should have the same size.
   * @default `false`
   */
  sameSize?: boolean;
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
  const { sameSize = false } = options;
  if (sameSize) {
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
}
