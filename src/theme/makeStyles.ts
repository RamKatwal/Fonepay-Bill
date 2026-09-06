import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, useAppFont } from './useTheme';
import type { Palette } from './palette';
import { typographyFor, type TypographyNamedStyles } from '@/constants/typography';

/**
 * Theme-aware replacement for `StyleSheet.create`.
 *
 *   const useStyles = makeStyles((t, type) => ({
 *     card: { backgroundColor: t.background.surface },
 *     title: { ...type.cardTitle, color: t.text.primary },
 *   }));
 *
 *   function Card() {
 *     const styles = useStyles();
 *     ...
 *   }
 *
 * The factory receives the active palette and the live type scale (which
 * follows the Profile → Font setting). The stylesheet is memoised per
 * palette + typeface, so it is only rebuilt when the theme or font changes.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (
    t: Palette,
    type: TypographyNamedStyles
  ) => T & StyleSheet.NamedStyles<any>
) {
  return function useStyles(): T {
    const palette = useTheme();
    const { font } = useAppFont();
    return useMemo(() => {
      const type = typographyFor(font);
      return StyleSheet.create(factory(palette, type));
    }, [palette, font]);
  };
}
