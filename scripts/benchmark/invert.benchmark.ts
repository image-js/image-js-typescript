// run with `ts-node-transpile-only scripts/benchmark/invert.benchmark.ts`

import { read } from '../../src';
import { join } from 'path';

async function doAll() {
  let image = await read(join(__dirname, 'large.png'));

  console.time('invert');

  for (let i=0; i<10; i++) {
  image = image.invert()
  }
  console.timeEnd('invert');
}

doAll();
