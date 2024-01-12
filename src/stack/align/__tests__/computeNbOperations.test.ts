import { Image } from '../../..';
import { computeNbTranslations } from '../computeNbOperations';

test('number translations small images', () => {
  const source = new Image(3, 3);
  const destination = new Image(3, 5);

  expect(
    computeNbTranslations(source, destination, {
      xMargin: 1,
      yMargin: 1,
    }),
  ).toBe(15);
});
