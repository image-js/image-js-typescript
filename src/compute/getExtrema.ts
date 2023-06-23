import { Image, Mask } from '..';
import checkProcessable from '../utils/checkProcessable';

interface ExtremaOptions {
  extremum?: 'minimum' | 'maximum';
  mask?: Mask;
  algorithm?: number;
  removeClosePoints?: number;
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
    algorithm = 3,
    removeClosePoints = 0,
    maxEquals = 2,
  } = options;
  checkProcessable(image, {
    bitDepth: [8, 16],
    components: 1,
  });

  let maskExpectedValue = extremum ? 0 : 1;

  const dx = [+1, 0, -1, 0, +1, +1, -1, -1, +2, 0, -2, 0];
  const dy = [0, +1, 0, -1, +1, -1, +1, -1, 0, +2, 0, -2];

  dx.length = algorithm * 4;
  dy.length = algorithm * 4;
  let shift = algorithm <= 8 ? 1 : 2;
  let points: number[][] = [];
  for (let channel = 0; channel < image.channels; channel++) {
    for (let currentY = shift; currentY < image.height - shift; currentY++) {
      for (let currentX = shift; currentX < image.width - shift; currentX++) {
        if (mask && mask.getBit(currentX, currentY) !== maskExpectedValue) {
          continue;
        }
        let counter = 0;
        let nbEquals = 0;
        let currentValue = image.getValue(currentX, currentY, channel);
        for (let dir = 0; dir < dx.length; dir++) {
          if (extremum === 'minimum') {
            // we search for minima
            if (
              image.getValue(currentX + dx[dir], currentY + dy[dir], channel) >
              currentValue
            ) {
              counter++;
            }
          } else if (
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
        if (counter + nbEquals === dx.length && nbEquals <= maxEquals) {
          points.push([currentX, currentY]);
        }
      }
    }
  }

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
          Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]) <
          removeClosePoints
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
