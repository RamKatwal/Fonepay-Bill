import { Easing } from 'react-native';

/**
 * Fonepay Motion Principles & Timing Tokens
 * Subtle, fast, purposeful, reassuring (150 - 400ms)
 */
export const motion = {
  // Duration tokens
  duration: {
    instant: 100, // Micro state flips
    fast: 150, // Button press response, chip select
    normal: 250, // Sheet slide, card focus, list update
    slow: 350, // Screen transition, status confirmation
    relaxed: 400, // Success completion, celebration
  },

  // Interactive press scales (restrained feedback)
  scale: {
    pressed: 0.98, // Standard button/card press scale
    chipPressed: 0.96, // Smaller touch element press scale
    activeTab: 1.0,
  },

  // Standard easing curves
  easing: {
    standard: Easing.bezier(0.2, 0.0, 0, 1.0),
    accelerate: Easing.bezier(0.3, 0.0, 0.8, 0.15),
    decelerate: Easing.bezier(0.05, 0.7, 0.1, 1.0),
    sharp: Easing.bezier(0.4, 0.0, 0.6, 1.0),
  },
} as const;

export type MotionTokens = typeof motion;

export const Motion = motion;
