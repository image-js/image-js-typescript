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
    this.minRow = Number.POSITIVE_INFINITY;
    this.minColumn = Number.NEGATIVE_INFINITY;
    this.maxRow = Number.POSITIVE_INFINITY;
    this.maxColumn = Number.NEGATIVE_INFINITY;
    this.surface = 0;
  }

  public getSurface(): number {
    return (this.maxRow - this.minRow) * (this.maxColumn - this.minColumn);
  }
}
