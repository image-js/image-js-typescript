import { Image } from '../Image';
import { Stack } from '../Stack';

describe('Stack constructor', () => {
  it('create a stack containing one image', () => {
    const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const stack = new Stack([image]);

    const images = stack.getImages();
    expect(stack).toBeInstanceOf(Stack);
    expect(images).toHaveLength(1);
    expect(images[0]).toBeInstanceOf(Image);
    expect(images[0]).toBe(image);
  });

  it('should throw if color model is different', () => {
    const image1 = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const image2 = testUtils.createRgbaImage([[1, 2, 3, 4]]);
    expect(() => {
      new Stack([image1, image2]);
    }).toThrow('images must all have the same bit depth and color model');
  });

  it('should throw if bit depths different', () => {
    const image1 = testUtils.createGreyImage([[1, 2, 3, 4]], { bitDepth: 8 });
    const image2 = testUtils.createGreyImage([[1, 2, 3, 4]], { bitDepth: 16 });
    expect(() => {
      new Stack([image1, image2]);
    }).toThrow('images must all have the same bit depth and color model');
  });
});

test('iterator', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const stack = new Stack([image]);

  for (const image of stack) {
    expect(image).toBeInstanceOf(Image);
  }
});

test('clone', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const stack = new Stack([image]);
  const clone = stack.clone();
  expect(clone).toBeInstanceOf(Stack);
  expect(clone).not.toBe(stack);
  expect(clone.getImages()[0]).toBeInstanceOf(Image);
  expect(clone.getImages()[0]).not.toBe(image);
  expect(clone.getImages()[0]).toEqual(image);
});

test('getImage', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
  const stack = new Stack([image]);
  expect(stack.getImage(0)).toBe(image);
});

describe('get values from stack', () => {
  it('getValue on grey image', () => {
    const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const stack = new Stack([image]);
    expect(stack.getValue(0, 0, 0, 0)).toBe(1);
  });

  it('getValue on RGB image', () => {
    const image1 = testUtils.createRgbImage([[1, 2, 3]]);
    const image2 = testUtils.createRgbImage([[4, 5, 6]]);
    const stack = new Stack([image1, image2]);
    expect(stack.getValue(1, 0, 0, 1)).toBe(5);
  });

  it('getValueByIndex', () => {
    const image = testUtils.createGreyImage([[1, 2, 3, 4]]);
    const stack = new Stack([image]);
    expect(stack.getValueByIndex(0, 1, 0)).toBe(2);
  });
});
