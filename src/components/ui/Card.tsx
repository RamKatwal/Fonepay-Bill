import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, Pressable, Animated, StyleProp } from 'react-native';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { motion } from '@/constants/motion';
import { makeStyles } from '@/theme';

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
  const styles = useStyles();
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

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },

  // Resting surfaces use a hairline border, not a shadow.
  surface: {
    backgroundColor: t.background.surface,
    borderWidth: 1,
    borderColor: t.border.subtle,
  },
  elevated: {
    backgroundColor: t.background.surface,
    borderWidth: 1,
    borderColor: t.border.subtle,
    ...shadows.card,
  },
  flat: {
    backgroundColor: t.background.subtle,
  },
  // `accent` kept for API compatibility — now just a plain surface.
  accent: {
    backgroundColor: t.background.surface,
    borderWidth: 1,
    borderColor: t.border.subtle,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: t.border.default,
  },

  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: spacing.md,
  },
  padding_md: {
    padding: spacing.lg,
  },
  padding_lg: {
    padding: spacing.xl,
  },
}));
