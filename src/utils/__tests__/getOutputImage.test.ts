import { IJS, ColorDepth } from '../../IJS';
import { ImageColorModel } from '../colorModels';
import { getOutputImage } from '../getOutputImage';

describe('getOutputImage', () => {
  it('should default to creating an empty image', () => {
    const img = new IJS(2, 2, {
      colorModel: ImageColorModel.GREY,
      data: Uint8Array.of(0, 1, 2, 3),
    });
    const output = getOutputImage(img);
    expect(output).toMatchObject({
      width: 2,
      height: 2,
      colorModel: ImageColorModel.GREY,
      depth: ColorDepth.UINT8,
    });
    expect(output.data).toStrictEqual(new Uint8Array(4));
  });

  it('should create with requirements', () => {
    const img = new IJS();
    const requirements = {
      colorModel: ImageColorModel.GREY,
    };
    const output = getOutputImage(img, {}, { newParameters: requirements });
    expect(output).toMatchObject({
      colorModel: ImageColorModel.GREY,
    });
  });

  it('should accept out with matching requirements', () => {
    const img = new IJS();
    const requirements = {
      colorModel: ImageColorModel.GREY,
    };
    const correct = new IJS(requirements);
    const output = getOutputImage(
      img,
      { out: correct },
      { newParameters: requirements },
    );
    expect(output).toBe(correct);
  });

  it('should throw with non-matching requirements', () => {
    const img = new IJS();
    const requirements = {
      colorModel: ImageColorModel.GREY,
    };
    const incorrect = new IJS();
    expect(() =>
      getOutputImage(img, { out: incorrect }, { newParameters: requirements }),
    ).toThrow(
      /cannot use out. Its colorModel property must be GREY. Found RGB/,
    );
  });

  it('should throw if out is not an image', () => {
    const img = new IJS();
    // @ts-ignore
    expect(() => getOutputImage(img, { out: 'str' })).toThrow(
      /out must be an IJS object/,
    );
  });
});
