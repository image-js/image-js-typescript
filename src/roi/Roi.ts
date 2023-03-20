import { Mask } from '../Mask';
import {
  GetBorderPointsOptions,
  getFeret,
  Feret,
  FeretDiameter,
  getConvexHull,
} from '../maskAnalysis';
import { Point } from '../utils/geometry/points';

import { RoiMap } from './RoiMapManager';
import { getBorderPoints } from './getBorderPoints';
import { getMask, GetMaskOptions } from './getMask';

export class Roi {
  /**
   * Original map with all the ROI IDs.
   */
  private readonly map: RoiMap;
  /**
   * ID of the ROI. Positive for white ROIs and negative for black ones.
   */
  public id: number;
  /**
   * Origin of the ROI. The top-left corner of the rectangle around
   * the ROI relative to the original image.
   */
  public origin: Point;
  /**
   * Width of the ROI.
   */
  public width: number;
  /**
   * Height of the ROI.
   */
  public height: number;
  /**
   * Surface of the ROI.
   */

  public surface: number;
  public maxX: number;
  public maxY: number;
  public minX: number;
  public minY: number;

  private computed: {
    perimeter?: number;
    borderIDs?: number[];
    perimeterInfo?: { one: number; two: number; three: number; four: number };
    BoxIDs?: number[];
    externalLengths?: number[];
    borderLengths?: number[];
    box?: number;
    points?: number[][];
    holesInfo?: { number: number; surface: number };
    external?: number;
    boxIDs?: number[];
    eqpc?: number;
    ped?: number;
    externalIDs?: number[];
    roundness?: number;
    convexHull?: { polyline: Point[]; surface: number; perimeter: number };
    fillRatio?: number;
    internalIDs?: number[];
    feretDiameters?: Feret;
  };

  public constructor(map: RoiMap, id: number) {
    this.map = map;
    this.id = id;
    this.origin = { row: map.height, column: map.width };
    this.width = 0;
    this.height = 0;
    this.surface = 0;
    this.computed = {};
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
  }
  /**
   * Get the ROI map of the original image.
   *
   * @returns The ROI map.
   */
  public getMap(): RoiMap {
    return this.map;
  }

  /**
   * Return the value at the given coordinates in an ROI map.
   *
   * @param column - Column of the value.
   * @param row - Row of the value.
   * @returns The value at the given coordinates.
   */
  public getMapValue(column: number, row: number) {
    return this.map.data[this.map.width * row + column];
  }

  /**
   * Return the ratio between the width and the height of the bounding rectangle of the ROI.
   *
   * @returns The width by height ratio.
   */
  public getRatio(): number {
    return this.width / this.height;
  }

  /**
   * Generate a mask of an ROI. You can specify the kind of mask you want using the `kind` option.
   *
   * @param options - Get Mask options
   * @returns The ROI mask.
   */
  public getMask(options?: GetMaskOptions): Mask {
    return getMask(this, options);
  }

  get ped() {
    if (!this.computed.ped) {
      this.computed.ped = this.perimeter / Math.PI;
    }
    return this.computed.ped;
  }

  /**
   * Return an array with the coordinates of the pixels that are on the border of the ROI.
   * The points are defined as [column, row].
   *
   * @param options - Get border points options.
   * @returns The array of border pixels.
   */
  public getBorderPoints(options?: GetBorderPointsOptions): Array<Point> {
    return getBorderPoints(this, options);
  }

  _computeBorderIDs(): void {
    let borders = getBorders(this);
    this.computed.borderIDs = [...borders.ids];
    this.computed.borderLengths = [...borders.lengths];
  }

  get internalIDs() {
    if (!this.computed.internalIDs) {
      this.computed.internalIDs = getInternalIDs(this);
    }
    return this.computed.internalIDs;
  }

  get externalIDs(): number[] {
    if (this.computed.externalIDs) {
      return this.computed.externalIDs;
    }
    this.getExternalIDs();
    return this.computed.externalIDs || [];
  }

  get externalLengths() {
    if (!this.computed.externalLengths) {
      this.getExternalIDs();
      return this.computed.externalLengths;
    }
    return this.computed.externalLengths;
  }

