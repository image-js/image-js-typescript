import { Image } from '../../../../Image';
import { Stack } from '../../../../Stack';
import { findCommonArea } from '../findCommonArea';

const image1 = new Image(4, 4);
const image2 = new Image(3, 4);
const image3 = new Image(6, 5);
const image4 = new Image(4, 2);
const translations = [
  { column: 0, row: 0 },
  { column: 2, row: -2 },
  { column: 1, row: 1 },
  { column: -1, row: 1 },
];
test('stack of 2 images', () => {
  const stack = new Stack([image1, image2]);
  stack.setTranslations(translations.slice(0, 2));

  const result = findCommonArea(stack);

  expect(result).toStrictEqual({
    origin: { column: 2, row: 0 },
    width: 2,
    height: 2,
  });
});

test('stack of 3 images', () => {
  const stack = new Stack([image1, image2, image3]);
  stack.setTranslations(translations.slice(0, 3));

  const result = findCommonArea(stack);

  expect(result).toStrictEqual({
    origin: { column: 2, row: 1 },
    width: 2,
    height: 1,
  });
});

test('stack of 4 images', () => {
  const stack = new Stack([image1, image2, image3, image4]);
  stack.setTranslations(translations.slice(0, 4));

  const result = findCommonArea(stack);

  expect(result).toStrictEqual({
    origin: { column: 2, row: 1 },
    width: 1,
    height: 1,
  });
});

test('stack of 1 images error', () => {
  const stack = new Stack([image1]);

  expect(() => findCommonArea(stack)).toThrow(
    'Stack must contain at least 2 images',
  );
});
