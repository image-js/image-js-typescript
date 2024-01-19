import { Image } from '../../../..';
import { findOverlap } from '../findOverlap';

test('source entirely in destination', () => {
  const source = new Image(2, 2);
  const destination = new Image(5, 4);
  const sourceTranslation = { column: 2, row: 1 };

  const result = findOverlap({ source, destination, sourceTranslation });

  expect(result).toStrictEqual({
    sourceOrigin: { column: 0, row: 0 },
    destinationOrigin: { column: 2, row: 1 },
    width: 2,
    height: 2,
  });
});

test('source partly out of destination', () => {
  const source = new Image(2, 2);
  const destination = new Image(5, 4);
  const sourceTranslation = { column: -1, row: 3 };

  const result = findOverlap({ source, destination, sourceTranslation });

  expect(result).toStrictEqual({
    sourceOrigin: { column: 1, row: 0 },
    destinationOrigin: { column: 0, row: 3 },
    width: 1,
    height: 1,
  });
});
