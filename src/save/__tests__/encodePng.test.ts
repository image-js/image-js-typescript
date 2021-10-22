import { encodePng } from '..';
import { decode } from '../../load/decode';

describe('encode PNG', () => {
  it('should encode what it decoded', () => {
    const buffer = testUtils.loadBuffer('formats/grey8.png');
    const img = decode(buffer);
    const imgDup = decode(encodePng(img));
    expect(imgDup.colorModel).toStrictEqual(img.colorModel);
    expect(imgDup.depth).toStrictEqual(img.depth);
    expect(imgDup).toMatchImage(img);
  });
});
