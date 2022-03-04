import { convertBinaryToGrey, IJS, ImageColorModel } from '../../src';

import CameraSelector from './CameraSelector';
import CameraTransform from './CameraTransform';
import Container from './Container';

function testTransform(image: IJS) {
  return testCannyEdge(image);
}

export default function Home() {
  return (
    <Container title="Home">
      <CameraSelector />
      <CameraTransform transform={testTransform} />
    </Container>
  );
}

function testCopyTo(image: IJS): IJS {
  let result = image.copyTo(image, {
    rowOffset: image.height / 2,
    columnOffset: image.width / 2,
  });
  let blackSquare = new IJS(50, 50, { colorModel: ImageColorModel.RGBA });
  let redSquare = new IJS(150, 150, { colorModel: ImageColorModel.RGBA });
  redSquare.fillChannel(0, 255);
  redSquare.fillAlpha(100);
  result = blackSquare.copyTo(result, {
    rowOffset: 200,
    columnOffset: 300,
  });
  redSquare.copyTo(result, {
    columnOffset: ((Date.now() / 10) >>> 0) % 500,
    rowOffset: ((Date.now() / 10) >>> 0) % 500,
    out: result,
  });
  return result;
}

function testCannyEdge(image: IJS): IJS {
  let result = image.convertColor(ImageColorModel.GREY);
  result = result.gaussianBlur({ size: 7, sigma: 4 });
  const edges = result.cannyEdgeDetector({
    lowThreshold: 0.02,
    highThreshold: 0.1,
  });
  convertBinaryToGrey(edges, result);
  return result;
}
