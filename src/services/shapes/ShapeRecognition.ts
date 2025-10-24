/**
 * Shape Recognition Service
 * Recognizes geometric shapes from hand-drawn strokes
 */

import {Point} from '@utils/bezier';
import {distance, angleBetweenPoints} from '@utils/math';

export enum RecognizedShape {
  Line = 'line',
  Circle = 'circle',
  Ellipse = 'ellipse',
  Rectangle = 'rectangle',
  Square = 'square',
  Triangle = 'triangle',
  Arrow = 'arrow',
  Star = 'star',
  None = 'none',
}

export interface ShapeResult {
  type: RecognizedShape;
  confidence: number;
  points: Point[];
  center?: Point;
  radius?: number;
  width?: number;
  height?: number;
}

export class ShapeRecognition {
  private readonly LINE_THRESHOLD = 0.95;
  private readonly CIRCLE_THRESHOLD = 0.85;
  private readonly RECTANGLE_THRESHOLD = 0.85;

  /**
   * Recognize shape from points
   */
  recognize(points: Point[]): ShapeResult {
    if (points.length < 10) {
      return {type: RecognizedShape.None, confidence: 0, points};
    }

    // Try to recognize different shapes
    const lineResult = this.recognizeLine(points);
    if (lineResult.confidence > this.LINE_THRESHOLD) {
      return lineResult;
    }

    const circleResult = this.recognizeCircle(points);
    if (circleResult.confidence > this.CIRCLE_THRESHOLD) {
      return circleResult;
    }

    const rectangleResult = this.recognizeRectangle(points);
    if (rectangleResult.confidence > this.RECTANGLE_THRESHOLD) {
      return rectangleResult;
    }

    const triangleResult = this.recognizeTriangle(points);
    if (triangleResult.confidence > 0.8) {
      return triangleResult;
    }

    return {type: RecognizedShape.None, confidence: 0, points};
  }

  /**
   * Recognize line
   */
  private recognizeLine(points: Point[]): ShapeResult {
    const start = points[0];
    const end = points[points.length - 1];

    // Calculate total distance along path
    let pathLength = 0;
    for (let i = 1; i < points.length; i++) {
      pathLength += distance(
        points[i - 1].x,
        points[i - 1].y,
        points[i].x,
        points[i].y,
      );
    }

    // Direct distance
    const directDistance = distance(start.x, start.y, end.x, end.y);

    // Confidence: how close path length is to direct distance
    const confidence = directDistance / pathLength;

    return {
      type: RecognizedShape.Line,
      confidence,
      points: [start, end],
    };
  }

  /**
   * Recognize circle
   */
  private recognizeCircle(points: Point[]): ShapeResult {
    // Find center (average of all points)
    const center = {
      x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
      y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
    };

    // Calculate distances from center
    const distances = points.map((p) =>
      distance(center.x, center.y, p.x, p.y),
    );

    // Average radius
    const avgRadius = distances.reduce((a, b) => a + b, 0) / distances.length;

    // Standard deviation of radii
    const variance =
      distances.reduce((sum, d) => sum + Math.pow(d - avgRadius, 2), 0) /
      distances.length;
    const stdDev = Math.sqrt(variance);

    // Confidence: low std dev means more circular
    const confidence = 1 - Math.min(stdDev / avgRadius, 1);

    // Generate perfect circle points
    const circlePoints: Point[] = [];
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      circlePoints.push({
        x: center.x + Math.cos(angle) * avgRadius,
        y: center.y + Math.sin(angle) * avgRadius,
      });
    }

