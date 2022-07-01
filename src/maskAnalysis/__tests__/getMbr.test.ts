import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { angle } from '../../utils/geometry/points';
import { getMbr } from '../getMbr';

expect.extend({ toBeDeepCloseTo });

describe('getMbr', () => {
  it('verify that angle is correct', () => {
    const mask = testUtils.createMask(`
      0 0 0 0 0 0 0 0
      0 0 0 1 1 0 0 0
      0 0 0 1 1 0 0 0
      0 0 1 1 1 1 1 1
      0 0 1 1 1 1 1 1
      0 0 0 1 1 0 0 0
      0 0 0 1 1 0 0 0
      0 0 0 0 0 0 0 0
    `);

    const result = getMbr(mask);
    expect(result).toHaveLength(4);

    for (let i = 0; i < 4; i++) {
      let currentAngle = angle(
        result[(i + 1) % 4],
        result[i],
        result[(i + 2) % 4],
      );
      expect(Math.abs(currentAngle)).toBeCloseTo(Math.PI / 2, 1e-6);
    }
  });

  it('small rectangular ROI', () => {
    const mask = testUtils.createMask([
      [0, 0, 1],
      [0, 1, 1],
      [1, 1, 0],
      [1, 0, 0],
    ]);

    const result = getMbr(mask);
    expect(result).toBeDeepCloseTo(
      [
        { column: 4, row: 1 },
        { column: 0.5, row: 4.5 },
        { column: -1, row: 3 },
        { column: 2.5, row: -0.5 },
      ],
      6,
    );
  });

  it('horizontal MBR', () => {
    const mask = testUtils.createMask(
      `
      1 0 0 0 0 0 0 1
      0 1 1 1 1 1 1 0
      1 0 0 1 1 0 1 0
    `,
    );

    const result = getMbr(mask);

    expect(result).toStrictEqual([
      { column: 8, row: 3 },
      { column: 0, row: 3 },
      { column: 0, row: 0 },
      { column: 8, row: 0 },
    ]);
  });

  it('other horizontal MBR', () => {
    const mask = testUtils.createMask(
      `
      1 0 0 0 1 0 
      0 1 1 1 1 0 
      1 0 1 1 0 1 
    `,
    );

    const result = getMbr(mask);
    expect(result).toStrictEqual([
      { column: 6, row: 3 },
      { column: 0, row: 3 },
      { column: 0, row: 0 },
      { column: 6, row: 0 },
    ]);
  });

  it('small tilted rectangle', () => {
    const mask = testUtils.createMask(`
     0 1 0
     1 1 1
     0 1 0
      `);

    const result = getMbr(mask);
    expect(result).toBeDeepCloseTo(
      [
        { column: 1.5, row: 3.5 },
        { column: -0.5, row: 1.5 },
        { column: 1.5, row: -0.5 },
        { column: 3.5, row: 1.5 },
      ],
      6,
    );
  });

  it('large tilted rectangle', () => {
    const mask = testUtils.createMask(` 
        0 0 1 0 0 0
        0 1 1 1 0 0
        1 1 1 1 1 0
        0 1 1 1 1 1
        0 0 1 1 1 0
        0 0 0 1 0 0
      `);
    const result = getMbr(mask);
    expect(result).toBeDeepCloseTo(
      [
        { column: 2.5, row: -0.5 },
        { column: 6.5, row: 3.5 },
        { column: 3.5, row: 6.5 },
        { column: -0.5, row: 2.5 },
      ],
      6,
    );
  });

  it('one point ROI', () => {
    const mask = testUtils.createMask([[1]]);
    const result = getMbr(mask);
    expect(result).toStrictEqual([
      { column: 0, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: 0 },
      { column: 0, row: 0 },
    ]);
  });

  it('2 points ROI', () => {
    const mask = testUtils.createMask([
      [1, 0],
      [0, 1],
    ]);
    const result = getMbr(mask);

    expect(result).toBeDeepCloseTo(
      [
        { column: 0.5, row: -0.5 },
        { column: 2.5, row: 1.5 },
        { column: 1.5, row: 2.5 },
        { column: -0.5, row: 0.5 },
      ],
      6,
    );
  });

  it('small triangular ROI', () => {
    const mask = testUtils.createMask([
      [1, 1],
      [1, 0],
    ]);

    const result = getMbr(mask);

    expect(result).toBeDeepCloseTo(
      [
        { column: 0, row: 2 },
        { column: 0, row: 0 },
        { column: 2, row: 0 },
        { column: 2, row: 2 },
      ],
      6,
    );
  });
});