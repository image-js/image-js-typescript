import { ColorMode } from '../colorRois';

import { getBinaryMap, GetBinaryMapOptions } from './colorMaps/getBinaryMap';
import {
  getTemperatureMap,
  GetTemperatureMapOptions,
} from './colorMaps/getTemperatureMap';

export type ModeOptions = GetTemperatureMapOptions | GetBinaryMapOptions;
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
   * Options related to the color mode.
   */
  modeOptions: ModeOptions;
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
    modeOptions,
    nbNegative,
    nbPositive,
  } = options;
  switch (mode) {
    case ColorMode.BINARY:
      return getBinaryMap(nbNegative, nbPositive, modeOptions);
    case ColorMode.TEMPERATURE:
      return getTemperatureMap(nbNegative, nbPositive, modeOptions);
    default:
      throw new Error('getColorMap: unknown color mode');
  }
}
