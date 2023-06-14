import { Image } from '../Image';
import { validateChannel } from '../utils/validators';

export interface HistogramOptions {
  /**
   * The channel for which to compute the histogram.
   * If it is unspecified, the image must have one channel or the method will
   * throw an error.
   *
   * @default 0
   */
  channel?: number;
  maxSlots?: number;
}

/**
 * Returns a histogram of pixel intensities.
 *
 * @param image - The original image.
 * @param options - Histogram options.
 * @returns - The histogram.
 */
export function histogram(
  image: Image,
  options: HistogramOptions = {},
): Uint32Array {
  let { channel, maxSlots = 256 } = options;
  if (!(maxSlots !== 0 && (maxSlots & (maxSlots - 1)) === 0)) {
    throw new RangeError(
      'maxSlots must be a power of 2, for example: 64, 256, 1024',
    );
  }
  if (typeof channel !== 'number') {
    if (image.channels !== 1) {
      throw new TypeError(
        'channel option is mandatory for multi-channel images',
      );
    }
    channel = 0;
  }
  validateChannel(channel, image);
  let bitShift = 0;
  bitShift = image.bitDepth - maxSlots;
  const hist = new Uint32Array(image.maxValue + 1);
  for (let i = 0; i < image.size; i++) {
    hist[image.getValueByIndex(i, channel) >> bitShift]++;
  }
  return hist;
}
