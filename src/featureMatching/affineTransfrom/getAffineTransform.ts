import { getAffineTransform as matrixGetAffineTransform } from 'ml-affine-transform';
import { ransac } from 'ml-ransac';

import {
  Match,
  Montage,
  MontageDisposition,
  bruteForceOneMatch,
  getCrosscheckMatches,
} from '..';
import { Point, Image, writeSync } from '../..';
import { getMinMax } from '../../utils/getMinMax';
import { getBrief } from '../descriptors/getBrief';
import { filterEuclideanDistance } from '../matching/filterEuclideanDistance';

import { affineFitFunction } from './affineFitFunction';
import { createAffineTransformModel } from './createAffineTransformModel';
import { getEuclideanDistance } from './getEuclideanDistance';
import { getMatrixFromPoints } from './getMatrixFromPoints';

export interface GetAffineTransformOptions {
  /**
   * @default 31
   */
  centroidPatchDiameter?: number;
  /**
   * @default 10
   */
  bestKeypointRadius?: number;
  /**
   * Should only the crossckeck matches be considered.
   * @default true
   */
  crosscheck?: boolean;
  /**
   * Origin of the destination image relative to the top-left corner of the source image.
   * @default { column: 0, row: 0 }
   */
  destinationOrigin?: Point;
  /**
   * Verify scale and rotation are in acceptable limits.
   * @default false
   */
  checkLimits?: boolean;
  /**
   * Maximal acceptable scale error. The scale between source and destination should be in range [0.9, 1.1].
   */
  maxScaleError?: 0.1;
  /**
   * Maximal rotation accepted between source and destination in degrees.
   */
  maxAngleError?: 5;
  /**
   * Max number of iterations of the ransac algorithm.
   */
  maxRansacNbIterations?: number;
  /**
   * Save images with matches for debugging.
   * @default false
   */
  debug?: boolean;
  /**
   * Path of the debug image.
   * @default `${__dirname}/montage.png`
   */
  debugImagePath?: string;
}

export interface AffineTransform {
  /**
   * Translation of source points along x and y axes.
   */
  translation: Point;
  /**
   * Clockwise angle in degrees.
   */
  rotation: number;
  /**
   * Scaling factor from source to destination.
   */
  scale: number;
}

export interface GetAffineTransformResult {
  /**
   * Affine transformation from source to destination.
   */
  transform: AffineTransform;
  /**
   * Number of matches of feature matching between source and destination.
   * The bigger this number is, the better.
   */
  nbMatches: number;
  /**
   * Number of inliers resulting from the ransac algorithm.
   */
  nbInliers: number;
  /**
   * Number of iterations of the RANSAC algorithm.
   */
  nbRansacIterations: number;
}

/**
 * Get the affine transformation from the source to the destination image.
 * @param source - Source image.
 * @param destination - Destination image.
 * @param options - Get destination translation options.
 * @returns The affine transformation from source to destination image.
 */
