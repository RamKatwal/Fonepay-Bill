/**
 * Airbnb-inspired design tokens.
 *
 * Accent (Coral) is used sparingly — primary CTAs, selected states, and links
 * only. Everything else is grayscale. Light and dark share an identical shape
 * so components stay theme-agnostic (`useTheme()` + `makeStyles`).
 */

export interface Palette {
  brand: {
    primary: string;
    primaryPressed: string;
    primaryLight: string;
    secondary: string; // Ink
    subtle: string;
    muted: string;
  };
  background: {
    canvas: string;
    surface: string;
    elevated: string;
    subtle: string;
    selected: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    brand: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
  };
  status: {
    success: string;
    successBackground: string;
    error: string;
    errorBackground: string;
    warning: string;
    warningBackground: string;
    pending: string;
    pendingBackground: string;
    paid: string;
    paidBackground: string;
    failed: string;
    failedBackground: string;
  };
  payment: {
    cash: string;
    cashBackground: string;
    cashText: string;
    fonepay: string;
    fonepayBackground: string;
    fonepayText: string;
  };
  overlay: string;
  cardShadow: string;
}

/* ------------------------------------------------------------------ */
/* Light                                                              */
/* ------------------------------------------------------------------ */

export const lightPalette: Palette = {
  brand: {
    primary: '#C8102E', // Fonepay deep red
    primaryPressed: '#A50D25',
    primaryLight: '#E4344F',
    secondary: '#222222',
    subtle: '#FCEEF0',
    muted: '#FEF5F6',
  },
  background: {
    canvas: '#FFFFFF',
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
    subtle: '#F7F7F7',
    selected: '#F0F0F0',
  },
  text: {
    primary: '#222222',
    secondary: '#767676',
    muted: '#B0B0B0',
    inverse: '#FFFFFF',
    brand: '#C8102E',
  },
  border: {
    default: '#EBEBEB',
    subtle: '#F0F0F0',
    strong: '#222222',
  },
  status: {
    success: '#0B7A3E',
    successBackground: '#E8F5EE',
    error: '#C13515',
    errorBackground: '#FBEAE5',
    warning: '#B26A00',
    warningBackground: '#FFF6E5',
    pending: '#B26A00',
    pendingBackground: '#FFF6E5',
    paid: '#0B7A3E',
    paidBackground: '#E8F5EE',
    failed: '#C13515',
    failedBackground: '#FBEAE5',
  },
  payment: {
    // Channel colour-coding intentionally dropped — both neutral.
    cash: '#767676',
    cashBackground: '#F7F7F7',
    cashText: '#484848',
    fonepay: '#767676',
    fonepayBackground: '#F7F7F7',
    fonepayText: '#484848',
  },
  overlay: 'rgba(0, 0, 0, 0.45)',
  cardShadow: 'rgba(0, 0, 0, 0.08)',
};

/* ------------------------------------------------------------------ */
/* Dark (warm — preserves photography integrity, not true black)      */
/* ------------------------------------------------------------------ */

export const darkPalette: Palette = {
  brand: {
    primary: '#E4344F', // brighter Fonepay red for dark surfaces
    primaryPressed: '#C8102E',
    primaryLight: '#F0566D',
    secondary: '#DDDDDD',
    subtle: '#3A1F25',
    muted: '#241A1C',
  },
  background: {
    canvas: '#121212',
    surface: '#1C1C1E',
    elevated: '#242426',
    subtle: '#2A2A2C',
    selected: '#333335',
  },
  text: {
    primary: '#DDDDDD',
    secondary: '#A0A0A0',
    muted: '#6E6E6E',
    inverse: '#FFFFFF',
    brand: '#F0566D',
  },
  border: {
    default: '#2E2E30',
    subtle: '#262628',
    strong: '#DDDDDD',
  },
  status: {
    success: '#3DBE6E',
    successBackground: '#12301F',
    error: '#E8785C',
    errorBackground: '#3A211B',
    warning: '#E0A24A',
    warningBackground: '#3A2C16',
    pending: '#E0A24A',
    pendingBackground: '#3A2C16',
    paid: '#3DBE6E',
    paidBackground: '#12301F',
    failed: '#E8785C',
    failedBackground: '#3A211B',
  },
  payment: {
    cash: '#A0A0A0',
    cashBackground: '#2A2A2C',
    cashText: '#DDDDDD',
    fonepay: '#A0A0A0',
    fonepayBackground: '#2A2A2C',
    fonepayText: '#DDDDDD',
  },
  overlay: 'rgba(0, 0, 0, 0.6)',
  cardShadow: 'rgba(0, 0, 0, 0.5)',
};

export type ThemeScheme = 'light' | 'dark';
export type ThemeMode = 'system' | 'light' | 'dark';

export const palettes: Record<ThemeScheme, Palette> = {
  light: lightPalette,
  dark: darkPalette,
};
