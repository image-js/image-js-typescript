import { ImageColorModel } from '../../../../Image';
import { getOrientedFastKeypoints } from '../../../keypoints/getOrientedFastKeypoints';
import { getBriefDescriptors } from '../../getBriefDescriptors';
import { sliceBrief } from '../sliceBrief';

test('default options', () => {
  const image = testUtils
    .load(`featureMatching/polygons/polygon.png`)
    .convertColor(ImageColorModel.GREY)
    .invert();

  const keypoints = getOrientedFastKeypoints(image);

  const brief = getBriefDescriptors(image, keypoints);

  const result = sliceBrief(brief);

  expect(result).toStrictEqual(brief);
});

test('slice 0 to 3', () => {
  const image = testUtils
    .load(`featureMatching/polygons/polygon.png`)
    .convertColor(ImageColorModel.GREY)
    .invert();

  const keypoints = getOrientedFastKeypoints(image);

  const brief = getBriefDescriptors(image, keypoints);

  const result = sliceBrief(brief, { end: 3 });

  expect(result.descriptors.length).toBe(3);
});

test('range error', () => {
  const image = testUtils
    .load(`featureMatching/polygons/polygon.png`)
    .convertColor(ImageColorModel.GREY)
    .invert();

  const keypoints = getOrientedFastKeypoints(image);

  const brief = getBriefDescriptors(image, keypoints);

  expect(() => sliceBrief(brief, { start: -1 })).toThrow(
    'start or end are out of range',
  );
});
