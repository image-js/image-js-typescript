import { readdirSync } from 'node:fs';
import {
  alignStack,
  createStackFromPaths,
  cropCommonArea,
} from '../../src/stack/index';
import { findCommonArea } from '../../src/stack/align/utils/findCommonArea';
import { crop, writeSync } from '../../src';

const folder = `${__dirname}/BloodMoon`;
let imageNames = readdirSync(folder);

imageNames = imageNames.slice(0, 2);

const paths = imageNames.map((name) => `${folder}/${name}`);

console.log(paths);

console.log('Number of images in stack:', paths.length);

const stack = createStackFromPaths(paths);

console.log(
  `Images dimensions: ${stack.getImage(0).width}x${stack.getImage(0).height}`,
);

console.log('Compute absolute translations');
const translations = alignStack(stack, {
  minNbPixels: 1000,
  debug: true,
  scalingFactor: 100,
});

console.log('Cropping all images');
const crops = cropCommonArea(stack, translations.absolute);

console.log('Writing all images');
for (let i = 0; i < crops.size; i++) {
  const image = crops.getImage(i);
  writeSync(`${__dirname}/result/${imageNames[i]}`, image);
}
