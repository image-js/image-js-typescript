import { getTemperatureMap } from '../getTemperatureMap';

describe('getTemperatureMap', () => {
  it('1 negative and 1 positive ROIs', () => {
    const colorMap = getTemperatureMap({ nbNegative: 1, nbPositive: 1 });

    // console.log(colorMap.slice(32768 - 10, 32768 + 10));

    expect(colorMap[2 ** 15 - 1]).toBe(0xffff0000); // blue
    expect(colorMap[2 ** 15 + 1]).toBe(0xff0000ff); // red
  });
});
