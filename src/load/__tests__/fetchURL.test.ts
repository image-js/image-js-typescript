import { encodeDataURL } from '../../save/encodeDataURL.js';
import { fetchURL } from '../fetchURL.js';

describe('testing fetchURL', () => {
  test('basic test 1', async () => {
    const image = await fetchURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAAAAACoBHk5AAAAFklEQVR4XmNggID///+DSCCEskHM/wCAnQr2TY5mOAAAAABJRU5ErkJggg==',
    );
    expect(image.bitDepth).toBe(8);
    expect(image.getRawImage().data).toEqual(
      new Uint8Array([
        0, 0, 0, 0, 0, 0, 255, 255, 255, 0, 0, 255, 0, 255, 0, 0, 255, 255, 255,
        0, 255, 0, 255, 0, 255,
      ]),
    );
  });
  test('encoded URL must be equal to decoded one', async () => {
    const dataURL =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAAAAACoBHk5AAAAFklEQVR4XmNggID///+DSCCEskHM/wCAnQr2TY5mOAAAAABJRU5ErkJggg==';
    const image = await fetchURL(dataURL);
    const result = encodeDataURL(image);
    expect(result).toEqual(dataURL);
  });
  test('decode from an image url', async () => {
    const image = await fetchURL('https://picsum.photos/id/237/150/200');
    expect(image.width).toEqual(150);
    expect(image.height).toEqual(200);
    expect(image.bitDepth).toEqual(8);
  });
});
