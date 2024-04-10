import { decodePng } from '..';

const tests = [
  // ['name', components, alpha, depth]
  ['grey8', 8, 'GREY'],
  ['grey16', 16, 'GREY'],
  ['greya16', 8, 'GREYA'],
  ['greya32', 16, 'GREYA'],
  ['rgb24', 8, 'RGB'],
  ['rgb48', 16, 'RGB'],
  ['rgba32', 8, 'RGBA'],
  ['rgba64', 16, 'RGBA'],
  ['plt-4bpp', 8, 'RGB'],
  ['plt-8bpp-color', 8, 'RGB'],
] as const;

test.each(tests)('should load from buffer %s', (name, depth, colorModel) => {
  const buffer = testUtils.loadBuffer(`formats/${name}.png`);
  const img = decodePng(buffer);
  expect(img.depth).toBe(depth);
  expect(img.colorModel).toBe(colorModel);
});
