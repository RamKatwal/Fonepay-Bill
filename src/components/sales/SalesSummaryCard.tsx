import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Card } from '@/components/ui/Card';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { makeStyles } from '@/theme';
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
 * SalesSummaryCard — "Today's overview". Data model unchanged; laid out per the
 * Fonepay design: quiet date label, hero total, a hairline-divided stat row.
 */
export function SalesSummaryCard({
  totalVolume,
  totalSalesCount,
  fonepayVolume,
  cashVolume,
  dateLabel = 'Today',
  style,
}: SalesSummaryCardProps) {
  const styles = useStyles();

  return (
    <Card variant="surface" padding="md" style={style}>
      <Text style={styles.dateLabel}>{dateLabel}</Text>
      <Text style={styles.total}>{formatNPR(totalVolume)}</Text>

      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalSalesCount}</Text>
          <Text style={styles.statLabel}>Bills</Text>
        </View>
        {fonepayVolume !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statValueSm}>{formatNPR(fonepayVolume)}</Text>
            <Text style={styles.statLabel}>Fonepay QR</Text>
          </View>
        )}
        {cashVolume !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statValueSm}>{formatNPR(cashVolume)}</Text>
            <Text style={styles.statLabel}>Cash</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const useStyles = makeStyles((t) => ({
  dateLabel: {
    ...typography.caption,
    fontFamily: typography.label.fontFamily,
    fontWeight: '600',
    color: t.text.secondary,
    marginBottom: 4,
  },
  total: {
    ...typography.display,
    color: t.text.primary,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.xxl,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: t.border.default,
  },
  stat: {
    gap: 2,
  },
  statValue: {
    ...typography.sectionTitle,
    fontSize: 17,
    color: t.text.primary,
  },
  statValueSm: {
    ...typography.sectionTitle,
    fontSize: 15,
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...typography.caption,
    fontSize: 11,
    color: t.text.secondary,
  },
}));
