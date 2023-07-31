import { createGreyImage } from '../../../test/testUtils';
import { waterShed } from '../waterShed';

describe('Test WaterShed Roi generation', () => {
  it('basic', () => {
    let image = createGreyImage(
      // prettier-ignore
      [[3, 3, 3, 3, 3], [3, 2, 2, 2, 3,],[ 3, 2, 1, 2, 3],[ 3, 2, 2, 2, 3],[ 3, 3, 3, 3, 3]],
    );
    let result = waterShed(image, { channel: 0 });
    // prettier-ignore
    expect(result).toEqual(new Int16Array(25).fill(1));
  });
});

it('for a GREY image', () => {
  let image = createGreyImage(
    // prettier-ignore
    [[3, 3, 3, 3, 3, 3, 3, 3, 4, 4,],[ 3, 3, 2, 2, 2, 3, 3, 3, 4, 4,],[4, 3, 2, 1, 2, 2, 3, 3, 4, 4,],[ 4, 3, 2, 2, 2, 2, 3, 3, 3, 4,],[ 4, 4, 4, 3, 2, 3, 3, 3, 3, 4,],[ 4, 4, 4, 3, 3, 3, 3, 3, 3, 3,],[ 4, 3, 3, 3, 3, 3, 2, 2, 2, 3,],[ 4, 4, 3, 3, 3, 3, 2, 1, 2, 2,],[ 4, 4, 4, 4, 3, 2, 2, 2, 2, 3,],[ 4, 4, 4, 4, 3, 3, 3, 3, 2, 3]],
  );

  let map = waterShed(image, { channel: 0, fillMaxValue: 2 });

  // prettier-ignore
  expect(
    map
  ).toStrictEqual(new Int16Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]));
});
