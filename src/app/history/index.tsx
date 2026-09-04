import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTransactions } from '@/hooks/useTransactions';
import { Screen } from '@/components/layout/Screen';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { TransactionCard } from '@/components/history/TransactionCard';
import { Spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { makeStyles } from '@/theme';
import { PaymentMode } from '@/types/payment';

export default function SalesHistoryScreen() {
  const router = useRouter();
  const styles = useStyles();
  const {
    paginatedTransactions,
    page,
    totalPages,
    totalCount,
    nextPage,
    prevPage,
  } = useTransactions();

  const [modeFilter, setModeFilter] = useState<PaymentMode | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    if (modeFilter === 'all') return paginatedTransactions;
    return paginatedTransactions.filter((tx) => tx.paymentMode === modeFilter);
  }, [paginatedTransactions, modeFilter]);

  const handleOpenTransaction = (id: string) => {
    router.push(`/history/${id}` as any);
  };

  const filters: { key: PaymentMode | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'fonepay', label: 'Fonepay' },
    { key: 'cash', label: 'Cash' },
  ];

  return (
    <Screen
      headerProps={{
        title: 'Sales history',
        subtitle: `${totalCount} transactions`,
        showBack: true,
      }}>
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            size="sm"
            selected={modeFilter === f.key}
            onPress={() => setModeFilter(f.key)}
          />
        ))}
      </View>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No transactions found"
          description="There are no sales matching the selected filter."
        />
      ) : (
        <View style={styles.txList}>
          {filteredTransactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              onPress={() => handleOpenTransaction(tx.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.paginationBar}>
        <IconButton
          icon="chevron-back"
          onPress={prevPage}
          disabled={page <= 1}
          size={40}
          iconSize={20}
        />
        <View style={styles.pageIndicatorBox}>
          <Text style={styles.pageIndicatorText}>
            Page {page} of {totalPages}
          </Text>
        </View>
        <IconButton
          icon="chevron-forward"
          onPress={nextPage}
          disabled={page >= totalPages}
          size={40}
          iconSize={20}
        />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  txList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  paginationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  pageIndicatorBox: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: t.background.subtle,
  },
  pageIndicatorText: {
    ...typography.caption,
    fontWeight: '600',
    color: t.text.secondary,
  },
}));
