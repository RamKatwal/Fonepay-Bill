import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';

export interface BottomActionBarProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Sticky Bottom Action Bar
 * Houses primary and secondary CTAs with predictable placement and elevation
 */
export function BottomActionBar({
  children,
  style,
  contentStyle,
}: BottomActionBarProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    ...shadows.bottomBar,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
});
