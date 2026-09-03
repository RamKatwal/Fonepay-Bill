import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Transaction } from '@/types/transaction';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
import { formatNPR } from '@/utils/currency';

export interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * TransactionCard
 * Groups invoice information, prominent monetary amount, payment channel, and semantic status.
 */
export function TransactionCard({
  transaction,
  onPress,
  style,
}: TransactionCardProps) {
  const isFonepay = transaction.paymentMode === 'fonepay';

  return (
    <Card
      variant="surface"
      padding="sm"
      onPress={onPress}
      style={[styles.card, style]}>
      <View style={styles.row}>
        {/* Payment Mode Icon Visual */}
        <View
          style={[
            styles.iconBox,
            isFonepay ? styles.fonepayIconBox : styles.cashIconBox,
          ]}>
          <Icon
            name={isFonepay ? 'qr-code-outline' : 'cash-outline'}
            size={20}
            color={isFonepay ? colors.brand.primary : colors.payment.cash}
          />
        </View>

        {/* Content Details */}
        <View style={styles.content}>
          {/* Top Row: Invoice Number & Prominent Amount */}
          <View style={styles.topRow}>
            <Text style={styles.invoiceNumber}>{transaction.invoiceNumber}</Text>
            <Text style={styles.amount}>{formatNPR(transaction.amount)}</Text>
          </View>

          {/* Bottom Row: Timestamp & Status Badges */}
          <View style={styles.bottomRow}>
            <Text style={styles.timestamp}>
              {transaction.date} • {transaction.time}
            </Text>
            <View style={styles.badges}>
              <Badge status={transaction.paymentMode} size="sm" />
              <Badge status={transaction.paymentStatus} size="sm" />
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fonepayIconBox: {
    backgroundColor: colors.brand.muted,
  },
  cashIconBox: {
    backgroundColor: colors.payment.cashBackground,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  invoiceNumber: {
    ...typography.invoiceNumber,
    fontSize: 13,
    color: colors.text.primary,
  },
  amount: {
    ...typography.amount,
    fontSize: 16,
    color: colors.text.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    ...typography.caption,
    color: colors.text.muted,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
