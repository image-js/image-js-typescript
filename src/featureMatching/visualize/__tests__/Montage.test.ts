import { ImageColorModel } from '../../../Image';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { Montage } from '../Montage';

test('drawKeypoints with default options', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);

  const montage = new Montage(source, source);
  montage.drawKeypoints(sourceKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});

test('drawKeypoints with scale = 2', () => {
  const source = testUtils.load('featureMatching/alphabet.jpg');
  const grey = source.convertColor(ImageColorModel.GREY);
  const sourceKeypoints = getOrientedFastKeypoints(grey);

  const montage = new Montage(source, source, { scale: 2 });
  montage.drawKeypoints(sourceKeypoints);

  expect(montage.image).toMatchImageSnapshot();
});
