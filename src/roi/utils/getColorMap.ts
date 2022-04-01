import { RoiKind } from '../RoiManager';
import { ColorMode } from '../colorRois';

import { getBinaryMap } from './colorMaps/getBinaryMap';
import { getRainbowMap } from './colorMaps/getRainbowMap';
import { getSaturationMap } from './colorMaps/getSaturationMap';

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
  const { mode = ColorMode.BINARY } = options;
  switch (mode) {
    case ColorMode.BINARY:
      return getBinaryMap(options);
    case ColorMode.SATURATION:
      return getSaturationMap(options);
    case ColorMode.RAINBOW:
      return getRainbowMap(options);
    default:
      throw new Error('getColorMap: unknown color mode');
  }
}
