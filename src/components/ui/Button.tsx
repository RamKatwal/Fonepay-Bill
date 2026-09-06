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
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { motion } from '@/constants/motion';
import { makeStyles, useTheme } from '@/theme';

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
  const styles = useStyles();
  const t = useTheme();
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
    if (variant === 'primary') return t.text.inverse;
    if (variant === 'danger') return t.status.error;
    if (variant === 'secondary' || variant === 'ghost') return t.text.primary;
    return t.text.primary;
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
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          pressed && isInteractive && styles.pressed,
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

export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="secondary" />;
}

const useStyles = makeStyles((t, type) => ({
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
  pressed: {
    opacity: 0.92,
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

  // Sizes
  sm: {
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.medium,
  },
  md: {
    minHeight: 46,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.large,
  },
  lg: {
    minHeight: 52,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.large,
  },

  // Variants
  primary: {
    backgroundColor: t.brand.primary,
    shadowColor: t.brand.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 2,
  },
  secondary: {
    backgroundColor: t.background.surface,
    borderWidth: 1,
    borderColor: t.border.default,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: t.border.strong,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: t.status.errorBackground,
    borderWidth: 1,
    borderColor: t.status.error,
  },

  disabled: {
    backgroundColor: t.background.subtle,
    borderColor: t.border.subtle,
  },

  // Text
  baseText: {
    ...type.button,
    textAlign: 'center',
  },
  smText: {
    fontSize: 13,
    lineHeight: 18,
  },
  mdText: {
    fontSize: 15,
    lineHeight: 20,
  },
  lgText: {
    fontSize: 16,
    lineHeight: 22,
  },

  primaryText: {
    color: t.text.inverse,
  },
  secondaryText: {
    color: t.text.primary,
  },
  outlineText: {
    color: t.text.primary,
  },
  ghostText: {
    color: t.text.primary,
  },
  dangerText: {
    color: t.status.error,
  },
  disabledText: {
    color: t.text.muted,
  },
}));
