import { Roi, RoiManager } from './RoiManager';

export interface RoiMap {
  width: number;
  height: number;
  data: Int16Array;
}
export class RoiMapManager implements RoiManager {
  public map: RoiMap;

  public constructor(map: RoiMap) {
    this.map = map;
  }

  public getRois(): Roi[] {
    return [];
  }
}
