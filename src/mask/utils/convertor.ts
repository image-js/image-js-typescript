import { BitValue } from '../Mask';

/**
 * Converts a bit value to the corresponding number.
 *
 * @param value - The bit to convert.
 * @returns The bit value as a number.
 */
export function convertToNumber(value: BitValue): number {
  let result;
  if (typeof value === 'boolean') {
    result = value ? 1 : 0;
  } else {
    result = value;
  }

  return result;
}
