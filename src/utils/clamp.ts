import { IJS } from '../IJS';

export type ClampFunction = (value: number) => number;

/**
 * @param image
 */
export function getClamp(image: IJS): ClampFunction {
  if (image.maxValue === 255) {
    return clamp255;
  }
  if (image.maxValue === 65535) {
    return clamp65535;
  }
  throw new Error(`unknown maxValue: ${image.maxValue}`);
}
/**
 * Clamp value for 8-bit images.
 *
 * @param value - Value to clamp.
 * @returns The clamped value.
 */
function clamp255(value: number): number {
  return Math.min(Math.max(value, 0), 255);
}

/**
 * Clamp value for 16-bit images.
 *
 * @param value - Value to clamp.
 * @returns The clamped value.
 */
function clamp65535(value: number): number {
  return Math.min(Math.max(value, 0), 65535);
}
