import { ImageColorModel, Image } from '../../Image';
import { getIntensityMoment } from '../getIntensityMoment';

test('empty image, 00', () => {
  const image = new Image(3, 3, { colorModel: ImageColorModel.GREY });
  const result = getIntensityMoment(image, 0, 0);
  expect(result).toBe(0);
});

test('empty image, 00', () => {
  const image = testUtils.createGreyImage([[1, 2, 3, 4, 5]]);
  const result = getIntensityMoment(image, 0, 0);
  expect(result).toBe(15);
});
