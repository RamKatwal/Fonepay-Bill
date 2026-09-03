import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
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

const statusConfig: Record<
  BadgeStatus,
  {
    backgroundColor: string;
    textColor: string;
    defaultLabel: string;
    icon: IconName;
  }
> = {
  // Paid: Check + Paid
  paid: {
    backgroundColor: colors.status.paidBackground,
    textColor: colors.status.paid,
    defaultLabel: 'Paid',
    icon: 'checkmark-circle',
  },

  // Pending: Clock + Pending
  pending: {
    backgroundColor: colors.status.pendingBackground,
    textColor: colors.status.pending,
    defaultLabel: 'Pending',
    icon: 'time-outline',
  },

  // Failed: Close + Failed
  failed: {
    backgroundColor: colors.status.failedBackground,
    textColor: colors.status.failed,
    defaultLabel: 'Failed',
    icon: 'close-circle',
  },

  // Cash payment badge
  cash: {
    backgroundColor: colors.payment.cashBackground,
    textColor: colors.payment.cashText,
    defaultLabel: 'Cash',
    icon: 'cash-outline',
  },

  // Fonepay payment badge
  fonepay: {
    backgroundColor: colors.payment.fonepayBackground,
    textColor: colors.payment.fonepayText,
    defaultLabel: 'Fonepay',
    icon: 'qr-code-outline',
  },
};

export function Badge({
  status,
  label,
  size = 'md',
  style,
  showIcon = true,
}: BadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: config.backgroundColor },
        isSm ? styles.smContainer : styles.mdContainer,
        style,
      ]}>
      {showIcon && (
        <View style={styles.iconContainer}>
          <Icon
            name={config.icon}
            size={isSm ? 12 : 14}
            color={config.textColor}
          />
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

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  smContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  mdContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
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
});
