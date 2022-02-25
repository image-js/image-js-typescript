import { BorderType } from '../../utils/interpolateBorder';
import { gaussianBlur } from '../gaussianBlur';

describe('gaussianBlur', () => {
  it('should return the kernel itself', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 255, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const options = { size: 5, sigma: 1 };

    let result = image.gaussianBlur(options);
    console.log(result);

    expect(result).toMatchImageData([
      [3, 7, 11, 7, 3],
      [7, 15, 25, 15, 7],
      [11, 25, 41, 25, 11],
      [7, 15, 25, 15, 7],
      [3, 7, 11, 7, 3],
    ]);

    let sum = 0;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        sum += result.getValue(i, j, 0);
      }
    }
    // todo: this is expected to return 255! -> refer to #47
    expect(sum).toBe(313);
  });

  it.skip('gaussian blur should have same result as opencv', async () => {
    const img = testUtils.load('opencv/test.png');
    const options = {
      borderType: BorderType.REFLECT,
      size: 3,
      sigmaX: 1,
      sigmaY: 1,
    };
    const blurred = gaussianBlur(img, options);

    // const grey = convertColor(img, ImageKind.GREY);
    // const greyBlurred = gaussianBlur(grey, options);
    // console.log(greyBlurred.data);

    const expected = testUtils.load('opencv/testGaussianBlur.png');
    // write('gaussian.png', blurred);
    expect(expected).toMatchImage(blurred);
  });
});
