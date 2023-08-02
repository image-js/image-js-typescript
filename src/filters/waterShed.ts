import PriorityQueue from 'js-priority-queue';

import { ThresholdAlgorithm, computeThreshold } from '..';
import { Image } from '../Image';
import { Mask } from '../Mask';
import getExtrema from '../compute/getExtrema';
import { Point } from '../geometry';
import { filterPoints } from '../utils/geometry/filterPoints';
import checkProcessable from '../utils/validators/checkProcessable';

/**
 * Point interface that is used in the queue data structure.
 */
interface PointWithIntensity {
  /**
   * @param row - Row of a point.
   */
  row: number;
  /**
   * @param column - Column of a point.
   */
  column: number;
  /**
   * @param intensity - Value of a point.
   */
  intensity: number;
}

interface WaterShedOptions {
  /**
   * @param points - Points which should be filled by watershed filter.
   * @default - minimum points from getExtrema() function.
   */
  points?: Point[];
  /**
   * @param mask - A binary image, the same size as the image. The algorithm will fill only if the current pixel in the binary mask is true.
   * @default undefined
   */
  mask?: Mask;
  /**
   * @param channel - Channel which the filter will be applied to.
   * @default 0
   */
  channel?: number;
  /**
   * @param fillMaxValue - Limit of filling. Maximum value that pixel can have.
   * @default image.maxValue
   */
  fillMaxValue?: number;
  /**
   * @param kind - kind of algorithm to use during algorithm, in case the image is inverted.
   * @default 'minimum'
   */
  kind?: 'minimum' | 'maximum';
  /**
   * Algorithm which calculates threshold of a grey image
   * @default undefined
   */
  thresholdAlgorithm?: ThresholdAlgorithm;
}
/**
 * /**
 * This method allows to create a ROIMap using the water shed algorithm. By default this algorithm
 * will fill the holes and therefore the lowest value of the image (black zones).
 * If no points are given, the function will look for all the minimal points.
 * If no mask is given the algorithm will completely fill the image.
 * Please take care about the value that has be in the mask ! In order to be coherent with the expected mask,
 * meaning that if it is a dark zone, the mask will be dark the normal behavior to fill a zone
 * is that the mask pixel is clear (value of 0) !
 * However if you work in the 'invert' mode, the mask value has to be 'set' and the method will look for
 * maxima.
 * @param image - Image that the filter will be applied to.
 * @param options - WaterShedOptions
 * @returns map data
 */
export function waterShed(image: Image, options: WaterShedOptions) {
  let { points, fillMaxValue = image.maxValue } = options;
  const { mask, channel = 0, kind = 'minimum', thresholdAlgorithm } = options;
  const currentImage = image;
  checkProcessable(image, {
    bitDepth: [8, 16],
    components: 1,
  });

  /*
     We need to invert the logic because we are always using method to look for maxima and not minima and
     here water is expected to fill the minima first ...
    */

  const isMinimum = kind === 'minimum';
  // WaterShed is done from points in the image. We can either specify those points in options,
  // or it is gonna take the minimum locals of the image by default.
  if (!points) {
    points = getExtrema(image, {
      kind,
      mask,
    });

    points = filterPoints(points, image, { channel, kind });
  }
  if (thresholdAlgorithm !== undefined) {
    fillMaxValue *= computeThreshold(image, thresholdAlgorithm);
  }

  const maskExpectedValue = isMinimum ? 0 : 1;

  const data = new Int16Array(currentImage.size);
  const width = currentImage.width;
  const height = currentImage.height;
  const toProcess = new PriorityQueue({
    comparator: (a: PointWithIntensity, b: PointWithIntensity) =>
      a.intensity - b.intensity,
    strategy: PriorityQueue.BinaryHeapStrategy,
  });
  for (let i = 0; i < points.length; i++) {
    let index = points[i].column + points[i].row * width;
    data[index] = i + 1;
    const intensity = currentImage.getValueByIndex(index, channel);
    if (
      (isMinimum && intensity <= fillMaxValue) ||
      (!isMinimum && intensity >= fillMaxValue)
    ) {
      toProcess.queue({
        column: points[i].column,
        row: points[i].row,
        intensity,
      });
    }
  }
  const dxs = [+1, 0, -1, 0, +1, +1, -1, -1];
  const dys = [0, +1, 0, -1, +1, -1, +1, -1];
  // Then we iterate through each points
  while (toProcess.length > 0) {
    const currentPoint = toProcess.dequeue();
    const currentValueIndex = currentPoint.column + currentPoint.row * width;
    for (let dir = 0; dir < 4; dir++) {
      const newX = currentPoint.column + dxs[dir];
      const newY = currentPoint.row + dys[dir];
      if (newX >= 0 && newY >= 0 && newX < width && newY < height) {
        const currentNeighbourIndex = newX + newY * width;
        if (
          !mask ||
          mask.getBitByIndex(currentNeighbourIndex) === maskExpectedValue
        ) {
          let intensity = currentImage.getValueByIndex(
            currentNeighbourIndex,
            channel,
          );
          if (
            ((isMinimum && intensity <= fillMaxValue) ||
              (!isMinimum && intensity >= fillMaxValue)) &&
            data[currentNeighbourIndex] === 0
          ) {
            data[currentNeighbourIndex] = data[currentValueIndex];
            toProcess.queue({
              column: currentPoint.column + dxs[dir],
              row: currentPoint.row + dys[dir],
              intensity,
            });
          }
        }
      }
    }
  }

  return data;
}
