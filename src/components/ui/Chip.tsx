import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { motion } from '@/constants/motion';
import { makeStyles, useTheme } from '@/theme';
import { Icon, IconName } from './Icon';

export type ChipTone = 'ink' | 'brand';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  /** Selected-state treatment: solid ink (filters) or brand tint (discount). */
  selectedTone?: ChipTone;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md';
  testID?: string;
}

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  disabled = false,
  selectedTone = 'ink',
  style,
  textStyle,
  size = 'md',
  testID,
}: ChipProps) {
  const styles = useStyles();
  const t = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.timing(scaleAnim, {
      toValue: motion.scale.chipPressed,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const isSm = size === 'sm';
  const brand = selectedTone === 'brand';

  const iconColor = !selected
    ? t.text.secondary
    : brand
      ? t.brand.primary
      : t.background.surface;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        testID={testID}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected, disabled }}
        style={[
          styles.base,
          isSm ? styles.sm : styles.md,
          selected ? (brand ? styles.selectedBrand : styles.selectedInk) : styles.unselected,
          disabled && styles.disabled,
          style,
        ]}>
        {icon && (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={isSm ? 14 : 16} color={iconColor} />
          </View>
        )}
        <Text
          style={[
            styles.label,
            isSm ? styles.smLabel : styles.mdLabel,
            selected
              ? brand
                ? styles.selectedBrandLabel
                : styles.selectedInkLabel
              : styles.unselectedLabel,
            disabled && styles.disabledLabel,
            textStyle,
          ]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((t, type) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  unselected: {
    backgroundColor: t.background.surface,
    borderWidth: 1,
    borderColor: t.border.default,
  },
  selectedInk: {
    backgroundColor: t.text.primary,
    borderWidth: 1,
    borderColor: t.text.primary,
  },
  selectedBrand: {
    backgroundColor: t.brand.subtle,
    borderWidth: 1,
    borderColor: t.brand.primary,
  },
  disabled: {
    backgroundColor: t.background.subtle,
    borderColor: t.border.subtle,
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  label: {
    ...type.bodyMedium,
  },
  smLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  mdLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  unselectedLabel: {
    color: t.text.secondary,
    fontWeight: '500',
  },
  selectedInkLabel: {
    color: t.background.surface,
    fontWeight: '700',
  },
  selectedBrandLabel: {
    color: t.brand.primary,
    fontWeight: '700',
  },
  disabledLabel: {
    color: t.text.muted,
  },
}));
