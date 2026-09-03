/**
 * Fonepay Digital Bill Generator - Semantic Color System
 * Original Fonepay visual identity (Crimson/Nepal Red, Deep Slate, Clean Card Surfaces)
 */

export const colors = {
  brand: {
    primary: '#DC2626', // Classic Fonepay Red
    primaryDark: '#B91C1C',
    primaryLight: '#EF4444',
    secondary: '#0F172A', // Slate 900
    subtle: '#FEE2E2',
    muted: '#FEF2F2',
  },

  background: {
    canvas: '#F8FAFC', // Slate 50 screen background
    surface: '#FFFFFF', // Card and container surface
    elevated: '#FFFFFF', // Modals and elevated sheets
    subtle: '#F1F5F9', // Slate 100 secondary backgrounds
  },

  text: {
    primary: '#0F172A', // Main headings and primary reading
    secondary: '#475569', // Subheadings and supporting labels
    muted: '#94A3B8', // Placeholder, timestamps, and subtle hints
    inverse: '#FFFFFF', // Contrast text on dark/brand backgrounds
    brand: '#DC2626', // Brand accent links and values
  },

  border: {
    default: '#E2E8F0', // Card and input borders
    subtle: '#F1F5F9', // Dividers and subtle separators
    strong: '#CBD5E1', // High-contrast structural boundaries
  },

  status: {
    success: '#16A34A', // Paid / Verified green
    successBackground: '#DCFCE7',
    warning: '#D97706', // Warning amber
    warningBackground: '#FEF3C7',
    error: '#DC2626', // Failed / Error red
    errorBackground: '#FEE2E2',
    pending: '#D97706', // Payment pending
    pendingBackground: '#FEF3C7',
    paid: '#16A34A',
    paidBackground: '#DCFCE7',
    failed: '#DC2626',
    failedBackground: '#FEE2E2',
  },

  payment: {
    cash: '#0284C7', // Sky 600
    cashBackground: '#E0F2FE', // Sky 100
    cashText: '#0369A1',
    fonepay: '#DC2626', // Crimson 600
    fonepayBackground: '#FEE2E2', // Crimson 100
    fonepayText: '#B91C1C',
  },
} as const;

export type ColorTokens = typeof colors;

/**
 * Backward compatibility alias for existing code
 */
export const Colors = {
  primary: colors.brand.primary,
  primaryDark: colors.brand.primaryDark,
  primaryLight: colors.brand.primaryLight,
  primarySubtle: colors.brand.subtle,
  primaryMuted: colors.brand.muted,

  secondary: colors.brand.secondary,
  accent: '#E11D48',

  background: colors.background.canvas,
  surface: colors.background.surface,
  surfaceSubtle: colors.background.subtle,
  surfaceSelected: '#E2E8F0',

  text: colors.text.primary,
  textSecondary: colors.text.secondary,
  textMuted: colors.text.muted,
  textInverse: colors.text.inverse,
  textPrimary: colors.text.brand,

  border: colors.border.default,
  borderSubtle: colors.border.subtle,
  borderDark: colors.border.strong,

  success: colors.status.success,
  successSubtle: colors.status.successBackground,
  successText: '#15803D',

  pending: colors.status.pending,
  pendingSubtle: colors.status.pendingBackground,
  pendingText: '#B45309',

  failed: colors.status.failed,
  failedSubtle: colors.status.failedBackground,
  failedText: colors.payment.fonepayText,

  cash: colors.payment.cash,
  cashSubtle: colors.payment.cashBackground,
  cashText: colors.payment.cashText,

  fonepay: colors.payment.fonepay,
  fonepaySubtle: colors.payment.fonepayBackground,
  fonepayText: colors.payment.fonepayText,

  overlay: 'rgba(15, 23, 42, 0.45)',
  cardShadow: '#0000000D',
} as const;
