import { Image, Mask } from '..';
import { assertUnreachable } from '../utils/assert';
import checkProcessable from '../utils/checkProcessable';

interface ExtremaOptions {
  extremum?: 'minimum' | 'maximum';
  mask?: Mask;
  region?: number;
  removeClosePoints?: number;
  invert?: boolean;
  maxEquals?: number;
}
/**
 *
 * @param image
 * @param options
 */
export default function getExtrema(image: Image, options: ExtremaOptions = {}) {
  let {
    extremum = 'maximum',
    mask,
    region = 3,
    removeClosePoints = 0,
    maxEquals = 2,
  } = options;
  checkProcessable(image, {
    bitDepth: [8, 16],
    components: 1,
  });
  region *= 4;

  let dx = [+1, 0, -1, 0, +1, +1, -1, -1, +2, 0, -2, 0, +2, +2, -2, -2];
  let dy = [0, +1, 0, -1, +1, -1, +1, -1, 0, +2, 0, -2, +2, -2, +2, -2];
  let shift = region <= 8 ? 1 : 2;
  let points: number[][] = [];
  let extremumFunction = getExtremaFunction(extremum);
  extremumFunction(
    image,
    mask as Mask,
    dx,
    dy,
    shift,
    points,
    region,
    maxEquals,
  );

  // TODO How to make a more performant and general way
  // we don't deal correctly here with groups of points that should be grouped if at the
  // beginning one of them is closer to another
  // Seems that we would ened to calculate a matrix and then split this matrix in 'independant matrices'
  // Or to assign a cluster to each point and regroup them if 2 clusters are close to each other
  // later approach seems much better
  if (removeClosePoints > 0) {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (
          Math.sqrt(
            Math.pow(points[i][0] - points[j][0], 2) +
              Math.pow(points[i][1] - points[j][1], 2),
          ) < removeClosePoints
        ) {
          points[i][0] = (points[i][0] + points[j][0]) >> 1;
          points[i][1] = (points[i][1] + points[j][1]) >> 1;
          points.splice(j, 1);
          j--;
        }
      }
    }
  }

  return points;
}

function getMaxima(
  image: Image,
  mask: Mask,
  dx: number[],
  dy: number[],
  shift: number,
  points: number[][],
  region: number,
  maxEquals: number,
) {
  for (let channel = 0; channel < image.channels; channel++) {
    for (let currentY = shift; currentY < image.height - shift; currentY++) {
      for (let currentX = shift; currentX < image.width - shift; currentX++) {
        if (mask && mask.getBit(currentX, currentY) !== 1) {
          continue;
        }
        let counter = 0;
        let nbEquals = 0;
        let currentValue = image.getValue(currentX, currentY, channel);
        for (let dir = 0; dir < region; dir++) {
          if (
            // we search for minima
            image.getValue(currentX + dx[dir], currentY + dy[dir], channel) <
            currentValue
          ) {
            counter++;
          }
          if (
            image.getValue(currentX + dx[dir], currentY + dy[dir], channel) ===
            currentValue
          ) {
            nbEquals++;
          }
        }
        if (counter + nbEquals === region && nbEquals <= maxEquals) {
          points.push([currentX, currentY]);
        }
      }
    }
  }
}
function getMinima(
  image: Image,
  mask: Mask,
  dx: number[],
  dy: number[],
  shift: number,
  points: number[][],
  region: number,
  maxEquals: number,
) {
  for (let channel = 0; channel < image.channels; channel++) {
    for (let currentY = shift; currentY < image.height - shift; currentY++) {
      for (let currentX = shift; currentX < image.width - shift; currentX++) {
        if (mask && mask.getBit(currentX, currentY) !== 0) {
          continue;
        }
        let counter = 0;
        let nbEquals = 0;
        let currentValue = image.getValue(currentX, currentY, channel);
        for (let dir = 0; dir < region; dir++) {
          // we search for minima
          if (
            image.getValue(currentX + dx[dir], currentY + dy[dir], channel) >
            currentValue
          ) {
            counter++;
          }

          if (
            image.getValue(currentX + dx[dir], currentY + dy[dir], channel) ===
            currentValue
          ) {
            nbEquals++;
          }
        }
        if (counter + nbEquals === region && nbEquals <= maxEquals) {
          points.push([currentX, currentY]);
        }
      }
    }
  }
}
function getExtremaFunction(extremum: 'minimum' | 'maximum') {
  switch (extremum) {
    case 'minimum':
      return getMinima;
    case 'maximum':
      return getMaxima;
    default:
      assertUnreachable(extremum);
  }
}
