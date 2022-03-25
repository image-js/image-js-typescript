import { RoiKind } from '../RoiManager';
import { ColorMode } from '../colorRois';

import { hsvToRgb } from './hsvToRgb';
import { rgbToNumber } from './rgbToNumber';

export interface GetColorMapOptions {
  /**
   * Number of black ROIs
   */
  nbNegative: number;
  /**
   * Number of white ID ROIs
   */
  nbPositive: number;
  /**
   * Specify the mode: what colors to use in the color map
   *
   * @default ColorMode.BINARY
   */
  mode?: ColorMode;
  /**
   * Specify which ROIs to colour.
   *
   * @default RoiKind.BW
   */
  roiKind?: RoiKind;
}

/**
 * Return a map of 32 bits integers corresponding to the colors of each ROI.
 *
 * @param options - Get color map options.
 * @returns The color map.
 */
export function getColorMap(options: GetColorMapOptions): Uint32Array {
  const {
    mode = ColorMode.BINARY,
    roiKind = RoiKind.BW,
    nbNegative,
    nbPositive,
  } = options;
  switch (mode) {
    case ColorMode.BINARY:
      return getBinaryMap(nbNegative, nbPositive, { roiKind });
    default:
      throw new Error('getColorMap: unknown color mode');
  }
}

// different color maps

export interface ColorMapsOptions {
  /**
   * Specify which ROIs to colour.
   *
   * @default RoiKind.BW
   */
  roiKind?: RoiKind;
}

// warning: the values in a uint32 array are flipped!! e.g. [0,0,0,1] becomes 0x80000000
// the bits values are therefore in the following order: ABGR
// index 32768 corresponds to the middle of the array

/**
 * Return a map where ROIs are red (negative) or green (positive) depending on the ROI index.
 *
 * @param nbNegative - Number of negative indexes in the roiMap.
 * @param nbPositive - Number of positive indexes in the roiMap.
 * @param options - Color maps options.
 * @returns The colored map.
 */
function getBinaryMap(
  nbNegative: number,
  nbPositive: number,
  options: ColorMapsOptions,
): Uint32Array {
  const { roiKind = RoiKind.BW } = options;

  let colorMap = new Uint32Array(2 ** 16);

  // negative values
  if (roiKind === RoiKind.BW || roiKind === RoiKind.BLACK) {
    for (let i = 2 ** 15 - nbNegative; i < 2 ** 15; i++) {
      colorMap[i] = 0xff0000ff; // red
    }
  }
  if (roiKind === RoiKind.BW || roiKind === RoiKind.WHITE) {
    // positive values
    for (let i = 2 ** 15 + 1; i < 2 ** 15 + 1 + nbPositive; i++) {
      colorMap[i] = 0xff00ff00; // green
    }
  }

  return colorMap;
}

/**
 * Return a map where ROIs are different shades of red (positive) or blue (negative) depending on the ROI index.
 *
 * @param nbNegative - Number of negative indexes in the roiMap.
 * @param nbPositive - Number of positive indexes in the roiMap.
 * @returns The colored map.
 */
function getTemperatureMap(
  nbNegative: number,
  nbPositive: number,
): Uint32Array {
  let colorMap = new Uint32Array(2 ** 16);
  const negativeStep = 128 / nbNegative;
  // negative values
  for (let i = 2 ** 15 - nbNegative; i < 2 ** 15; i++) {
    const hsv = [0, 127 + i * negativeStep, 255];
    colorMap[i] = rgbToNumber(hsvToRgb(hsv)); // red shades
  }
  // positive values
  for (let i = 2 ** 15 + 1; i < 2 ** 15 + 1 + nbPositive; i++) {
    const hsv = [240, 127 + i * negativeStep, 255];
    colorMap[i] = 0xff00ff00; // green
  }
  return colorMap;
}
