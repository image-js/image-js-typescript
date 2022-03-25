import { RoiKind } from '../../RoiManager';
import { hsvToRgb } from '../hsvToRgb';
import { rgbToNumber } from '../rgbToNumber';

// warning: the values in a uint32 array are flipped!! e.g. [0,0,0,1] becomes 0x80000000
// the bits values are therefore in the following order: ABGR
// index 32768 corresponds to the middle of the array

export interface GetBinaryMapOptions {
  /**
   * Specify which ROIs to colour.
   *
   * @default RoiKind.BW
   */
  roiKind?: RoiKind;
  /**
   * Hue of white ROIs
   *
   * @default 120
   */
  whiteHue?: number;
  /**
   * Hue of black ROIs
   *
   * @default 0
   */
  blackHue?: number;
}

/**
 * Return a map where ROIs are red (negative) or green (positive) depending on the ROI index.
 *
 * @param nbNegative - Number of negative indexes in the roiMap.
 * @param nbPositive - Number of positive indexes in the roiMap.
 * @param options - Color maps options.
 * @returns The colored map.
 */
export function getBinaryMap(
  nbNegative: number,
  nbPositive: number,
  options: GetBinaryMapOptions = {},
): Uint32Array {
  const { whiteHue = 120, blackHue = 0, roiKind = RoiKind.BW } = options;

  let colorMap = new Uint32Array(2 ** 16);

  // negative values
  if (roiKind === RoiKind.BW || roiKind === RoiKind.BLACK) {
    for (let i = 2 ** 15 - nbNegative; i < 2 ** 15; i++) {
      const hsv = [whiteHue, 255, 255];
      console.log(hsvToRgb(hsv));
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
    }
  }
  if (roiKind === RoiKind.BW || roiKind === RoiKind.WHITE) {
    // positive values
    for (let i = 2 ** 15 + 1; i < 2 ** 15 + 1 + nbPositive; i++) {
      const hsv = [blackHue, 255, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
    }
  }

  return colorMap;
}
