import { Matrix } from 'ml-matrix';

import { writeSync } from '../../save/write';
import { getClamp } from '../../utils/clamp';
import {
  BorderType,
  getBorderInterpolation,
} from '../../utils/interpolateBorder';
import {
  computeConvolutionValue,
  directConvolution,
  separableConvolution,
} from '../convolution';

describe('convolution functions', () => {
  it('separable convolution compared to opencv', async () => {
    const img = testUtils.load('opencv/test.png');
    const convoluted = separableConvolution(
      img,
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6, -0.3, -0.4],
      {
        borderType: BorderType.REFLECT,
      },
    );

    const expected = testUtils.load('opencv/testConv.png');
    writeSync(`${__dirname}/conv_expected.png`, expected);
    writeSync(`${__dirname}/conv_got.png`, convoluted);
    expect(convoluted).toMatchImage(expected);
  });

  it('direct convolution compared to opencv', async () => {
    const img = testUtils.load('opencv/test.png');

    const kernelY = Matrix.columnVector([0.4, 0.5, 0.6, -0.3, -0.4]);
    const kernelX = Matrix.rowVector([0.1, 0.2, 0.3]);
    const kernel = kernelY.mmul(kernelX).to2DArray();

    const convoluted = directConvolution(img, kernel, {
      borderType: BorderType.REFLECT,
    });

    const expected = testUtils.load('opencv/testConv.png');
    expect(convoluted).toMatchImage(expected);
  });

  it('normalized separated convolution should normalize as for direct convolution', () => {
    const img = testUtils.load('opencv/test.png');

    const kernelY = Matrix.columnVector([1, 0, 1]);
    const kernelX = Matrix.rowVector([2, 1, 2]);
    const kernel = kernelY.mmul(kernelX);

    // @ts-ignore
    const normalizedKernel = kernel.mul(1 / kernel.sum());
    // @ts-ignore

    const img1 = directConvolution(img, normalizedKernel.to2DArray());
    const img2 = separableConvolution(
      img,
      kernelX.to1DArray(),
      kernelY.to1DArray(),
      {
        normalize: true,
      },
    );

    expect(img1).toMatchImage(img2);
  });
});

describe('computeConvolutionValue', () => {
  it('round and clamp', () => {
    let image = testUtils.createGreyImage([
      [1, 1, 20],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    let kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const clamp = getClamp(image);
    const interpolateBorder = getBorderInterpolation(BorderType.REFLECT_101, 0);
    expect(
      computeConvolutionValue(1, 1, 0, image, kernel, interpolateBorder, {
        clamp,
      }),
    ).toBe(28);
  });
  it('round and clamp with negative kernel values', () => {
    let image = testUtils.createGreyImage([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    let kernel = [
      [-1, 1, -1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const clamp = getClamp(image);

    const interpolateBorder = getBorderInterpolation(BorderType.REFLECT_101, 0);
    expect(
      computeConvolutionValue(1, 1, 0, image, kernel, interpolateBorder, {
        clamp,
      }),
    ).toBe(5);
  });
  it('return raw value', () => {
    let image = testUtils.createGreyImage([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    let kernel = [
      [0.5, 1, -1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const interpolateBorder = getBorderInterpolation(BorderType.REFLECT_101, 0);

    expect(
      computeConvolutionValue(1, 1, 0, image, kernel, interpolateBorder, {
        returnRawValue: true,
      }),
    ).toBe(6.5);
  });
  it('should throw if no clamp function', () => {
    let image = testUtils.createGreyImage([[1, 2, 3, 4, 5, 6]]);
    let kernel = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    expect(() => {
      computeConvolutionValue(0, 2, 0, image, kernel, (i) => {
        return i;
      });
    }).toThrow('');
  });
});
