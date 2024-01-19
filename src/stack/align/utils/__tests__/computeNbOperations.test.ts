import { Image } from '../../../..';
import {
  computeNbOperations,
  computeNbTranslations,
} from '../computeNbOperations';

test('number translations small images', () => {
  const source = new Image(3, 3);
  const destination = new Image(3, 5);

  expect(
    computeNbTranslations(source, destination, {
      xMargin: 1,
      yMargin: 1,
    }),
  ).toBe(15);
});

test('number operations small images', () => {
  const source = new Image(3, 3);
  const destination = new Image(3, 5);

  const trueNbOperations = 3 * 9 + 4 * 4 + 2 * 6 + 6 * 6;

  const result = computeNbOperations(source, destination, {
    xMargin: 1,
    yMargin: 1,
  });
  expect(result > trueNbOperations).toBe(true);
  expect(result).toBe(15 * 9);
});

test('larger images, no margin', () => {
  const source = new Image(2, 2);
  const destination = new Image(1000, 1000);

  const translations = computeNbTranslations(source, destination);

  expect(translations).toBe(999 ** 2);

  const operations = computeNbOperations(source, destination);

  expect(operations).toBe(3992004);
});

test('id crops, no margin', () => {
  const source = testUtils.load('align/croppedRef.png');
  const destination = testUtils.load('align/cropped.png');

  const translations = computeNbTranslations(source, destination);

  expect(translations).toBe(
    (destination.width - source.width + 1) *
      (destination.height - source.height + 1),
  );

  const operations = computeNbOperations(source, destination);

  expect(operations).toBe(11049161922);
});
