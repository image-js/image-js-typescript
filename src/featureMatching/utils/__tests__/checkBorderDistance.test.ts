import { expect, test } from 'vitest';

import { Image } from '../../../Image.js';
import type { Point } from '../../../geometry/index.js';
import { checkBorderDistance } from '../checkBorderDistance.js';

test('should be true', () => {
  const size = 7;
  const image = new Image(size, size);

  const distance = 3;
  const point: Point = { column: 3, row: 3 };

  expect(checkBorderDistance(image, point, distance)).toBe(true);
});

test('should be false', () => {
  const size = 7;
  const image = new Image(size, size);

  const distance = 3;
  const points: Point[] = [
    { column: 2, row: 3 },
    { column: 3, row: 2 },
    { column: 4, row: 3 },
    { column: 3, row: 4 },
  ];
  for (const point of points) {
    expect(checkBorderDistance(image, point, distance)).toBe(false);
  }
});
