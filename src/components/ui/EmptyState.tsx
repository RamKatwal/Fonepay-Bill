import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';
import { Icon, IconName } from './Icon';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon = 'document-text-outline',
  title,
  description,
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) {
  const styles = useStyles();
  const t = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={32} color={t.text.muted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <View style={styles.buttonContainer}>
          <Button
            title={actionTitle}
            onPress={onAction}
            size="md"
            variant="primary"
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: t.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...typography.sectionTitle,
    color: t.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    ...typography.body,
    fontSize: 14,
    color: t.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
}));