  get perimeterInfo() {
    if (!this.computed.perimeterInfo) {
      this.computed.perimeterInfo = getPerimeterInfo(this);
    }
    return this.computed.perimeterInfo;
  }

  get perimeter() {
    let info = this.perimeterInfo;
    let delta = 2 - Math.sqrt(2);
    return (
      info.one +
      info.two * 2 +
      info.three * 3 +
      info.four * 4 -
      delta * (info.two + info.three * 2 + info.four)
    );
  }

  get points() {
    if (!this.computed.points) {
      let points = [];
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let target = (y + this.minY) * this.map.width + x + this.minX;
          if (this.map.data[target] === this.id) {
            points.push([x, y]);
          }
        }
      }
      this.computed.points = points;
    }
    return this.computed.points;
  }
  get boxIDs() {
    if (!this.computed.boxIDs) {
      this.computed.boxIDs = getBoxIDs(this);
    }
    return this.computed.boxIDs;
  }

  get eqpc() {
    if (!this.computed.eqpc) {
      this.computed.eqpc = 2 * Math.sqrt(this.surface / Math.PI);
    }
    return this.computed.eqpc;
  }

  get external() {
    if (!this.computed.external) {
      this.computed.external = getExternal(this);
    }
    return this.computed.external;
  }
  get holesInfo() {
    if (!this.computed.holesInfo) {
      this.computed.holesInfo = getHolesInfo(this);
    }
    return this.computed.holesInfo;
  }

  getExternalIDs(): void {
    // take all the borders and remove the internal one ...
    let borders = this.borderIDs;
    let lengths = this.borderLengths;

    this.computed.externalLengths = [];
    this.computed.externalIDs = [];

    let internals = this.internalIDs;

    for (let i = 0; i < borders.length; i++) {
      if (!internals.includes(borders[i])) {
        this.computed.externalIDs.push(borders[i]);
        this.computed.externalLengths.push(lengths[i]);
      }
    }
  }

  get borderIDs() {
    if (this.computed.borderIDs) {
      return this.computed.borderIDs;
    }
    this._computeBorderIDs();
    return this.computed.borderIDs || [];
  }

  get borderLengths(): number[] {
    if (this.computed.borderLengths) {
      return this.computed.borderLengths;
    }
    this._computeBorderIDs();
    return this.computed.borderLengths || [];
  }

  get box() {
    // points of the Roi that touch the rectangular shape
    if (!this.computed.box) {
      this.computed.box = getBox(this);
    }
    return this.computed.box;
  }
  /**
   * Getter that calculates fill ratio of the ROI
   */
  get fillRatio() {
    return this.surface / (this.surface + this.holesInfo.surface);
  }
  /**
   * Getter that calculates sphericity of the ROI
   */
  get sphericity() {
    return (2 * Math.sqrt(this.surface * Math.PI)) / this.perimeter;
  }

  /**
   * Getter that calculates solidity of the ROI
   */
  get solidity() {
    return this.surface / getConvexHull(this.getMask()).surface;
  }

  get roundness() {
    /*Slide 24 https://static.horiba.com/fileadmin/Horiba/Products/Scientific/Particle_Characterization/Webinars/Slides/TE011.pdf */
    return (
      (4 * this.surface) /
      (Math.PI * this.feretDiameters.maxDiameter.length ** 2)
    );
  }

  get feretDiameters(): {
    minDiameter: FeretDiameter;
    maxDiameter: FeretDiameter;
    aspectRatio: number;
  } {
    if (!this.computed.feretDiameters) {
      this.computed.feretDiameters = getFeret(this.getMask());
    }
    return this.computed.feretDiameters;
  }
  /**
   *
   * @returns calculated properties as one object
   */
  toJSON() {
    return {
      id: this.id,
      minX: this.minX,
      maxX: this.maxX,
      minY: this.minY,
      maxY: this.maxY,
      height: this.height,
      width: this.width,
      surface: this.surface,
      eqpc: this.eqpc,
      ped: this.ped,
      feretDiameterMin: this.feretDiameters.minDiameter,
      feretDiameterMax: this.feretDiameters.maxDiameter,
      aspectRatio: this.feretDiameters.aspectRatio,
      fillRatio: this.fillRatio,
      sphericity: this.sphericity,
      roundness: this.roundness,
      solidity: this.solidity,
      perimeter: this.perimeter,
      perimeterInfo: this.perimeterInfo,
      externalIDs: this.externalIDs,
      externalLengths: this.externalLengths,
      internalIDs: this.internalIDs,
      borderIDs: this.borderIDs,
      external: this.external,
      borderLengths: this.borderLengths,
      boxIDs: this.boxIDs,
    };
  }
}
/**
 *
 * @param roi -ROI
 * @returns object which tells how many pixels are exposed externally to how many sides
 */
