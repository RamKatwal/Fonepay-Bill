import React from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface DividerProps {
  style?: ViewStyle;
  label?: string;
  dashed?: boolean;
}

export function Divider({ style, label, dashed }: DividerProps) {
  if (label) {
    return (
      <View style={[styles.labelContainer, style]}>
        <View style={[styles.line, dashed && styles.dashed]} />
        <Text style={styles.labelText}>{label}</Text>
        <View style={[styles.line, dashed && styles.dashed]} />
      </View>
    );
  }

  return <View style={[styles.line, dashed && styles.dashed, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
  },
  dashed: {
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: Colors.borderDark,
    backgroundColor: 'transparent',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  labelText: {
    paddingHorizontal: Spacing.md,
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
  },
});
