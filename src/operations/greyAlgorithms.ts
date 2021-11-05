import { IJS } from '..';

export type GreyAlgorithm =
  | 'luma709'
  | 'luma601'
  | 'maximum'
  | 'minimum'
  | 'average'
  | 'minmax'
  | 'red'
  | 'green'
  | 'blue'
  | 'cyan'
  | 'magenta'
  | 'yellow'
  | 'black'
  | 'hue'
  | 'saturation'
  | 'lightness';

/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 */
export function luma709(red: number, green: number, blue: number): number {
  // sRGB
  // return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  // Let's do a little trick ... in order not convert the integer to a double we do
  // the multiplication with integer to reach a total of 32768 and then shift the bits
  // of 15 to the right
  // This does a Math.floor and may lead to small (max 1) difference
  // Same result, > 10% faster on the full grey conversion
  return (red * 6966 + green * 23436 + blue * 2366) >> 15;
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 */
export function luma601(red: number, green: number, blue: number): number {
  // NTSC
  // return this.red * 0.299 + green * 0.587 + blue * 0.114;
  return (red * 9798 + green * 19235 + blue * 3735) >> 15;
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 */
export function max(red: number, green: number, blue: number): number {
  return Math.max(red, green, blue);
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 */
export function min(red: number, green: number, blue: number): number {
  return Math.min(red, green, blue);
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 */
export function average(red: number, green: number, blue: number): number {
  return ((red + green + blue) / 3) >> 0;
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 */
export function minmax(red: number, green: number, blue: number): number {
  return (Math.max(red, green, blue) + Math.min(red, green, blue)) / 2;
}
/**
 * @param red - Red value of current pixel.
 */
export function red(red: number): number {
  return red;
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 */
export function green(red: number, green: number): number {
  return green;
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 */
export function blue(red: number, green: number, blue: number): number {
  return blue;
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @param image - Image to convert to grey.
 */
export function black(
  red: number,
  green: number,
  blue: number,
  image: IJS,
): number {
  return Math.min(
    image.maxValue - red,
    image.maxValue - green,
    image.maxValue - blue,
  );
}
/**
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @param image - Image to convert to grey.
 */
export function cyan(
  red: number,
  green: number,
  blue: number,
  image: IJS,
): number {
  let blackColor = black(red, green, blue, image);
  return (
    ((image.maxValue - red - blackColor) / (1 - blackColor / image.maxValue)) >>
    0
  );
}
/**
 * @param red - Red value of current pixel
 * @param green - Green value of current pixel
 * @param blue - Blue value of current pixel
 * @param image - Image to convert to grey.
 */
export function magenta(
  red: number,
  green: number,
  blue: number,
  image: IJS,
): number {
  let blackColor = black(red, green, blue, image);
  return (
    ((image.maxValue - green - blackColor) /
      (1 - blackColor / image.maxValue)) >>
    0
  );
}
/**
 * @param red - Red value of current pixel
 * @param green - Green value of current pixel
 * @param blue - Blue value of current pixel
 * @param image - Image to convert to grey.
 */
export function yellow(
  red: number,
  green: number,
  blue: number,
  image: IJS,
): number {
  let blackColor = black(red, green, blue, image);
  return (
    ((image.maxValue - blue - blackColor) /
      (1 - blackColor / image.maxValue)) >>
    0
  );
}
/**
 * @param red - Red value of current pixel
 * @param green - Green value of current pixel
 * @param blue - Blue value of current pixel
 * @param image - Image to convert to grey.
 */
export function hue(
  red: number,
  green: number,
  blue: number,
  image: IJS,
): number {
  let minValue = min(red, green, blue);
  let maxValue = max(red, green, blue);
  if (maxValue === minValue) {
    return 0;
  }
  let hue = 0;
  let delta = maxValue - minValue;

  switch (maxValue) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    case blue:
      hue = (red - green) / delta + 4;
      break;
    default:
      throw new Error('unreachable');
  }
  return ((hue / 6) * image.maxValue) >> 0;
}
/**
 * @param red - Red value of current pixel
 * @param green - Green value of current pixel
 * @param blue - Blue value of current pixel
 * @param image - Image to convert to grey.
 */
export function saturation(
  red: number,
  green: number,
  blue: number,
  image: IJS,
): number {
  // from HSV model
  let minValue = min(red, green, blue);
  let maxValue = max(red, green, blue);
  let delta = maxValue - minValue;
  return maxValue === 0 ? 0 : (delta / maxValue) * image.maxValue;
}
/**
 * @param red - Red value of current pixel
 * @param green - Green value of current pixel
 * @param blue - Blue value of current pixel
 */
export function lightness(red: number, green: number, blue: number): number {
  let minValue = min(red, green, blue);
  let maxValue = max(red, green, blue);
  return (maxValue + minValue) / 2;
}
