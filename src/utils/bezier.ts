/**
 * Bezier Curve Utilities
 * For stroke smoothing using Catmull-Rom splines
 */

export interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp?: number;
}

/**
 * Calculate Catmull-Rom spline control points
 */
export const catmullRomToQuadratic = (
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  tension: number = 0.5,
): {cp1: Point; cp2: Point} => {
  'worklet';
  const t = tension;

  // Calculate control points for quadratic Bezier
  const cp1x = p1.x + ((p2.x - p0.x) * t) / 6;
  const cp1y = p1.y + ((p2.y - p0.y) * t) / 6;

  const cp2x = p2.x - ((p3.x - p1.x) * t) / 6;
  const cp2y = p2.y - ((p3.y - p1.y) * t) / 6;

  return {
    cp1: {x: cp1x, y: cp1y},
    cp2: {x: cp2x, y: cp2y},
  };
};

/**
 * Smooth path points using Catmull-Rom spline
 */
export const smoothPath = (points: Point[], tension: number = 0.5): Point[] => {
  'worklet';
  if (points.length < 3) {
    return points;
  }

  const smoothed: Point[] = [points[0]]; // Start with first point

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const {cp1, cp2} = catmullRomToQuadratic(p0, p1, p2, p3, tension);

    // Generate intermediate points along the curve
    const steps = 5;
    for (let t = 0; t <= 1; t += 1 / steps) {
      const x = quadraticBezier(p1.x, cp1.x, p2.x, t);
      const y = quadraticBezier(p1.y, cp1.y, p2.y, t);
      smoothed.push({x, y});
    }
  }

  smoothed.push(points[points.length - 1]); // End with last point

  return smoothed;
};

/**
 * Calculate point on quadratic Bezier curve
 */
const quadraticBezier = (p0: number, p1: number, p2: number, t: number): number => {
  'worklet';
  return Math.pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
};

/**
 * Decimate points - remove points that are too close together
 */
export const decimatePoints = (points: Point[], minDistance: number = 1): Point[] => {
  'worklet';
  if (points.length < 2) {
    return points;
  }

  const decimated: Point[] = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    const dx = point.x - lastPoint.x;
    const dy = point.y - lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= minDistance) {
      decimated.push(point);
      lastPoint = point;
    }
  }

  // Always include last point
  if (decimated[decimated.length - 1] !== points[points.length - 1]) {
    decimated.push(points[points.length - 1]);
  }

  return decimated;
};
