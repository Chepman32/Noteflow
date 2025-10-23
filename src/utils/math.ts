/**
 * Math Utilities
 */

export const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start: number, end: number, t: number): number => {
  'worklet';
  return start + (end - start) * t;
};

export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  'worklet';
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const angleBetweenPoints = (x1: number, y1: number, x2: number, y2: number): number => {
  'worklet';
  return Math.atan2(y2 - y1, x2 - x1);
};

export const degreesToRadians = (degrees: number): number => {
  'worklet';
  return degrees * (Math.PI / 180);
};

export const radiansToDegrees = (radians: number): number => {
  'worklet';
  return radians * (180 / Math.PI);
};

export const normalizeAngle = (angle: number): number => {
  'worklet';
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
};

// Check if angle is near a snap angle (within threshold)
export const isNearSnapAngle = (
  angle: number,
  snapAngles: number[],
  threshold: number,
): {isNear: boolean; snapAngle?: number} => {
  'worklet';
  const normalized = normalizeAngle(angle);
  for (const snapAngle of snapAngles) {
    const diff = Math.abs(normalized - snapAngle);
    if (diff <= threshold || diff >= 360 - threshold) {
      return {isNear: true, snapAngle};
    }
  }
  return {isNear: false};
};
