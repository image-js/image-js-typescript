import { Image } from '../Image';
import { DilateOptions } from '../morphology';
import { fromMask } from '../roi';

/**
 * Creates a mask with ROIs shapes with CannyEdge filter. Then shapes
 * get filled by internalIds.
 * @param image - image to get the mask with
 * @param options - GetMaskFromCannyEdge options
 * @returns mask
 */
export function getMaskFromCannyEdge(image: Image, options?: DilateOptions) {
  const kernel = options?.kernel ?? [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  const iterations = options?.iterations ?? 1;

  let mask = image.cannyEdgeDetector();
  mask = mask.dilate({ iterations, kernel });

  const roiMap = fromMask(mask);
  const rois = roiMap.getRois({ kind: 'white' });
  for (const roi of rois) {
    const ids = new Set(
      roi.internalIDs.filter((value) => {
        return value < 0;
      }),
    );
    for (let i = roi.origin.row; i < roi.origin.row + roi.height; i++) {
      for (let j = roi.origin.column; j < roi.origin.column + roi.width; j++) {
        const value = roi.getMapValue(j, i);
        if (ids.has(value)) {
          mask.setBit(j, i, 1);
        }
      }
    }
  }
  return mask;
}
