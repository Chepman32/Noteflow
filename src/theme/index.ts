/**
 * NoteFlow Theme System
 * Exports all theme-related modules
 */

import {LightColors, DarkColors, InkColors, AllInkColors} from './colors';
import {Typography, FontFamilies} from './typography';
import {Spacing} from './spacing';

export {LightColors, DarkColors, InkColors, AllInkColors, Typography, FontFamilies, Spacing};

// Theme configuration
export const Theme = {
  light: {
    colors: LightColors,
    typography: Typography,
    spacing: Spacing,
    fonts: FontFamilies,
  },
  dark: {
    colors: DarkColors,
    typography: Typography,
    spacing: Spacing,
    fonts: FontFamilies,
  },
};

export type ThemeMode = 'light' | 'dark';
export type AppTheme = typeof Theme.light;
