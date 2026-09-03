import { TextStyle, Platform } from 'react-native';

const monoFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  web: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  default: 'monospace',
});

/**
 * Named Typography Styles adhering to fintech visual hierarchy
 */
export const typography = {
  // High-impact hero numbers / welcome
  display: {
    fontSize: 32,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 40,
    letterSpacing: -0.5,
  } satisfies TextStyle,

  // Screen header title
  screenTitle: {
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 28,
    letterSpacing: -0.3,
  } satisfies TextStyle,

  // Section headers (e.g., "Recent Sales", "Bill Items")
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 22,
    letterSpacing: -0.2,
  } satisfies TextStyle,

  // Card headers (e.g. "Everest Café", "Payment Method")
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22,
  } satisfies TextStyle,

  // Standard reading text
  body: {
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22,
  } satisfies TextStyle,

  // Emphasized body text
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 20,
  } satisfies TextStyle,

  // Compact body / description
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  } satisfies TextStyle,

  // Timestamps, helper hints
  caption: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16,
  } satisfies TextStyle,

  // Form field labels & uppercase tags
  label: {
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  // Button CTAs
  button: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22,
    letterSpacing: 0.2,
  } satisfies TextStyle,

  // Prominent financial monetary values
  amount: {
    fontSize: 20,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 26,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  } satisfies TextStyle,

  // Large financial total (e.g. preview / payment)
  amountLarge: {
    fontSize: 30,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 36,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  } satisfies TextStyle,

  // Invoice numbers and transaction references
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 20,
    fontFamily: monoFont,
    letterSpacing: 0.2,
  } satisfies TextStyle,
} as const;

export type TypographyNamedStyles = typeof typography;

/**
 * Backward-compatible scale
 */
export const Typography = {
  ...typography,

  // Font Sizes
  size: {
    xxs: 11,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 28,
    display: 34,
  },

  // Font Weights
  weight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    heavy: '800' as TextStyle['fontWeight'],
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;
