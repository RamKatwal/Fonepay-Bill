import { ViewStyle, Platform } from 'react-native';

/**
 * Elevation — Airbnb is near-flat. Resting surfaces use a hairline border, not a
 * shadow. Shadows are reserved for genuinely floating content (modals, sheets).
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } satisfies ViewStyle,

  // Barely-there lift for a resting card that can't use a border.
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.03 : 0.06,
    shadowRadius: 3,
    elevation: 1,
  } satisfies ViewStyle,

  // Soft card elevation.
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.06 : 0.1,
    shadowRadius: 8,
    elevation: 2,
  } satisfies ViewStyle,

  // Floating modals / bottom sheets — soft, wide.
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.2,
    shadowRadius: 24,
    elevation: 8,
  } satisfies ViewStyle,

  // Sticky bottom action bar — faint upward shadow (pair with a hairline border).
  bottomBar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.04 : 0.08,
    shadowRadius: 8,
    elevation: 4,
  } satisfies ViewStyle,
} as const;

export type ShadowTokens = typeof shadows;

export const Shadows = shadows;
