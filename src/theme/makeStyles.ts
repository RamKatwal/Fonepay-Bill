import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './useTheme';
import type { Palette } from './palette';

/**
 * Theme-aware replacement for `StyleSheet.create`.
 *
 *   const useStyles = makeStyles((t) => ({
 *     card: { backgroundColor: t.background.surface },
 *   }));
 *
 *   function Card() {
 *     const styles = useStyles();
 *     ...
 *   }
 *
 * The stylesheet is memoised per palette, so it is only rebuilt when the theme
 * actually changes.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (t: Palette) => T & StyleSheet.NamedStyles<any>
) {
  return function useStyles(): T {
    const palette = useTheme();
    return useMemo(() => StyleSheet.create(factory(palette)), [palette]);
  };
}
