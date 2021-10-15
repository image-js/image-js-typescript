import { IJS } from '../IJS';
import { BorderType } from '../types';

import { separableConvolution } from './convolution';

export interface IBlurOptions {
  width: number;
  height: number;
  borderType?: BorderType;
  borderValue?: number;
  out?: IJS;
}

export function blur(image: IJS, options: IBlurOptions): IJS {
  const { width, height } = options;
  const kernelX = new Array(width).fill(1);
  const kernelY = new Array(height).fill(1);

  return separableConvolution(image, kernelX, kernelY, {
    normalize: true,
    ...options,
  });
}
