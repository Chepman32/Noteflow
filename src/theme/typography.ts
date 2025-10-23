/**
 * NoteFlow Typography System
 * Based on design specification section 4.3
 */

import {Platform} from 'react-native';

// SF Pro is the system font on iOS
const fontFamily = Platform.select({
  ios: 'SF Pro',
  default: 'System',
});

const fontFamilyRounded = Platform.select({
  ios: 'SF Pro Rounded',
  default: 'System',
});

const fontFamilyMono = Platform.select({
  ios: 'SF Mono',
  default: 'monospace',
});

export const Typography = {
  displayLarge: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 41,
  },
  displayMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  headline: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  title: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.15,
    lineHeight: 25,
  },
  bodyLarge: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.08,
    lineHeight: 20,
  },
  captionLarge: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 18,
  },
  caption: {
    fontFamily,
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.06,
    lineHeight: 13,
  },
  overline: {
    fontFamily,
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    lineHeight: 13,
    textTransform: 'uppercase' as const,
  },
};

export const FontFamilies = {
  primary: fontFamily,
  rounded: fontFamilyRounded,
  mono: fontFamilyMono,
};

export type TypographyVariant = keyof typeof Typography;
