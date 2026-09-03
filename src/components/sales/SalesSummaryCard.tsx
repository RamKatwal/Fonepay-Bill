import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
import { formatNPR } from '@/utils/currency';

export interface SalesSummaryCardProps {
  totalVolume: number;
  totalSalesCount: number;
  fonepayVolume?: number;
  cashVolume?: number;
  dateLabel?: string;
  style?: ViewStyle;
}

/**
 * SalesSummaryCard
 * Displays daily financial overview with prioritized monetary typography
 */
export function SalesSummaryCard({
  totalVolume,
  totalSalesCount,
  fonepayVolume,
  cashVolume,
  dateLabel = "Today's Overview",
  style,
}: SalesSummaryCardProps) {
  return (
    <Card variant="surface" padding="md" style={style}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Icon name="stats-chart" size={16} color={colors.brand.primary} />
          <Text style={styles.sectionHeaderTitle}>{dateLabel}</Text>
        </View>
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Primary Financial Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.primaryStat}>
          <Text style={styles.statLabel}>Total Sales Volume</Text>
          <Text style={styles.totalAmount}>{formatNPR(totalVolume)}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.secondaryStat}>
          <Text style={styles.statLabel}>Bills Issued</Text>
          <Text style={styles.billCount}>{totalSalesCount}</Text>
        </View>
      </View>

      {/* Payment Channel Breakdown (if provided) */}
      {(fonepayVolume !== undefined || cashVolume !== undefined) && (
        <View style={styles.breakdownRow}>
          {fonepayVolume !== undefined && (
            <View style={styles.channelPill}>
              <View style={[styles.channelDot, { backgroundColor: colors.brand.primary }]} />
              <Text style={styles.channelLabel}>Fonepay QR: </Text>
              <Text style={styles.channelValue}>{formatNPR(fonepayVolume)}</Text>
            </View>
          )}
          {cashVolume !== undefined && (
            <View style={styles.channelPill}>
              <View style={[styles.channelDot, { backgroundColor: colors.payment.cash }]} />
              <Text style={styles.channelLabel}>Cash: </Text>
              <Text style={styles.channelValue}>{formatNPR(cashVolume)}</Text>
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionHeaderTitle: {
    ...typography.label,
    color: colors.text.secondary,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.successBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.status.success,
  },
  liveText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.status.success,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.subtle,
    borderRadius: radius.medium,
    padding: spacing.md,
  },
  primaryStat: {
    flex: 1.6,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border.default,
    marginHorizontal: spacing.md,
  },
  secondaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: 4,
  },
  totalAmount: {
    ...typography.amountLarge,
    color: colors.text.primary,
  },
  billCount: {
    ...typography.amount,
    color: colors.text.primary,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  channelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.subtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.small,
  },
  channelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  channelLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  channelValue: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text.primary,
  },
});
