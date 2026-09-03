import { ViewStyle, Platform } from 'react-native';

/**
 * Fonepay Shadow and Elevation System
 * Subtle elevation and borders preferred over heavy shadows
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } satisfies ViewStyle,

  // Very subtle elevation for resting cards
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.04 : 0.08,
    shadowRadius: 3,
    elevation: 1,
  } satisfies ViewStyle,

  // Standard card elevation
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.06 : 0.12,
    shadowRadius: 8,
    elevation: 2,
  } satisfies ViewStyle,

  // Floating modals, elevated bottom sheets
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.16,
    shadowRadius: 16,
    elevation: 4,
  } satisfies ViewStyle,

  // Sticky bottom action bar shadow
  bottomBar: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.1,
    shadowRadius: 8,
    elevation: 4,
  } satisfies ViewStyle,

  // Primary brand CTA glow
  primaryGlow: {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.35,
    shadowRadius: 10,
    elevation: 5,
  } satisfies ViewStyle,
} as const;

export type ShadowTokens = typeof shadows;

export const Shadows = shadows;
