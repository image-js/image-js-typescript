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
    const width = stack[0].width;
    const height = stack[0].height;

    for (let i = 1; i < stack.length; i++) {
      if (stack[i].width !== width || stack[i].height !== height) {
        throw new RangeError(
          `images must all have same dimensions to apply this algorithm`,
        );
      }
    }
  }
}
