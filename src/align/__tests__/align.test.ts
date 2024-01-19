import { overlapImages } from '../../featureMatching';
import { align } from '../align';

test('1 pixel source', () => {
  const source = testUtils.createGreyImage([
    [255, 0],
    [0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 255, 0],
    [0, 0, 0],
  ]);

  const result = align(source, destination);
  expect(result).toStrictEqual({ row: 2, column: 1 });
});

test('4 pixels source', () => {
  const source = testUtils.createGreyImage([
    [0, 80],
    [150, 200],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 100],
    [0, 255, 255],
  ]);

  const result = align(source, destination, { blurKernelSize: 1 });
  expect(result).toStrictEqual({
    row: 1,
    column: 1,
  });
});

test('twice same image', () => {
  const source = testUtils.load('opencv/test.png').grey();

  const destination = testUtils.load('opencv/test.png').grey();

  const result = align(source, destination);
  expect(result).toStrictEqual({ row: 0, column: 0 });
});

test('larger image and crop', () => {
  const side = 100;
  const origin = { row: 30, column: 30 };
  const destination = testUtils.load('ssim/ssim-original.png');
  const source = destination.crop({ origin, width: side, height: side });

  const result = align(source, destination);

  expect(result).toStrictEqual(origin);
});

test('id crops', () => {
  const destination = testUtils.load('align/cropped.png').grey();
  const source = testUtils.load('align/croppedRef.png').grey();

  const result = align(source, destination);

  const overlap = overlapImages(source, destination, { origin: result });

  expect(overlap).toMatchImageSnapshot();
});

test('other id crops', () => {
  const destination = testUtils.load('align/cropped1.png').grey();
  const source = testUtils.load('align/croppedRef1.png').grey();
  const result = align(source, destination, { level: 'uniform' });

  const overlap = overlapImages(source, destination, { origin: result });
  expect(overlap).toMatchImageSnapshot();
});

test('same size source and destination', () => {
  const source = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 80],
    [0, 150, 200],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 100],
    [0, 255, 255],
  ]);

  const result = align(source, destination, { blurKernelSize: 1 });
  expect(result).toStrictEqual({
    row: 0,
    column: 0,
  });
});

test('expect wrong behavior', () => {
  const source = testUtils.createGreyImage([
    [0, 100, 0],
    [255, 255, 0],
    [0, 0, 0],
  ]);
  const destination = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 100],
    [0, 255, 255],
  ]);

  const result = align(source, destination, { blurKernelSize: 1 });
  expect(result).toStrictEqual({
    row: 0,
    column: 0,
  });
  // this algorithm doen't work when one image is partly out of the other
});
