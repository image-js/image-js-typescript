import { getRoiMapIndex } from '../utils/getIndex';

import { Roi } from './Roi';
import { RoiMapManager } from './RoiMapManager';

/**
 * Generate an array of ROIs based on an ROI map manager.
 *
 * @param roiMapManager - Roi map manager to use
 */
export function computeRois(roiMapManager: RoiMapManager): void {
  roiMapManager.whiteRois = new Array(roiMapManager.map.nbPositive);
  roiMapManager.blackRois = new Array(roiMapManager.map.nbNegative);

  for (let i = 1; i <= roiMapManager.map.nbPositive; i++) {
    roiMapManager.whiteRois.push(new Roi(roiMapManager.map, i));
  }
  for (let i = 1; i <= roiMapManager.map.nbNegative; i++) {
    roiMapManager.blackRois.push(new Roi(roiMapManager.map, -i));
  }
  for (let row = 0; row < roiMapManager.map.height; row++) {
    for (let column = 0; column < roiMapManager.map.width; column++) {
      let currentIndex =
        roiMapManager.map.data[getRoiMapIndex(row, column, roiMapManager.map)];
      let currentRoi;
      if (currentIndex < 0) {
        currentRoi = roiMapManager.blackRois[-currentIndex];
      } else {
        currentRoi = roiMapManager.whiteRois[currentIndex];
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
