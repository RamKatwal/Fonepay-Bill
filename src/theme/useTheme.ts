import { useThemeContext } from './ThemeProvider';
import type { Palette, ThemeMode, ThemeScheme } from './palette';
import { APP_FONT_OPTIONS, type AppFontKey } from './fonts';

/** Returns the active palette. Re-renders the caller on theme change. */
export function useTheme(): Palette {
  return useThemeContext().palette;
}

/** Returns the theme mode controls (`system` | `light` | `dark`) and resolved scheme. */
export function useThemeMode(): {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  scheme: ThemeScheme;
} {
  const { mode, setMode, scheme } = useThemeContext();
  return { mode, setMode, scheme };
}

/** Returns the selected body typeface, a setter, and the available options. */
export function useAppFont(): {
  font: AppFontKey;
  setFont: (font: AppFontKey) => void;
  fonts: { key: AppFontKey; label: string }[];
} {
  const { font, setFont } = useThemeContext();
  return { font, setFont, fonts: APP_FONT_OPTIONS };
}
