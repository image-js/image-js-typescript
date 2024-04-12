import { Image } from '../Image';
import { fromMask } from '../roi';

interface GetMaskFromCannyEdgeOptions {
  /**
   * Number of iterations to dilate a mask.
   * @default `1`
   */
  dilateOrder: number;
}

/**
 * Creates a mask with ROIs shapes with CannyEdge filter. Then shapes
 * get filled by internalIds.
 * @param image - image to get the mask with
 * @param options - GetMaskFromCannyEdge options
 * @returns mask
 */
export function getMaskFromCannyEdge(
  image: Image,
  options?: GetMaskFromCannyEdgeOptions,
) {
  const dilateOrder = options?.dilateOrder ?? 1;
  let mask = image.cannyEdgeDetector();
  for (let i = 0; i < dilateOrder; i++) {
    mask = mask.dilate();
  }
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
