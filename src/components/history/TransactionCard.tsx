import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Transaction } from '@/types/transaction';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';

export interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * TransactionCard — invoice, amount, payment channel, and status.
 */
export function TransactionCard({
  transaction,
  onPress,
  style,
}: TransactionCardProps) {
  const styles = useStyles();
  const t = useTheme();
  const isFonepay = transaction.paymentMode === 'fonepay';

  return (
    <Card
      variant="surface"
      padding="sm"
      onPress={onPress}
      style={[styles.card, style]}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Icon
            name={isFonepay ? 'qr-code-outline' : 'cash-outline'}
            size={20}
            color={t.text.secondary}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.invoiceNumber}>{transaction.invoiceNumber}</Text>
            <Text style={styles.amount}>{formatNPR(transaction.amount)}</Text>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.timestamp}>
              {transaction.date} • {transaction.time}
            </Text>
            <Badge status={transaction.paymentMode} size="sm" />
          </View>
        </View>
      </View>
    </Card>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.background.subtle,
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
    color: t.text.secondary,
  },
  amount: {
    ...typography.amount,
    fontSize: 16,
    color: t.text.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    ...typography.caption,
    color: t.text.muted,
  },
}));
