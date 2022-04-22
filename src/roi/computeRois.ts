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

  const whites = new Array(map.nbPositive);
  const blacks = new Array(map.nbNegative);

  for (let i = 1; i <= map.nbPositive; i++) {
    whites[i - 1] = {
      minColumn: map.width,
      maxColumn: -1,
      minRow: map.height,
      maxRow: -1,
      surface: 0,
    };
  }
  for (let i = 1; i <= map.nbNegative; i++) {
    blacks[i - 1] = {
      minColumn: map.width,
      maxColumn: -1,
      minRow: map.height,
      maxRow: -1,
      surface: 0,
    };
  }

  for (let row = 0; row < map.height; row++) {
    for (let column = 0; column < map.width; column++) {
      let currentIndex = map.data[getRoiMapIndex(row, column, map)];

      let currentRectangle;
      if (currentIndex < 0) {
        currentRectangle = whites[-currentIndex - 1];
      } else {
        currentRectangle = blacks[currentIndex - 1];
      }

      currentRectangle.surface++;

      if (row < currentRectangle.minRow) {
        currentRectangle.minRow = row;
      }
      if (row > currentRectangle.maxRow) {
        currentRectangle.maxRow = row;
      }
      if (column < currentRectangle.minColumn) {
        currentRectangle.minColumn = column;
      }
      if (column > currentRectangle.maxColumn) {
        currentRectangle.maxColumn = column;
      }
    }
  }

  roiMapManager.whiteRois = new Array(map.nbPositive);
  roiMapManager.blackRois = new Array(map.nbNegative);

  for (let i = 1; i <= map.nbPositive; i++) {
    let whiteRoi = new Roi(map, i);
    whiteRoi.row = whites[i].minRow;
    whiteRoi.column = whites[i].minColumn;
    whiteRoi.width = whites[i].maxColumn - whites[i].minColumn;
    whiteRoi.height = whites[i].maxRow - whites[i].minRow;

    roiMapManager.whiteRois[i - 1] = whiteRoi;
  }
  for (let i = 1; i <= map.nbNegative; i++) {
    let blackRoi = new Roi(map, i);
    blackRoi.row = blacks[i].minRow;
    blackRoi.column = blacks[i].minColumn;
    blackRoi.width = blacks[i].maxColumn - blacks[i].minColumn + 1;
    blackRoi.height = blacks[i].maxRow - blacks[i].minRow + 1;

    roiMapManager.blackRois[i - 1] = blackRoi;
  }
}