function getPerimeterInfo(roi: Roi) {
  let roiMap = roi.getMap();
  let data = roiMap.data;
  let one = 0;
  let two = 0;
  let three = 0;
  let four = 0;

  for (let x = 0; x < roiMap.width; x++) {
    for (let y = 0; y < roiMap.height; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        let nbAround = 0;
        if (x === 0) {
          nbAround++;
        } else if (roi.externalIDs.includes(data[target - 1])) {
          nbAround++;
        }

        if (x === roiMap.width - 1) {
          nbAround++;
        } else if (roi.externalIDs.includes(data[target + 1])) {
          nbAround++;
        }

        if (y === 0) {
          nbAround++;
        } else if (roi.externalIDs.includes(data[target - roiMap.width])) {
          nbAround++;
        }

        if (y === roiMap.height - 1) {
          nbAround++;
        } else if (roi.externalIDs.includes(data[target + roiMap.width])) {
          nbAround++;
        }
        switch (nbAround) {
          case 1:
            one++;
            break;
          case 2:
            two++;
            break;
          case 3:
            three++;
            break;
          case 4:
            four++;
            break;
          default:
        }
      }
    }
  }
  return { one, two, three, four };
}

function getExternal(roi: Roi) {
  let total = 0;
  let roiMap = roi.getMap();
  let data = roiMap.data;

  for (let x = 0; x < roi.width; x++) {
    for (let y = 0; y < roi.height; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        // if a point around is not roi.id it is a border
        if (
          roi.externalIDs.includes(data[target - 1]) ||
          roi.externalIDs.includes(data[target + 1]) ||
          roi.externalIDs.includes(data[target - roiMap.width]) ||
          roi.externalIDs.includes(data[target + roiMap.width])
        ) {
          total++;
        }
      }
    }
  }
  return total + roi.box;
}
/**
 *
 * @param roi - ROI
 * @returns the surface of holes in ROI
 */
function getHolesInfo(roi: Roi) {
  let surface = 0;
  let width = roi.getMap().width;
  let data = roi.getMap().data;
  for (let x = 1; x < roi.width - 1; x++) {
    for (let y = 1; y < roi.height - 1; y++) {
      let target = (y + roi.minY) * width + x + roi.minX;
      if (roi.internalIDs.includes(data[target]) && data[target] !== roi.id) {
        surface++;
      }
    }
  }
  return {
    number: roi.internalIDs.length - 1,
    surface,
  };
}

function getInternalIDs(roi: Roi) {
  let internal = [roi.id];
  let roiMap = roi.getMap();
  let data = roiMap.data;

  if (roi.height > 2) {
    for (let x = 0; x < roi.width; x++) {
      let target = roi.minY * roiMap.width + x + roi.minX;
      if (internal.includes(data[target])) {
        let id = data[target + roiMap.width];
        if (!internal.includes(id) && !roi.boxIDs.includes(id)) {
          internal.push(id);
        }
      }
    }
  }

  let array = new Array(4);
  for (let x = 1; x < roi.width - 1; x++) {
    for (let y = 1; y < roi.height - 1; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (internal.includes(data[target])) {
        // we check if one of the neighbour is not yet in

        array[0] = data[target - 1];
        array[1] = data[target + 1];
        array[2] = data[target - roiMap.width];
        array[3] = data[target + roiMap.width];

        for (let i = 0; i < 4; i++) {
          let id = array[i];
          if (!internal.includes(id) && !roi.boxIDs.includes(id)) {
            internal.push(id);
          }
        }
      }
    }
  }

  return internal;
}
function getBox(roi: Roi) {
  let total = 0;
  let roiMap = roi.getMap();
  let data = roiMap.data;

  let topBottom = [0];
  if (roi.height > 1) {
    topBottom[1] = roi.height - 1;
  }
  for (let y of topBottom) {
    for (let x = 1; x < roi.width - 1; x++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        total++;
      }
    }
  }

  let leftRight = [0];
  if (roi.width > 1) {
    leftRight[1] = roi.width - 1;
  }
  for (let x of leftRight) {
    for (let y = 0; y < roi.height; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (data[target] === roi.id) {
        total++;
      }
    }
  }
  return total;
}

