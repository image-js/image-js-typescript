import { RoiMap } from './RoiMapManager';

export class Roi {
  public map: RoiMap;
  public id: number;
  public row: number;
  public column: number;
  public width: number;
  public height: number;
  public surface: number;

  public constructor(map: RoiMap, id: number) {
    this.map = map;
    this.id = id;
    this.row = map.height;
    this.column = map.width;
    this.width = 0;
    this.height = 0;
    this.surface = 0;
  }
  /**
   * Return the ratio between the width and the height of the bounding rectangle of the ROI.
   *
   * @returns The width by height ratio.
   */
  public getRatio(): number {
    return this.width / this.height;
  }
  public getMask(): Mask {}
}
