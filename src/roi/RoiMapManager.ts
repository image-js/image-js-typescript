import { Matrix } from 'ml-matrix';

import { Roi } from './Roi';
import { GetRoisOptions, RoiManager } from './RoiManager';
import { computeRois } from './computeRois';

export interface RoiMap {
  /**
   * Width of the map.
   */
  width: number;
  /**
   * Height of the map.
   */
  height: number;
  /**
   * Data of the ROIs. Each ROI is associated with a negative or a positive value,
   * depending if it derives from a zone made of zeros or ones in the original mask.
   */
  data: Int16Array;
  /**
   * Number of distinct positive values in the ROI map
   *
   */
  nbPositive: number;
  /**
   * Number of distinct negative values in the ROI map
   *
   */
  nbNegative: number;
}
export class RoiMapManager implements RoiManager {
  public map: RoiMap;
  public whiteRois: Roi[];
  public blackRois: Roi[];

  public constructor(map: RoiMap) {
    this.map = map;
    this.whiteRois = [];
    this.blackRois = [];
  }

  /**
   * Returns the ROI map as a correct width and height matrix.
   *
   * @returns The ROI map matrix
   */
  public getMapMatrix(): number[][] {
    return Matrix.from1DArray(
      this.map.height,
      this.map.width,
      this.map.data,
    ).to2DArray();
  }
  /**
   * Generate an array of ROIs.
   */
  private computeRois(): void {
    computeRois(this);
  }

  public getRois(options: GetRoisOptions): Roi[] {}
}