function getBoxIDs(roi: Roi): number[] {
  let surroundingIDs = new Set<number>(); // allows to get a unique list without indexOf

  let roiMap = roi.getMap();
  let data = roiMap.data;

  // we check the first line and the last line
  for (let y of [0, roi.height - 1]) {
    for (let x = 0; x < roi.width; x++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (
        x - roi.minX > 0 &&
        data[target] === roi.id &&
        data[target - 1] !== roi.id
      ) {
        let value = data[target - 1];
        surroundingIDs.add(value);
      }
      if (
        roiMap.width - x - roi.minX > 1 &&
        data[target] === roi.id &&
        data[target + 1] !== roi.id
      ) {
        let value = data[target + 1];
        surroundingIDs.add(value);
      }
    }
  }

  // we check the first column and the last column
  for (let x of [0, roi.width - 1]) {
    for (let y = 0; y < roi.height; y++) {
      let target = (y + roi.minY) * roiMap.width + x + roi.minX;
      if (
        y - roi.minY > 0 &&
        data[target] === roi.id &&
        data[target - roiMap.width] !== roi.id
      ) {
        let value = data[target - roiMap.width];
        surroundingIDs.add(value);
      }
      if (
        roiMap.height - y - roi.minY > 1 &&
        data[target] === roi.id &&
        data[target + roiMap.width] !== roi.id
      ) {
        let value = data[target + roiMap.width];
        surroundingIDs.add(value);
      }
    }
  }

  return Array.from(surroundingIDs); // the selection takes the whole rectangle
}

/**
 *
 * @param roi - ROI
 * @returns borders' length and their IDs
 */
function getBorders(roi: Roi): { ids: number[]; lengths: number[] } {
  let roiMap = roi.getMap();
  let data = roiMap.data;
  let surroudingIDs = new Set<number>(); // allows to get a unique list without indexOf
  let surroundingBorders = new Map();
  let visitedData = new Set();
  let dx = [+1, 0, -1, 0];
  let dy = [0, +1, 0, -1];

  for (let x = roi.minX; x <= roi.maxX; x++) {
    for (let y = roi.minY; y <= roi.maxY; y++) {
      let target = x + y * roiMap.width;
      if (data[target] === roi.id) {
        for (let dir = 0; dir < 4; dir++) {
          let newX = x + dx[dir];
          let newY = y + dy[dir];
          if (
            newX >= 0 &&
            newY >= 0 &&
            newX < roiMap.width &&
            newY < roiMap.height
          ) {
            let neighbour = newX + newY * roiMap.width;

            if (data[neighbour] !== roi.id && !visitedData.has(neighbour)) {
              visitedData.add(neighbour);
              surroudingIDs.add(data[neighbour]);
              let surroundingBorder = surroundingBorders.get(data[neighbour]);
              if (!surroundingBorder) {
                surroundingBorders.set(data[neighbour], 1);
              } else {
                surroundingBorders.set(data[neighbour], ++surroundingBorder);
              }
            }
          }
        }
      }
    }
  }
  let ids: number[] = Array.from(surroudingIDs);
  let borderLengths = ids.map((id) => {
    return surroundingBorders.get(id);
  });
  return {
    ids,
    lengths: borderLengths,
  };
}
