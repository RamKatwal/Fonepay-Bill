import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { makeStyles, useTheme, type Palette } from '@/theme';
import { Icon, IconName } from './Icon';

export type BadgeStatus = 'paid' | 'pending' | 'failed' | 'cash' | 'fonepay';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  size?: BadgeSize;
  style?: ViewStyle;
  showIcon?: boolean;
}

function statusConfig(t: Palette): Record<
  BadgeStatus,
  { backgroundColor: string; textColor: string; defaultLabel: string; icon: IconName }
> {
  return {
    paid: {
      backgroundColor: t.status.paidBackground,
      textColor: t.status.paid,
      defaultLabel: 'Paid',
      icon: 'checkmark-circle',
    },
    pending: {
      backgroundColor: t.status.pendingBackground,
      textColor: t.status.pending,
      defaultLabel: 'Pending',
      icon: 'time-outline',
    },
    failed: {
      backgroundColor: t.status.failedBackground,
      textColor: t.status.failed,
      defaultLabel: 'Failed',
      icon: 'close-circle',
    },
    // Payment channels — text-only chips (no icon).
    cash: {
      backgroundColor: t.background.subtle,
      textColor: t.text.secondary,
      defaultLabel: 'Cash',
      icon: 'cash-outline',
    },
    fonepay: {
      backgroundColor: t.background.subtle,
      textColor: t.text.secondary,
      defaultLabel: 'Fonepay',
      icon: 'qr-code-outline',
    },
  };
}

export function Badge({
  status,
  label,
  size = 'md',
  style,
  showIcon = true,
}: BadgeProps) {
  const styles = useStyles();
  const t = useTheme();
  const config = statusConfig(t)[status];
  const displayLabel = label || config.defaultLabel;
  const isSm = size === 'sm';
  // Payment-channel chips are text-only — no icons.
  const isPaymentChannel = status === 'cash' || status === 'fonepay';
  const renderIcon = showIcon && !isPaymentChannel;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: config.backgroundColor },
        isSm ? styles.smContainer : styles.mdContainer,
        style,
      ]}>
      {renderIcon && (
        <View style={styles.iconContainer}>
          <Icon name={config.icon} size={isSm ? 12 : 13} color={config.textColor} />
        </View>
      )}
      <Text
        style={[
          styles.text,
          { color: config.textColor },
          isSm ? styles.smText : styles.mdText,
        ]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  smContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  mdContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  smText: {
    fontSize: 11,
    lineHeight: 14,
  },
  mdText: {
    fontSize: 12,
    lineHeight: 16,
  },
}));