    return {
      type: RecognizedShape.Circle,
      confidence,
      points: circlePoints,
      center,
      radius: avgRadius,
    };
  }

  /**
   * Recognize rectangle
   */
  private recognizeRectangle(points: Point[]): ShapeResult {
    // Find bounding box
    const minX = Math.min(...points.map((p) => p.x));
    const maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxY = Math.max(...points.map((p) => p.y));

    const width = maxX - minX;
    const height = maxY - minY;

    // Check if points are close to rectangle perimeter
    const rectanglePoints = [
      {x: minX, y: minY},
      {x: maxX, y: minY},
      {x: maxX, y: maxY},
      {x: minX, y: maxY},
      {x: minX, y: minY},
    ];

    // Calculate how well points fit rectangle
    let totalDistance = 0;
    for (const point of points) {
      const distToRect = Math.min(
        Math.abs(point.x - minX),
        Math.abs(point.x - maxX),
        Math.abs(point.y - minY),
        Math.abs(point.y - maxY),
      );
      totalDistance += distToRect;
    }

    const avgDistance = totalDistance / points.length;
    const confidence = 1 - Math.min(avgDistance / Math.max(width, height), 1);

    // Determine if it's a square
    const aspectRatio = Math.min(width, height) / Math.max(width, height);
    const isSquare = aspectRatio > 0.9;

    return {
      type: isSquare ? RecognizedShape.Square : RecognizedShape.Rectangle,
      confidence,
      points: rectanglePoints,
      width,
      height,
    };
  }

  /**
   * Recognize triangle
   */
  private recognizeTriangle(points: Point[]): ShapeResult {
    if (points.length < 15) {
      return {type: RecognizedShape.None, confidence: 0, points};
    }

    // Find 3 corners using curvature
    const corners = this.findCorners(points, 3);

    if (corners.length !== 3) {
      return {type: RecognizedShape.None, confidence: 0, points};
    }

    // Create triangle from corners
    const trianglePoints = [...corners, corners[0]];

    // Calculate confidence based on how close points are to triangle edges
    let totalDistance = 0;
    for (const point of points) {
      const distToEdge = this.distanceToPolygon(point, corners);
      totalDistance += distToEdge;
    }

    const avgDistance = totalDistance / points.length;
    const size = Math.max(
      ...corners.map((c1) =>
        Math.max(
          ...corners.map((c2) => distance(c1.x, c1.y, c2.x, c2.y)),
        ),
      ),
    );

    const confidence = 1 - Math.min(avgDistance / (size * 0.1), 1);

    return {
      type: RecognizedShape.Triangle,
      confidence,
      points: trianglePoints,
    };
  }

  /**
   * Find corners in stroke using curvature
   */
  private findCorners(points: Point[], expectedCount: number): Point[] {
    const curvatures: number[] = [];

    // Calculate curvature at each point
    for (let i = 2; i < points.length - 2; i++) {
      const p1 = points[i - 2];
      const p2 = points[i];
      const p3 = points[i + 2];

      const angle1 = angleBetweenPoints(p1.x, p1.y, p2.x, p2.y);
      const angle2 = angleBetweenPoints(p2.x, p2.y, p3.x, p3.y);

      let angleDiff = Math.abs(angle2 - angle1);
      if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

      curvatures.push(angleDiff);
    }

    // Find peaks in curvature
    const peaks: {index: number; value: number}[] = [];
    for (let i = 1; i < curvatures.length - 1; i++) {
      if (
        curvatures[i] > curvatures[i - 1] &&
        curvatures[i] > curvatures[i + 1]
      ) {
        peaks.push({index: i + 2, value: curvatures[i]});
      }
    }

    // Sort by curvature value and take top N
    peaks.sort((a, b) => b.value - a.value);
    const topPeaks = peaks.slice(0, expectedCount);

    // Sort by index to maintain order
    topPeaks.sort((a, b) => a.index - b.index);

    return topPeaks.map((peak) => points[peak.index]);
  }

  /**
   * Calculate distance from point to polygon
   */
  private distanceToPolygon(point: Point, polygon: Point[]): number {
    let minDist = Infinity;

    for (let i = 0; i < polygon.length; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % polygon.length];

      const dist = this.distanceToSegment(point, p1, p2);
      minDist = Math.min(minDist, dist);
    }

    return minDist;
  }

  /**
   * Calculate distance from point to line segment
   */
  private distanceToSegment(p: Point, a: Point, b: Point): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
      return distance(p.x, p.y, a.x, a.y);
    }

    const t = Math.max(
      0,
      Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared),
    );

    const projX = a.x + t * dx;
    const projY = a.y + t * dy;

    return distance(p.x, p.y, projX, projY);
  }
}
