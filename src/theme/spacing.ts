/**
 * NoteFlow Spacing System
 * Based on 4pt base grid system (section 4.4)
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
};

export type SpacingKey = keyof typeof Spacing;
