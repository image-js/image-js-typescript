import { getRoiMapIndex } from '../utils/getIndex';

import { Roi } from './Roi';
import { RoiMapManager } from './RoiMapManager';

/**
 * Generate an array of ROIs based on an ROI map manager.
 *
 * @param roiMapManager - Roi map manager to use
 */
export function computeRois(roiMapManager: RoiMapManager): void {
  const map = roiMapManager.getMap();

  roiMapManager.whiteRois = new Array(map.nbPositive);
  roiMapManager.blackRois = new Array(map.nbNegative);

  for (let i = 1; i <= map.nbPositive; i++) {
    roiMapManager.whiteRois[i - 1] = new Roi(map, i);
  }
  for (let i = 1; i <= map.nbNegative; i++) {
    roiMapManager.blackRois[i - 1] = new Roi(map, -i);
  }
  for (let row = 0; row < map.height; row++) {
    for (let column = 0; column < map.width; column++) {
      let currentIndex = map.data[getRoiMapIndex(row, column, map)];

      let currentRoi;
      if (currentIndex < 0) {
        currentRoi = roiMapManager.blackRois[-currentIndex - 1];
      } else {
        currentRoi = roiMapManager.whiteRois[currentIndex - 1];
      }

      currentRoi.surface++;

      if (row < currentRoi.minRow) {
        currentRoi.minRow = row;
      }
      if (row > currentRoi.maxRow) {
        currentRoi.maxRow = row;
      }
      if (column < currentRoi.minColumn) {
        currentRoi.minColumn = column;
      }
      if (column > currentRoi.maxColumn) {
        currentRoi.maxColumn = column;
      }
    }
  }
}