export function getAffineTransform(
  source: Image,
  destination: Image,
  options: GetAffineTransformOptions = {},
): GetAffineTransformResult {
  const {
    centroidPatchDiameter = 31,
    bestKeypointRadius = 5,
    crosscheck = true,
    destinationOrigin = { column: 0, row: 0 },
    maxScaleError = 0.1,
    maxAngleError = 5,
    checkLimits = false,
    maxRansacNbIterations,
    debug = false,
    debugImagePath = `${__dirname}/montage.png`,
  } = options;

  source = source.grey();
  destination = destination.grey();

  // fix images contrast
  const sourceExtremums = getMinMax(source);
  source.level({
    inputMin: sourceExtremums.min[0],
    inputMax: sourceExtremums.max[0],
    out: source,
  });
  const destinationExtremums = getMinMax(destination);
  destination.level({
    inputMin: destinationExtremums.min[0],
    inputMax: destinationExtremums.max[0],
    out: destination,
  });

  // compute briefs
  const sourceBrief = getBrief(source, {
    centroidPatchDiameter,
    bestKptRadius: bestKeypointRadius,
  });
  const destinationBrief = getBrief(destination, {
    centroidPatchDiameter,
    bestKptRadius: bestKeypointRadius,
  });

  // match reference and destination keypoints
  let matches: Match[] = [];
  if (crosscheck) {
    matches = getCrosscheckMatches(
      sourceBrief.descriptors,
      destinationBrief.descriptors,
    );
  } else {
    matches = bruteForceOneMatch(
      sourceBrief.descriptors,
      destinationBrief.descriptors,
    );

    matches = filterEuclideanDistance(
      matches,
      sourceBrief.keypoints,
      destinationBrief.keypoints,
      { origin: destinationOrigin },
    );
  }

  if (matches.length < 2) {
    throw new Error(
      'Insufficient number of matches found to compute affine transform (less than 2).',
    );
  }

  // create debug image
  if (debug) {
    const montage = new Montage(source, destination, {
      disposition: MontageDisposition.VERTICAL,
    });

    montage.drawMatches(
      matches,
      sourceBrief.keypoints,
      destinationBrief.keypoints,
      { showDistance: true },
    );

    const drawKeypointsBaseOptions = {
      fill: true,
      color: [0, 255, 0],
      showScore: true,
      markerSize: 3,
    };

    montage.drawKeypoints(sourceBrief.keypoints, drawKeypointsBaseOptions);
    montage.drawKeypoints(destinationBrief.keypoints, {
      origin: montage.destinationOrigin,
      ...drawKeypointsBaseOptions,
    });

    writeSync(debugImagePath, montage.image);
  }

  // extract source and destination points
  let sourcePoints: Point[] = [];
  let destinationPoints: Point[] = [];
  for (const match of matches) {
    sourcePoints.push(sourceBrief.keypoints[match.sourceIndex].origin);
    destinationPoints.push(
      destinationBrief.keypoints[match.destinationIndex].origin,
    );
  }

  // find inliers with ransac
  let nbInliers = sourcePoints.length;
  let nbRansacIterations = 0;
  if (sourcePoints.length > 2) {
    const ransacResult = ransac(sourcePoints, destinationPoints, {
      distanceFunction: getEuclideanDistance,
      modelFunction: createAffineTransformModel,
      fitFunction: affineFitFunction,
      maxNbIterations: maxRansacNbIterations,
    });
    nbRansacIterations = ransacResult.nbIterations;

    const inliers = ransacResult.inliers;
    nbInliers = inliers.length;

    sourcePoints = inliers.map((i) => sourcePoints[i]);
    destinationPoints = inliers.map((i) => destinationPoints[i]);
  }

  // compute affine transform from destination to reference
  const sourceMatrix = getMatrixFromPoints(sourcePoints);
  const destinationMatrix = getMatrixFromPoints(destinationPoints);
  const affineTransform = matrixGetAffineTransform(
    sourceMatrix,
    destinationMatrix,
  );

  if (checkLimits) {
    if (Math.abs(affineTransform.scale - 1) > maxScaleError) {
      throw new Error(
        `Source and destination scales are too different. Scaling factor is ${affineTransform.scale.toFixed(
          2,
        )}`,
      );
    }
    if (Math.abs(affineTransform.rotation - 1) > maxAngleError) {
      throw new Error(
        `Source and destination orientations are too different. Rotation is ${affineTransform.rotation.toFixed(
          2,
        )} degrees.`,
      );
    }
  }

  // compute crop origin in destination

  return {
    transform: {
      rotation: affineTransform.rotation,
      scale: affineTransform.scale,
      translation: {
        column: Math.round(affineTransform.translation.x),
        row: Math.round(affineTransform.translation.y),
      },
    },
    nbMatches: matches.length,
    nbInliers,
    nbRansacIterations,
  };
}