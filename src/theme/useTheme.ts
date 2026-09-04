import { useThemeContext } from './ThemeProvider';
import type { Palette, ThemeMode, ThemeScheme } from './palette';

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
