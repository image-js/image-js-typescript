import { readdirSync } from 'node:fs';

import { createStackFromPaths } from '../createStackFromPaths';

test('read all images from a folder', () => {
  const folder = `${__dirname}/../../../../test/img/ssim`;
  const paths = readdirSync(folder).map((name) => `${folder}/${name}`);
  const stack = createStackFromPaths(paths);
  expect(stack.size).toBe(paths.length);
});
