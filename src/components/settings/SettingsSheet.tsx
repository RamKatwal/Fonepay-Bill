import { View, Text } from 'react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Chip } from '@/components/ui/Chip';
import { Spacing } from '@/constants/spacing';
import {
  makeStyles,
  useThemeMode,
  useAppFont,
  familyFor,
  type ThemeMode,
} from '@/theme';

const APPEARANCE_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

export interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Settings bottom sheet — Appearance + Font for now.
 */
export function SettingsSheet({ visible, onClose }: SettingsSheetProps) {
  const styles = useStyles();
  const { mode, setMode } = useThemeMode();
  const { font, setFont, fonts } = useAppFont();

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Settings">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.chipRow}>
          {APPEARANCE_OPTIONS.map((opt) => (
            <Chip
              key={opt.key}
              label={opt.label}
              size="sm"
              selected={mode === opt.key}
              onPress={() => setMode(opt.key)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font</Text>
        <View style={styles.chipRow}>
          {fonts.map((opt) => (
            <Chip
              key={opt.key}
              label={opt.label}
              size="sm"
              selected={font === opt.key}
              onPress={() => setFont(opt.key)}
              textStyle={{
                fontFamily: familyFor(opt.key, font === opt.key ? 700 : 600),
              }}
            />
          ))}
        </View>
      </View>
    </BottomSheet>
  );
}

const useStyles = makeStyles((t, type) => ({
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...type.label,
    color: t.text.secondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
}));
