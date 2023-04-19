// can be executed with `ts-node-transpile-only scripts/benchmark/resize.benchmark.ts`

import { read, Montage } from '../../src';
import { join } from 'path';

async function doAll() {
  //const image = await read(join(__dirname, 'large.jpg'));
  //const image = await read(join(__dirname, '744x800.jpg'));
  const image = await read(
    join(__dirname, '../../test/img/featureMatching/alphabet.jpg'),
  );

  const montage = new Montage(image, image, { scale: 3 });
}

doAll();
