import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { makeStyles, useTheme } from '@/theme';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { useItemHistory } from '@/store/ItemHistoryContext';
import { formatNPR } from '@/utils/currency';
import { lightTick } from '@/utils/haptics';

interface ItemNameFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  /** A suggestion (price > 0) or the "add as new" row (price 0) was chosen. */
  onPick: (name: string, price: number) => void;
  /** Keyboard "next" — caller should move focus to the next field (quantity). */
  onSubmit: () => void;
  error?: string;
  inputRef?: React.RefObject<TextInput | null>;
}

export function ItemNameField({
  value,
  onChangeText,
  onPick,
  onSubmit,
  error,
  inputRef,
}: ItemNameFieldProps) {
  const styles = useStyles();
  const t = useTheme();
  const { suggest, popular } = useItemHistory();
  const [open, setOpen] = useState(false);

  const trimmed = value.trim();
  const suggestions = useMemo(
    () => (open && trimmed.length >= 1 ? suggest(trimmed) : []),
    [open, trimmed, suggest]
  );
  const popularItems = useMemo(() => popular(6), [popular]);

  const hasExactMatch = suggestions.some(
    (s) => s.name.trim().toLowerCase() === trimmed.toLowerCase()
  );
  const showAddNew = open && trimmed.length >= 1 && !hasExactMatch;
  const showDropdown = suggestions.length > 0 || showAddNew;
  // Frequent chips when not actively showing the type-ahead dropdown.
  const showPopular = popularItems.length > 0 && !showDropdown;
  const selectedChipName = trimmed.toLowerCase();

  const handleChange = (text: string) => {
    onChangeText(text);
    setOpen(true);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  /** Type-ahead / add-new — fill fields and move focus onward. */
  const pickSuggestion = (name: string, price: number) => {
    lightTick();
    setOpen(false);
    onPick(name, price);
    onSubmit();
  };

  /** Frequent chip — fill fields only; keep chips visible with selection. */
  const pickChip = (name: string, price: number) => {
    lightTick();
    setOpen(false);
    onPick(name, price);
  };

  return (
    <View style={styles.wrap}>
      <Input
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={handleFocus}
        placeholder="e.g. Chicken Steam Momo"
        error={error}
        containerStyle={styles.noMargin}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => {
          setOpen(false);
          onSubmit();
        }}
      />

      {showPopular && (
        <View style={styles.popular}>
          <Text style={styles.popularLabel}>Frequent items</Text>
          <View style={styles.chips}>
            {popularItems.map((item) => (
              <Chip
                key={item.name}
                label={item.name}
                size="sm"
                selected={item.name.trim().toLowerCase() === selectedChipName}
                selectedTone="brand"
                onPress={() => pickChip(item.name, item.lastPrice)}
              />
            ))}
          </View>
        </View>
      )}

      {!trimmed && !showPopular && (
        <Text style={styles.hint}>Items you add will show up here next time.</Text>
      )}

      {showDropdown && (
        <View style={styles.dropdown}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}>
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={s.name}
                style={[
                  styles.row,
                  i === suggestions.length - 1 && !showAddNew && styles.rowLast,
                ]}
                activeOpacity={0.6}
                onPress={() => pickSuggestion(s.name, s.lastPrice)}>
                <Text style={styles.rowName} numberOfLines={1}>
                  {s.name}
                </Text>
                <Text style={styles.rowPrice}>{formatNPR(s.lastPrice)}</Text>
              </TouchableOpacity>
            ))}

            {showAddNew && (
              <TouchableOpacity
                style={[styles.row, styles.addRow]}
                activeOpacity={0.6}
                onPress={() => pickSuggestion(trimmed, 0)}>
                <Icon name="add" size={16} color={t.brand.primary} />
                <Text style={styles.addText} numberOfLines={1}>
                  Add “{trimmed}” as new item
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((t, type) => ({
  wrap: {
    gap: 7,
  },
  noMargin: {
    marginBottom: 0,
  },
  hint: {
    ...type.caption,
    color: t.text.muted,
  },
  popular: {
    gap: 6,
  },
  popularLabel: {
    ...type.caption,
    color: t.text.muted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.medium,
    backgroundColor: t.background.surface,
    overflow: 'hidden',
    maxHeight: 220,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: t.border.subtle,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowName: {
    ...type.bodyMedium,
    color: t.text.primary,
    flex: 1,
  },
  rowPrice: {
    ...type.caption,
    color: t.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  addRow: {
    justifyContent: 'flex-start',
    borderBottomWidth: 0,
  },
  addText: {
    ...type.bodyMedium,
    fontWeight: '600',
    color: t.brand.primary,
    flex: 1,
  },
}));
