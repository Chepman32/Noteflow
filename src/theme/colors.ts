/**
 * NoteFlow Color System
 * Based on design specification section 4.2
 */

export const LightColors = {
  // Primary Theme
  primary: '#2E5BFF',
  secondary: '#FF6B6B',
  accent: '#00D4AA',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceSecondary: '#FFFFFF',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',

  // Borders
  border: '#E5E7EB',

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const DarkColors = {
  // Primary Theme (adjusted for dark mode)
  primary: '#4B7BFF',
  secondary: '#FF8585',
  accent: '#00E5B8',

  // Backgrounds (OLED optimized)
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',

  // Borders
  border: '#374151',

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export type ColorTheme = typeof LightColors;

// Ink colors for drawing tools (300+ colors organized by category)
export const InkColors = {
  basics: [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
  ],
  grays: [
    '#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080',
    '#999999', '#B3B3B3', '#CCCCCC', '#E6E6E6', '#F5F5F5',
  ],
  reds: [
    '#8B0000', '#B22222', '#DC143C', '#FF0000', '#FF6347',
    '#FF7F50', '#FFA07A', '#FFB6C1', '#FFC0CB', '#FFE4E1',
  ],
  oranges: [
    '#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFB347',
    '#FFC125', '#FFD700', '#FFDAB9', '#FFE4B5', '#FFEFD5',
  ],
  yellows: [
    '#B8860B', '#DAA520', '#EEE8AA', '#F0E68C', '#FFFF00',
    '#FFFFE0', '#FFFACD', '#FFF8DC', '#FFFAF0', '#FFFFFА',
  ],
  greens: [
    '#006400', '#008000', '#228B22', '#32CD32', '#00FF00',
    '#7FFF00', '#7CFC00', '#ADFF2F', '#90EE90', '#98FB98',
  ],
  blues: [
    '#00008B', '#0000CD', '#0000FF', '#1E90FF', '#00BFFF',
    '#87CEEB', '#87CEFA', '#ADD8E6', '#B0E0E6', '#E0FFFF',
  ],
  purples: [
    '#4B0082', '#483D8B', '#6A5ACD', '#7B68EE', '#9370DB',
    '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#DDA0DD',
  ],
  pinks: [
    '#C71585', '#DB7093', '#FF1493', '#FF69B4', '#FFB6C1',
    '#FFC0CB', '#FFE4E1', '#FFF0F5', '#FAEBD7', '#FAF0E6',
  ],
  browns: [
    '#8B4513', '#A0522D', '#B8860B', '#CD853F', '#D2691E',
    '#DEB887', '#F4A460', '#D2B48C', '#BC8F8F', '#FFE4C4',
  ],
};

// Flatten all colors for easy access
export const AllInkColors = [
  ...InkColors.basics,
  ...InkColors.grays,
  ...InkColors.reds,
  ...InkColors.oranges,
  ...InkColors.yellows,
  ...InkColors.greens,
  ...InkColors.blues,
  ...InkColors.purples,
  ...InkColors.pinks,
  ...InkColors.browns,
];
