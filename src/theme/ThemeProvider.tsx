import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  palettes,
  type Palette,
  type ThemeMode,
  type ThemeScheme,
} from './palette';
import { DEFAULT_APP_FONT, type AppFontKey } from './fonts';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  scheme: ThemeScheme;
  palette: Palette;
  font: AppFontKey;
  setFont: (font: AppFontKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  initialMode = 'system',
  initialFont = DEFAULT_APP_FONT,
}: {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  initialFont?: AppFontKey;
}) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [font, setFont] = useState<AppFontKey>(initialFont);
  const systemScheme = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => {
    const scheme: ThemeScheme =
      mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
    return {
      mode,
      setMode,
      scheme,
      palette: palettes[scheme],
      font,
      setFont,
    };
  }, [mode, systemScheme, font]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
