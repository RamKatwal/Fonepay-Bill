import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { makeStyles } from '@/theme';

export interface BottomActionBarProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Sticky bottom action bar — primary/secondary CTAs with predictable placement.
 */
export function BottomActionBar({
  children,
  style,
  contentStyle,
}: BottomActionBarProps) {
  const styles = useStyles();
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    backgroundColor: t.background.canvas,
    borderTopWidth: 1,
    borderTopColor: t.border.subtle,
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
}));
