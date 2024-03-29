import { Image } from '../../../src';
import { polishAltered } from '../../../src/correctColor/__tests__/testUtils/imageColors';
import { referenceColorCard } from '../../../src/correctColor/__tests__/testUtils/referenceColorCard';
import { correctColor } from '../../../src/correctColor/correctColor';
import {
  getMeasuredColors,
  getReferenceColors,
} from '../../../src/correctColor/utils/formatData';

/**
 * Copy a black and a red square to the source image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testCorrectColor(image: Image): Image {
  const measuredColors = getMeasuredColors(polishAltered);
  const referenceColors = getReferenceColors(referenceColorCard);
  console.log('correct color');
  const result = correctColor(image, measuredColors, referenceColors);
  console.log(result.getPixel(0, 0));

  return result;
}
