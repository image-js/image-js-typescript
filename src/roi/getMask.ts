import { Mask } from '../Mask';

import { Roi } from './Roi';

/**
 * Generate a mask the size of the bounding rectangle of the ROI, where the pixels inside the ROI are set to true and the rest to false.
 *
 * @param roi - The ROI to generate a mask for.
 * @returns The ROI mask.
 */
export function getMask(roi: Roi): Mask {
  let mask = new Mask(roi.width, roi.height);

  for (let row = roi.row; row < roi.row + roi.height; row++) {
    for (let column = roi.column; column < roi.column + roi.width; column++) {
      if (roi.getMapValue(row, column) === roi.id) {
        mask.setBit(row, column, 1);
      } else {
        mask.setBit(row, column, 0);
      }
    }
  }

  return mask;
}
