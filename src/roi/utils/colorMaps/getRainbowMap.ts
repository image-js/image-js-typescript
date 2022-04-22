import { ColorRoiKind } from '../../colorRois';
import { maxNumberRois, colorMapCenter } from '../constants';
import { hsvToRgb } from '../hsvToRgb';
import { rgbToNumber } from '../rgbToNumber';

export interface GetRainbowMapOptions {
  /**
   * Number of black ROIs
   */
  nbNegative: number;
  /**
   * Number of white ID ROIs
   */
  nbPositive: number;
  /**
   * Specify which ROIs to colour.
   *
   * @default ColorRoiKind.BW
   */
  roiKind?: ColorRoiKind;
}

/**
 * Return a map where ROIs are all different hues.
 *
 * @param options - Get temperature map options
 * @returns The colored map.
 */
export function getRainbowMap(options: GetRainbowMapOptions): Uint32Array {
  const { nbNegative, nbPositive, roiKind = ColorRoiKind.BW } = options;

  let colorMap = new Uint32Array(maxNumberRois);

  const hueRange = 360;

  let step: number;
  if (roiKind === ColorRoiKind.BW) {
    step = hueRange / (nbNegative + nbPositive);
  } else if (roiKind === ColorRoiKind.BLACK) {
    step = hueRange / nbNegative;
  } else if (roiKind === ColorRoiKind.WHITE) {
    step = hueRange / nbPositive;
  } else {
    throw new Error('getRainbowMap: unrecognised ROI kind');
  }

  // negative values
  let hue = 0;
  if (roiKind === ColorRoiKind.BW || roiKind === ColorRoiKind.BLACK) {
    for (let i = colorMapCenter - nbNegative; i < colorMapCenter; i++) {
      const hsv = [hue, 255, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
      hue += step;
    }
  }
  // positive values
  if (roiKind === ColorRoiKind.BW || roiKind === ColorRoiKind.WHITE) {
    for (let i = colorMapCenter + 1; i < colorMapCenter + 1 + nbPositive; i++) {
      const hsv = [hue, 255, 255];
      colorMap[i] = rgbToNumber(hsvToRgb(hsv));
      hue += step;
    }
  }
  return colorMap;
}
