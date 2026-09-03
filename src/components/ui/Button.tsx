import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
import { shadows } from '@/constants/shadows';
import { motion } from '@/constants/motion';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const isInteractive = !disabled && !loading;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!isInteractive) return;
    Animated.timing(scaleAnim, {
      toValue: motion.scale.pressed,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!isInteractive) return;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const getLoaderColor = () => {
    if (variant === 'primary') return colors.text.inverse;
    if (variant === 'secondary') return colors.text.primary;
    return colors.brand.primary;
  };

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidthContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}>
      <Pressable
        testID={testID}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isInteractive}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isInteractive, busy: loading }}
        style={({ pressed }) => [
          styles.base,
          styles[size],
          styles[variant],
          variant === 'primary' && !disabled && styles.primaryShadow,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}>
        {loading ? (
          <ActivityIndicator size="small" color={getLoaderColor()} />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text
              style={[
                styles.baseText,
                styles[`${size}Text`],
                styles[`${variant}Text`],
                disabled && styles.disabledText,
                textStyle,
              ]}>
              {title}
            </Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * Explicit Primary CTA wrapper
 */
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="primary" />;
}

/**
 * Explicit Secondary Action wrapper (for Edit, Cancel, Details, Secondary navigation)
 */
export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="secondary" />;
}

const styles = StyleSheet.create({
  fullWidthContainer: {
    width: '100%',
  },
  base: {
    borderRadius: radius.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },

  // Touch Target Sizes (comfortable 38pt / 48pt / 56pt)
  sm: {
    minHeight: 38,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.medium,
  },
  md: {
    minHeight: 48,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.large,
  },
  lg: {
    minHeight: 56,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.large,
  },

  // Primary variant
  primary: {
    backgroundColor: colors.brand.primary,
  },
  primaryShadow: {
    ...shadows.primaryGlow,
  },

  // Secondary variant (soft, non-competing)
  secondary: {
    backgroundColor: colors.background.subtle,
    borderWidth: 1,
    borderColor: colors.border.default,
  },

  // Outline variant
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
  },

  // Ghost variant
  ghost: {
    backgroundColor: 'transparent',
  },

  // Danger variant
  danger: {
    backgroundColor: colors.status.errorBackground,
    borderWidth: 1,
    borderColor: colors.status.error,
  },

  // Disabled state
  disabled: {
    backgroundColor: colors.background.subtle,
    borderColor: colors.border.subtle,
    shadowOpacity: 0,
    elevation: 0,
  },

  // Typography
  baseText: {
    ...typography.button,
    textAlign: 'center',
  },
  smText: {
    fontSize: 13,
    lineHeight: 18,
  },
  mdText: {
    fontSize: 15,
    lineHeight: 22,
  },
  lgText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },

  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineText: {
    color: colors.brand.primary,
  },
  ghostText: {
    color: colors.text.secondary,
  },
  dangerText: {
    color: colors.status.error,
  },
  disabledText: {
    color: colors.text.muted,
  },
});
