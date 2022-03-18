import { ColorMode } from '../colorRois';

export interface GetColorMapOptions {
  mode?: ColorMode;
  nbNegative?: number;
  nbPositive?: number;
}

/**
 * Return a map of 32 bits integers corresponding to the colors of each ROI.
 *
 * @param options - Get color map options.
 * @returns The color map.
 */
export function getColorMap(options: GetColorMapOptions = {}): Uint32Array {
  const { mode = ColorMode.BINARY } = options;
  switch (mode) {
    case ColorMode.BINARY:
      return getBinaryMap();
    default:
      throw new Error('getColorMap: unknown color mode');
  }
}

function getBinaryMap(): Uint32Array {
  let colorMap = new Uint32Array(2 ** 16);
  // negative values
  for (let i = 0; i < 2 ** 15; i++) {
    colorMap[i] = 0xff0000ff; // red
  }
  // positive values
  for (let i = 2 ** 15 + 1; i < 2 ** 16; i++) {
    colorMap[i] = 0x00ff00ff; // green
  }
  return colorMap;
}
