import { IJS, ImageColorModel } from '../IJS';

export function split(IJS: IJS): IJS[] {
  const result = [];
  for (let c = 0; c < IJS.channels; c++) {
    const channel = IJS.createFrom(IJS, { kind: ImageColorModel.GREY });
    for (let i = 0; i < channel.data.length; i++) {
      channel.data[i] = IJS.data[i * IJS.channels + c];
    }
    result.push(channel);
  }
  return result;
}
