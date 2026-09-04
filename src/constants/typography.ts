import { TextStyle } from 'react-native';
import { jakarta, plexMono } from '@/theme/fonts';

/**
 * Fonepay type scale — Plus Jakarta Sans (the documented Cereal substitute),
 * IBM Plex Mono for invoice numbers and transaction IDs. Weights are carried by
 * the font family itself (custom fonts don't synthesise weight on native), so
 * every named style sets an explicit `fontFamily`.
 */
export const typography = {
  // Hero numbers / welcome
  display: {
    fontFamily: jakarta(800),
    fontSize: 32,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 38,
    letterSpacing: -0.8,
  } satisfies TextStyle,

  // Screen header title
  screenTitle: {
    fontFamily: jakarta(800),
    fontSize: 22,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 28,
    letterSpacing: -0.4,
  } satisfies TextStyle,

  // Section headers ("Recent bills", "Items")
  sectionTitle: {
    fontFamily: jakarta(700),
    fontSize: 15,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: -0.1,
  } satisfies TextStyle,

  // Card headers
  cardTitle: {
    fontFamily: jakarta(700),
    fontSize: 15,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 20,
  } satisfies TextStyle,

  // Standard reading text
  body: {
    fontFamily: jakarta(400),
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 21,
  } satisfies TextStyle,

  // Emphasised body text
  bodyMedium: {
    fontFamily: jakarta(500),
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 20,
  } satisfies TextStyle,

  // Compact body / description
  bodySmall: {
    fontFamily: jakarta(400),
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  } satisfies TextStyle,

  // Timestamps, helper hints
  caption: {
    fontFamily: jakarta(400),
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16,
  } satisfies TextStyle,

  // Form field labels & small tags
  label: {
    fontFamily: jakarta(600),
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 16,
    letterSpacing: 0.2,
  } satisfies TextStyle,

  // Button CTAs
  button: {
    fontFamily: jakarta(700),
    fontSize: 15,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0.1,
  } satisfies TextStyle,

  // Prominent monetary values
  amount: {
    fontFamily: jakarta(700),
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  } satisfies TextStyle,

  // Large financial total (preview / payment)
  amountLarge: {
    fontFamily: jakarta(800),
    fontSize: 28,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 34,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.6,
  } satisfies TextStyle,

  // Invoice numbers and transaction references
  invoiceNumber: {
    fontFamily: plexMono(true),
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 16,
    letterSpacing: 0.2,
  } satisfies TextStyle,
} as const;

export type TypographyNamedStyles = typeof typography;

/**
 * Backwards-compatible scale.
 */
export const Typography = {
  ...typography,

  family: {
    sans: jakarta(400),
    sansMedium: jakarta(500),
    sansSemibold: jakarta(600),
    sansBold: jakarta(700),
    sansHeavy: jakarta(800),
    mono: plexMono(false),
    monoMedium: plexMono(true),
  },

  size: {
    xxs: 11,
    xs: 12,
    sm: 14,
    base: 15,
    md: 17,
    lg: 20,
    xl: 22,
    xxl: 26,
    display: 32,
  },

  weight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    heavy: '800' as TextStyle['fontWeight'],
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;
