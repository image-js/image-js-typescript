import { IJS, ImageColorModel } from '../../src';

import CameraSelector from './CameraSelector';
import CameraTransform from './CameraTransform';
import Container from './Container';

function testTransform(image: IJS) {
  let blackSquare = new IJS(50, 50, { colorModel: ImageColorModel.RGBA });
  let redSquare = new IJS(150, 150, { colorModel: ImageColorModel.RGBA });
  redSquare.fillChannel(0, 255);
  redSquare.fillAlpha(100);
  let result = blackSquare.copyTo(image, {
    rowOffset: 200,
    columnOffset: 300,
  });
  redSquare.copyTo(result, { out: result });
  return result;
}

export default function Home() {
  return (
    <Container title="Home">
      <CameraSelector />
      <CameraTransform transform={testTransform} />
    </Container>
  );
}
