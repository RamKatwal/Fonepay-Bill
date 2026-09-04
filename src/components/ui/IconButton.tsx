import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View, Text } from 'react-native';
import { Icon, IconName } from './Icon';
import { BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';

interface IconButtonProps {
  icon: IconName;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  badge?: number | string;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function IconButton({
  icon,
  onPress,
  size = 44,
  iconSize = 22,
  color,
  backgroundColor = 'transparent',
  borderColor,
  badge,
  disabled = false,
  style,
  accessibilityLabel,
}: IconButtonProps) {
  const styles = useStyles();
  const t = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor: borderColor || 'transparent',
          borderWidth: borderColor ? 1 : 0,
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}>
      <Icon name={icon} size={iconSize} color={color ?? t.text.primary} />
      {badge !== undefined && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: t.brand.primary,
    borderRadius: BorderRadius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: t.text.inverse,
    fontSize: Typography.size.xxs,
    fontWeight: Typography.weight.bold,
  },
}));
