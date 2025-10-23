/**
 * Animation Constants
 * Based on section 6 - Animation Framework
 */

// Spring configurations for different animation types
export const SpringConfigs = {
  // Snappy, quick animations for buttons
  snappy: {
    damping: 15,
    stiffness: 400,
  },
  // Smooth, natural animations for navigation
  smooth: {
    damping: 20,
    stiffness: 300,
  },
  // Bouncy animations for playful interactions
  bouncy: {
    damping: 18,
    stiffness: 350,
  },
  // Gentle animations for bottom sheets
  gentle: {
    damping: 25,
    stiffness: 300,
  },
  // Fluid animations for page turns
  fluid: {
    damping: 22,
    stiffness: 280,
  },
};

// Duration constants (in milliseconds)
export const Durations = {
  instant: 0,
  fast: 150,
  normal: 200,
  medium: 300,
  slow: 400,
  verySlow: 600,
};

// Easing curves
export const Easing = {
  // Custom bezier curve for iOS-like feel
  ios: [0.4, 0.0, 0.2, 1] as const,
  // Ease out
  easeOut: [0.0, 0.0, 0.2, 1] as const,
  // Ease in
  easeIn: [0.4, 0.0, 1, 1] as const,
  // Linear
  linear: [0.0, 0.0, 1, 1] as const,
};

// Frame targets
export const FrameRates = {
  standard: 60,
  proMotion: 120,
};

// Gesture thresholds
export const GestureThresholds = {
  // Minimum velocity for completing gesture (pt/s)
  velocityThreshold: 300,
  // High velocity threshold for fast gestures
  highVelocity: 800,
  // Edge swipe detection zone (pt from edge)
  edgeSwipeZone: 20,
  // Minimum drag distance to trigger action
  minimumDrag: 50,
  // Swipe action reveal distances
  swipeActionFirst: 40,
  swipeActionSecond: 80,
  swipeActionThird: 120,
  swipeActionFull: 180,
};

// Long press duration
export const LongPressDuration = 500;

// Haptic patterns
export const HapticTypes = {
  light: 'impactLight',
  medium: 'impactMedium',
  heavy: 'impactHeavy',
  success: 'notificationSuccess',
  warning: 'notificationWarning',
  error: 'notificationError',
  selection: 'selection',
} as const;

export type HapticType = (typeof HapticTypes)[keyof typeof HapticTypes];
