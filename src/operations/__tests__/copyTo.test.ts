import copyTo from '../copyTo';

describe('Create a mozaic of images', () => {
  it('transparent source, opaque target', () => {
    let source = testUtils.createGreyaImage([[100, 0]]);
    let target = testUtils.createGreyaImage([[50, 255]]);
    source.copyTo(target);
    expect(target).toMatchImageData([[50, 255]]);
  });
  it('opaque source, transparent target', () => {
    let source = testUtils.createGreyaImage([[100, 255]]);
    let target = testUtils.createGreyaImage([[50, 0]]);
    source.copyTo(target);
    expect(target).toMatchImageData([[100, 255]]);
  });
});
