import { ColorMode } from '../colorRois';

export interface GetColorMapOptions {
  mode?: ColorMode;
  nbNegative: number;
  nbPositive: number;
}

/**
 * Return a map of 32 bits integers corresponding to the colors of each ROI.
 *
 * @param options - Get color map options.
 * @returns The color map.
 */
export function getColorMap(options: GetColorMapOptions): Uint32Array {
  const { mode = ColorMode.BINARY, nbNegative, nbPositive } = options;
  switch (mode) {
    case ColorMode.BINARY:
      return getBinaryMap(nbNegative, nbPositive);
    default:
      throw new Error('getColorMap: unknown color mode');
  }
}

/**
 * Return a map where ROIs are red or green depending on the ROI index.
 *
 * @param nbNegative - Number of negative indexes in the roiMap.
 * @param nbPositive - Number of positive indexes in the roiMap.
 * @returns The colored map.
 */
function getBinaryMap(nbNegative: number, nbPositive: number): Uint32Array {
  // index 32768 corresponds to the middle of the array
  let colorMap = new Uint32Array(2 ** 16);
  // negative values
  for (let i = 2 ** 15 - nbNegative; i < 2 ** 15; i++) {
    colorMap[i] = 0xff0000ff; // red
  }
  // positive values
  for (let i = 2 ** 15 + 1; i < 2 ** 15 + nbPositive; i++) {
    colorMap[i] = 0x00ff00ff; // green
  }
  return colorMap;
}
