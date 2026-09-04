/**
 * @deprecated Prefer `useTheme()` / `makeStyles` from `@/theme` so components
 * react to light/dark. This module is a static shim that always resolves to the
 * LIGHT palette, kept so any not-yet-migrated call site still compiles and
 * renders correctly in light mode.
 */
import { lightPalette, type Palette } from '@/theme/palette';

// Nested shape (old `colors`)
export const colors = lightPalette;

// Flat shape (old `Colors`)
export const Colors = {
  primary: lightPalette.brand.primary,
  primaryDark: lightPalette.brand.primaryPressed,
  primaryLight: lightPalette.brand.primaryLight,
  primarySubtle: lightPalette.brand.subtle,
  primaryMuted: lightPalette.brand.muted,
  secondary: lightPalette.brand.secondary,
  accent: lightPalette.brand.primary,

  background: lightPalette.background.canvas,
  surface: lightPalette.background.surface,
  surfaceSubtle: lightPalette.background.subtle,
  surfaceSelected: lightPalette.background.selected,

  text: lightPalette.text.primary,
  textSecondary: lightPalette.text.secondary,
  textMuted: lightPalette.text.muted,
  textInverse: lightPalette.text.inverse,
  textPrimary: lightPalette.text.brand,

  border: lightPalette.border.default,
  borderSubtle: lightPalette.border.subtle,
  borderDark: lightPalette.border.strong,

  success: lightPalette.status.success,
  successSubtle: lightPalette.status.successBackground,
  successText: lightPalette.status.success,

  pending: lightPalette.status.pending,
  pendingSubtle: lightPalette.status.pendingBackground,
  pendingText: lightPalette.status.pending,

  failed: lightPalette.status.failed,
  failedSubtle: lightPalette.status.failedBackground,
  failedText: lightPalette.status.failed,

  cash: lightPalette.payment.cash,
  cashSubtle: lightPalette.payment.cashBackground,
  cashText: lightPalette.payment.cashText,

  fonepay: lightPalette.payment.fonepay,
  fonepaySubtle: lightPalette.payment.fonepayBackground,
  fonepayText: lightPalette.payment.fonepayText,

  overlay: lightPalette.overlay,
  cardShadow: lightPalette.cardShadow,
} as const;

export type ColorTokens = Palette;
