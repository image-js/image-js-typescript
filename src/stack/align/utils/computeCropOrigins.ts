import { CommonArea } from './findCommonArea';

/**
 * Compute the origins of the crops relative to the top left corner of each image in order
 * to crop the common area of each of the images of an aligned stack.
 * @param stack - Stack to process.
 * @param commonArea - The data of the common area of the stack.
 * @returns The origins of the crops.
 */
export function computeCropOrigins(
  stack: Stack,
  commonArea: CommonArea,
): Point[] {}
