/**
 * Drawing Engine Constants
 * Based on section 7.1 - Drawing Engine
 */

// Pen tool types
export enum PenTool {
  Ballpoint = 'ballpoint',
  Fountain = 'fountain',
  Marker = 'marker',
  Highlighter = 'highlighter',
  Pencil = 'pencil',
  Eraser = 'eraser',
}

// Pen tool configurations
export const PenToolConfigs = {
  [PenTool.Ballpoint]: {
    minWidth: 0.5,
    maxWidth: 8,
    pressureResponse: 0.5, // Moderate pressure response (50% variation)
    defaultColor: '#2E5BFF',
    defaultWidth: 2,
    opacity: 1.0,
    style: 'smooth',
  },
  [PenTool.Fountain]: {
    minWidth: 1,
    maxWidth: 12,
    pressureResponse: 0.7, // High pressure response (70% variation)
    defaultColor: '#000000',
    defaultWidth: 3,
    opacity: 1.0,
    style: 'elegant',
    tiltSupport: true,
  },
  [PenTool.Marker]: {
    minWidth: 2,
    maxWidth: 20,
    pressureResponse: 0.2, // Low pressure response (20% variation)
    defaultColor: '#000000',
    defaultWidth: 8,
    opacity: 1.0,
    style: 'bold',
  },
  [PenTool.Highlighter]: {
    minWidth: 8,
    maxWidth: 40,
    pressureResponse: 0.1,
    defaultColor: '#FFEB3B',
    defaultWidth: 20,
    opacity: 0.4,
    style: 'wide',
    blendMode: 'multiply',
    layer: 'background',
  },
  [PenTool.Pencil]: {
    minWidth: 0.5,
    maxWidth: 6,
    pressureResponse: 0.8, // Very high pressure response (80% variation)
    defaultColor: '#757575',
    defaultWidth: 1.5,
    opacity: 0.9,
    style: 'textured',
    texture: true,
  },
};

// Eraser modes
export enum EraserMode {
  Stroke = 'stroke', // Removes entire stroke on contact
  Pixel = 'pixel', // Erases only touched pixels
}

// Shape recognition types
export enum ShapeType {
  Line = 'line',
  Circle = 'circle',
  Ellipse = 'ellipse',
  Rectangle = 'rectangle',
  Square = 'square',
  Triangle = 'triangle',
  Arrow = 'arrow',
  Star = 'star',
}

// Stroke smoothing parameters
export const SmoothingConfig = {
  tension: 0.5, // Catmull-Rom spline tension (0.0 = no smoothing, 1.0 = maximum)
  minPointDistance: 1, // Minimum distance between points (pt)
  decimation: true, // Enable point decimation
};

// Canvas limits
export const CanvasConfig = {
  minZoom: 0.5,
  maxZoom: 4.0,
  defaultZoom: 1.0,
  snapZoomLevels: [1.0, 2.0, 3.0], // Zoom levels with snap resistance
  snapThreshold: 0.1, // Threshold for snap (10%)
};

// Viewport culling
export const ViewportConfig = {
  cullingMargin: 0.2, // 20% margin around viewport
  dirtyRegionTracking: true,
};

// Sampling rates (Hz)
export const SamplingRates = {
  proMotion: 120,
  standard: 60,
};

// Pressure curve types
export enum PressureCurve {
  Linear = 'linear',
  Logarithmic = 'logarithmic',
  Exponential = 'exponential',
}

// Palm rejection sensitivity levels
export enum PalmRejectionSensitivity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

// Palm rejection thresholds
export const PalmRejectionConfig = {
  [PalmRejectionSensitivity.Low]: {
    minTouchArea: 300,
    confidenceThreshold: 0.3,
  },
  [PalmRejectionSensitivity.Medium]: {
    minTouchArea: 200,
    confidenceThreshold: 0.5,
  },
  [PalmRejectionSensitivity.High]: {
    minTouchArea: 150,
    confidenceThreshold: 0.7,
  },
};
