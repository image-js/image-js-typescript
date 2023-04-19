import { Image } from '../../../Image';
import { getBriefDescriptors } from '../../descriptors/getBriefDescriptors';
import { FastKeypoint } from '../../keypoints/getFastKeypoints';
import { getOrientedFastKeypoints } from '../../keypoints/getOrientedFastKeypoints';
import { bruteForceOneMatch, Match } from '../../matching/bruteForceMatch';
import { Montage } from '../Montage';

const source = testUtils.load('featureMatching/alphabet.jpg');
const grey = source.convertColor('GREY');
const sourceKeypoints = getOrientedFastKeypoints(grey);

describe('constructor', () => {
  it(' scale = 3', () => {
    const source = testUtils.load('featureMatching/alphabet.jpg');
    const montage = new Montage(source, source, { scale: 3 });
    expect(montage.height).toBe(3 * source.height);
  });
});
