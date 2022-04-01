import { IJS } from '../../../src';

let column = 0;
let row = 0;

let columnInterval: number;
let rowInterval: number;

export function testCropBounce(image: IJS): IJS {
  const width = image.width / 4;
  const height = image.height / 4;

  if (column === image.width - width) {
    columnInterval = -1;
  } else if (column === 0) {
    columnInterval = 1;
  }

  if (row === image.height - height) {
    rowInterval = -1;
  } else if (row === 0) {
    rowInterval = 1;
  }

  column += columnInterval;
  row += rowInterval;

  let cropped = image.crop({
    column,
    row,
    width,
    height,
  });
  return cropped;
}
