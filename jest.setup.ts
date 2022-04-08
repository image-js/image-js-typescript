import { toMatchImageSnapshot } from 'jest-image-snapshot';

import * as jestMatchers from './test/jestMatchers';
import * as testUtils from './test/testUtils';

expect.extend({
  ...jestMatchers,
  toMatchImageSnapshot,
});

globalThis.testUtils = testUtils;
