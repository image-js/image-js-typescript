import { Image } from '../../../../Image';
import { Stack } from '../../../../Stack';
import { computeCropOrigins } from '../computeCropOrigins';
import { findCommonArea } from '../findCommonArea';

const image1 = new Image(4, 4);
const image2 = new Image(3, 4);
const image3 = new Image(6, 5);
const image4 = new Image(4, 2);
const absoluteTranslations = [
  { column: 0, row: 0 },
  { column: 2, row: -2 },
  { column: 1, row: 1 },
  { column: -1, row: 1 },
];
test('stack of 2 images', () => {
  const stack = new Stack([image1, image2]);
  const absTranslations = absoluteTranslations.slice(0, 2);

  const commonArea = findCommonArea(stack, absTranslations);

  const result = computeCropOrigins(stack, commonArea, absTranslations);

  expect(result).toStrictEqual([
    { column: 2, row: 0 },
    { column: 0, row: 2 },
  ]);
});

test('stack of 3 images', () => {
  const stack = new Stack([image1, image2, image3]);
  const absTranslations = absoluteTranslations.slice(0, 3);

  const commonArea = findCommonArea(stack, absTranslations);

  const result = computeCropOrigins(stack, commonArea, absTranslations);

  expect(result).toStrictEqual([
    { column: 2, row: 1 },
    { column: 0, row: 3 },
    { column: 1, row: 0 },
  ]);
});

test('stack of 4 images', () => {
  const stack = new Stack([image1, image2, image3, image4]);
  const absTranslations = absoluteTranslations.slice(0, 4);

  const commonArea = findCommonArea(stack, absTranslations);

  const result = computeCropOrigins(stack, commonArea, absTranslations);

  expect(result).toStrictEqual([
    { column: 2, row: 1 },
    { column: 0, row: 3 },
    { column: 1, row: 0 },
    { column: 3, row: 0 },
  ]);
});
