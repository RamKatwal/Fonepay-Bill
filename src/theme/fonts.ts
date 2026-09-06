import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
} from '@expo-google-fonts/geist';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Figtree_800ExtraBold,
} from '@expo-google-fonts/figtree';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';

export type Weight = 400 | 500 | 600 | 700 | 800;

/** Keys for the user-selectable body typeface (Profile → Font). */
export type AppFontKey = 'jakarta' | 'inter' | 'geist' | 'figtree';

interface AppFont {
  key: AppFontKey;
  /** Human label shown in the Font selector. */
  label: string;
  /** Per-weight `fontFamily` — custom fonts don't synthesise weight on native. */
  weights: Record<Weight, string>;
  /** Font modules handed to `useFonts` at startup. */
  assets: Record<string, unknown>;
}

/**
 * Registry of switchable body typefaces. Plus Jakarta Sans is the default (the
 * documented Cereal substitute); the rest are offered as alternatives on the
 * Profile screen. IBM Plex Mono (invoice numbers / transaction IDs) is not
 * switchable and lives outside this registry.
 */
export const APP_FONTS: Record<AppFontKey, AppFont> = {
  jakarta: {
    key: 'jakarta',
    label: 'Plus Jakarta Sans',
    weights: {
      400: 'PlusJakartaSans_400Regular',
      500: 'PlusJakartaSans_500Medium',
      600: 'PlusJakartaSans_600SemiBold',
      700: 'PlusJakartaSans_700Bold',
      800: 'PlusJakartaSans_800ExtraBold',
    },
    assets: {
      PlusJakartaSans_400Regular,
      PlusJakartaSans_500Medium,
      PlusJakartaSans_600SemiBold,
      PlusJakartaSans_700Bold,
      PlusJakartaSans_800ExtraBold,
    },
  },
  inter: {
    key: 'inter',
    label: 'Inter',
    weights: {
      400: 'Inter_400Regular',
      500: 'Inter_500Medium',
      600: 'Inter_600SemiBold',
      700: 'Inter_700Bold',
      800: 'Inter_800ExtraBold',
    },
    assets: {
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
      Inter_800ExtraBold,
    },
  },
  geist: {
    key: 'geist',
    label: 'Geist',
    weights: {
      400: 'Geist_400Regular',
      500: 'Geist_500Medium',
      600: 'Geist_600SemiBold',
      700: 'Geist_700Bold',
      800: 'Geist_800ExtraBold',
    },
    assets: {
      Geist_400Regular,
      Geist_500Medium,
      Geist_600SemiBold,
      Geist_700Bold,
      Geist_800ExtraBold,
    },
  },
  figtree: {
    key: 'figtree',
    label: 'Figtree',
    weights: {
      400: 'Figtree_400Regular',
      500: 'Figtree_500Medium',
      600: 'Figtree_600SemiBold',
      700: 'Figtree_700Bold',
      800: 'Figtree_800ExtraBold',
    },
    assets: {
      Figtree_400Regular,
      Figtree_500Medium,
      Figtree_600SemiBold,
      Figtree_700Bold,
      Figtree_800ExtraBold,
    },
  },
};

/** Default body typeface used before a choice is made and by static callers. */
export const DEFAULT_APP_FONT: AppFontKey = 'jakarta';

/** `{ key, label }` list for rendering the Font selector. */
export const APP_FONT_OPTIONS = Object.values(APP_FONTS).map(({ key, label }) => ({
  key,
  label,
}));

/**
 * Font assets loaded at startup (see `_layout.tsx`) — every switchable family
 * plus IBM Plex Mono. Keys become the `fontFamily` values used across the scale.
 */
export const fontAssets = {
  ...APP_FONTS.jakarta.assets,
  ...APP_FONTS.inter.assets,
  ...APP_FONTS.geist.assets,
  ...APP_FONTS.figtree.assets,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
};

/** `fontFamily` for the given switchable typeface + weight. */
export const familyFor = (font: AppFontKey, weight: Weight = 400) =>
  APP_FONTS[font].weights[weight];

/** Plus Jakarta Sans family name for a given weight (static default typeface). */
export const jakarta = (weight: Weight = 400) => APP_FONTS.jakarta.weights[weight];

/** IBM Plex Mono — invoice numbers, transaction IDs, monospaced financial scan. */
export const plexMono = (medium = false) =>
  medium ? 'IBMPlexMono_500Medium' : 'IBMPlexMono_400Regular';
