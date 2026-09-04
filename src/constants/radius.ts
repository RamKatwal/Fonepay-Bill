/**
 * Radius scale — Fonepay geometry: soft 16px cards, 12–14px actions, pills for chips.
 */
export const radius = {
  none: 0,
  small: 8, // badges, small tags, inner fields
  medium: 12, // inputs, inner containers
  large: 14, // buttons
  card: 16, // cards, surface containers, sheets
  pill: 9999, // chips, full-rounded badges
} as const;

export type RadiusTokens = typeof radius;

export const Radius = radius;
