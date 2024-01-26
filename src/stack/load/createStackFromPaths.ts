import { Stack } from '../../Stack';
import { readSync } from '../../load';

/**
 * Create a new stack from an array of paths to the images.
 * @param paths - Array of paths to the images from which to create the stack.
 * @returns A new stack.
 */
export function createStackFromPaths(paths: string[]): Stack {
  const images = paths.map((path) => {
    return readSync(path);
  });
  return new Stack(images);
}
