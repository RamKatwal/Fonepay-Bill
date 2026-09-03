/**
 * Fonepay Semantic Radius System
 * Soft, modern geometry for CTAs, cards, inputs, and chips
 */
export const radius = {
  none: 0,
  small: 6, // Badges, small tags, sub-elements
  medium: 10, // Inputs, chips, inner containers
  large: 14, // Buttons, standard action targets
  card: 18, // Cards, surface containers
  pill: 9999, // Primary pill CTAs, full rounded badges
} as const;

export type RadiusTokens = typeof radius;

export const Radius = radius;
