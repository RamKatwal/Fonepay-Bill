import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Transaction } from '@/types/transaction';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { spacing } from '@/constants/spacing';
import { makeStyles } from '@/theme';
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

  return (
    <Card
      variant="surface"
      padding="sm"
      onPress={onPress}
      style={[styles.card, style]}>
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
    </Card>
  );
}

const useStyles = makeStyles((t, type) => ({
  card: {
    marginBottom: 0,
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
    ...type.invoiceNumber,
    color: t.text.secondary,
  },
  amount: {
    ...type.amount,
    fontSize: 16,
    color: t.text.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    ...type.caption,
    color: t.text.muted,
  },
}));
