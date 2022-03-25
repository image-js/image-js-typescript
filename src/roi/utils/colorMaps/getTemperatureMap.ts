import { RoiKind } from '../../RoiManager';
import { hsvToRgb } from '../hsvToRgb';
import { rgbToNumber } from '../rgbToNumber';

export interface GetTemperatureMapOptions {
  /**
   * Specify which ROIs to colour.
   *
   * @default RoiKind.BW
   */
  roiKind?: RoiKind;
  /**
   * Hue of white ROIs
   *
   * @default 0
   */
  whiteHue?: number;
  /**
   * Hue of black ROIs
   *
   * @default 240
   */
  blackHue?: number;
}

/**
 * Return a map where ROIs are different shades of red (positive) or blue (negative) depending on the ROI index.
 *
 * @param nbNegative - Number of negative indexes in the roiMap.
 * @param nbPositive - Number of positive indexes in the roiMap.
 * @param options - Get temperature map options
 * @returns The colored map.
 */
export function getTemperatureMap(
  nbNegative: number,
  nbPositive: number,
  options: GetTemperatureMapOptions = {},
): Uint32Array {
  const { roiKind = RoiKind.BW, whiteHue = 0, blackHue = 240 } = options;

  let colorMap = new Uint32Array(2 ** 16);
  const negativeStep = 128 / nbNegative;
  // negative values
  if (roiKind === RoiKind.BW || roiKind === RoiKind.BLACK) {
    for (let i = 2 ** 15 - nbNegative; i < 2 ** 15; i++) {
      const hsv = [whiteHue, 127 + i * negativeStep, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
    }
  }
  // positive values
  if (roiKind === RoiKind.BW || roiKind === RoiKind.WHITE) {
    for (let i = 2 ** 15 + 1; i < 2 ** 15 + 1 + nbPositive; i++) {
      const hsv = [blackHue, 127 + i * negativeStep, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
    }
  }
  return colorMap;
}
