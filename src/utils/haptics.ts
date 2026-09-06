import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * A short, light "tick" — used on suggestion pick, quantity ± , and Add to sale.
 * Wrapped so it can never throw on a platform or browser without haptics.
 */
export function lightTick(): void {
  try {
    if (Platform.OS === 'web') {
      const nav =
        typeof navigator !== 'undefined'
          ? (navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean })
          : undefined;
      nav?.vibrate?.(10);
      return;
    }
    Haptics.selectionAsync().catch(() => {});
  } catch {
    // no-op — haptics are a nicety, never a requirement
  }
}
