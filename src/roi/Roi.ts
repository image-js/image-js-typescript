import { RoiMap } from './RoiMapManager';

export class Roi {
  public map: RoiMap;
  public id: number;
  public minRow: number;
  public minColumn: number;
  public maxRow: number;
  public maxColumn: number;
  public surface: number;

  public constructor(map: RoiMap, id: number) {
    this.map = map;
    this.id = id;
    this.minRow = map.height;
    this.minColumn = map.width;
    this.maxRow = -1;
    this.maxColumn = -1;
    this.surface = 0;
  }

  public getSurface(): number {
    return (this.maxRow - this.minRow) * (this.maxColumn - this.minColumn);
  }
}
