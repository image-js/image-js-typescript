import { readSync } from 'fs';
import { read } from '../../src';
import { join } from 'path';

async function doAll() {
  const image = await read(join(__dirname, 'large.jpg'));

  console.time('resize');
  image.resize({ width: 3000, height: 2000, interpolationType: 'bilinear' });
  console.timeEnd('resize');
}

doAll();
