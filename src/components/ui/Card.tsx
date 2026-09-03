import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, Pressable, Animated, StyleProp } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { motion } from '@/constants/motion';

export type CardVariant = 'surface' | 'elevated' | 'flat' | 'accent' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  testID?: string;
}

export function Card({
  children,
  variant = 'surface',
  padding = 'md',
  style,
  onPress,
  testID,
}: CardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.timing(scaleAnim, {
      toValue: motion.scale.pressed,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const containerStyles = [
    styles.base,
    styles[variant],
    styles[`padding_${padding}` as keyof typeof styles],
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          testID={testID}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          style={containerStyles}>
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View testID={testID} style={containerStyles}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },

  // Variants: subtle borders and intentional elevation
  surface: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  elevated: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.card,
  },
  flat: {
    backgroundColor: colors.background.subtle,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  accent: {
    backgroundColor: colors.brand.muted,
    borderWidth: 1,
    borderColor: colors.brand.subtle,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border.default,
  },

  // Paddings
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: spacing.sm,
  },
  padding_md: {
    padding: spacing.lg,
  },
  padding_lg: {
    padding: spacing.xl,
  },
});
