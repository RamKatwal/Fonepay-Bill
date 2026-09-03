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
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
import { motion } from '@/constants/motion';
import { Icon, IconName } from './Icon';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
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
  style,
  textStyle,
  size = 'md',
  testID,
}: ChipProps) {
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
          selected ? styles.selected : styles.unselected,
          disabled && styles.disabled,
          style,
        ]}>
        {icon && (
          <View style={styles.iconContainer}>
            <Icon
              name={icon}
              size={isSm ? 14 : 16}
              color={selected ? colors.brand.primary : colors.text.secondary}
            />
          </View>
        )}
        <Text
          style={[
            styles.label,
            isSm ? styles.smLabel : styles.mdLabel,
            selected ? styles.selectedLabel : styles.unselectedLabel,
            disabled && styles.disabledLabel,
            textStyle,
          ]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selected: {
    backgroundColor: colors.brand.subtle,
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
  },
  unselected: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  disabled: {
    backgroundColor: colors.background.subtle,
    borderColor: colors.border.subtle,
    opacity: 0.6,
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  label: {
    ...typography.bodyMedium,
  },
  smLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  mdLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  selectedLabel: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  unselectedLabel: {
    color: colors.text.secondary,
    fontWeight: '500',
  },
  disabledLabel: {
    color: colors.text.muted,
  },
});
