import React from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { Spacing } from '@/constants/spacing';
import { makeStyles } from '@/theme';

interface DividerProps {
  style?: ViewStyle;
  label?: string;
  dashed?: boolean;
}

export function Divider({ style, label, dashed }: DividerProps) {
  const styles = useStyles();

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

const useStyles = makeStyles((t, type) => ({
  line: {
    height: 1,
    backgroundColor: t.border.subtle,
    width: '100%',
  },
  dashed: {
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: t.border.default,
    backgroundColor: 'transparent',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  labelText: {
    paddingHorizontal: Spacing.md,
    ...type.caption,
    color: t.text.muted,
    fontWeight: '500',
  },
}));
