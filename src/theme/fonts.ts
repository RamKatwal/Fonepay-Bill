import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';

/**
 * Font assets loaded at startup (see `_layout.tsx`). Keys become the
 * `fontFamily` values used across the type scale.
 */
export const fontAssets = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
};

type Weight = 400 | 500 | 600 | 700 | 800;

const JAKARTA: Record<Weight, string> = {
  400: 'PlusJakartaSans_400Regular',
  500: 'PlusJakartaSans_500Medium',
  600: 'PlusJakartaSans_600SemiBold',
  700: 'PlusJakartaSans_700Bold',
  800: 'PlusJakartaSans_800ExtraBold',
};

/** Plus Jakarta Sans family name for a given weight. */
export const jakarta = (weight: Weight = 400) => JAKARTA[weight];

/** IBM Plex Mono — invoice numbers, transaction IDs, monospaced financial scan. */
export const plexMono = (medium = false) =>
  medium ? 'IBMPlexMono_500Medium' : 'IBMPlexMono_400Regular';
