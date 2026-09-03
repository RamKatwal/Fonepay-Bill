import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTransactions } from '@/hooks/useTransactions';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { formatNPR } from '@/utils/currency';
import { PaymentMode } from '@/types/payment';

export default function SalesHistoryScreen() {
  const router = useRouter();
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

  return (
    <Screen
      headerProps={{
        title: 'Sales History',
        subtitle: `${totalCount} Total Transactions`,
        showBack: true,
      }}>
      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setModeFilter('all')}
          style={[styles.filterChip, modeFilter === 'all' && styles.filterChipActive]}>
          <Text
            style={[
              styles.filterText,
              modeFilter === 'all' && styles.filterTextActive,
            ]}>
            All Sales
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModeFilter('fonepay')}
          style={[styles.filterChip, modeFilter === 'fonepay' && styles.filterChipActive]}>
          <Text
            style={[
              styles.filterText,
              modeFilter === 'fonepay' && styles.filterTextActive,
            ]}>
            Fonepay QR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModeFilter('cash')}
          style={[styles.filterChip, modeFilter === 'cash' && styles.filterChipActive]}>
          <Text
            style={[
              styles.filterText,
              modeFilter === 'cash' && styles.filterTextActive,
            ]}>
            Cash
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No Transactions Found"
          description="There are no sales transactions matching the selected filter."
        />
      ) : (
        <View style={styles.txList}>
          {filteredTransactions.map((tx) => (
            <Card
              key={tx.id}
              variant="surface"
              padding="sm"
              style={styles.txCard}
              onPress={() => handleOpenTransaction(tx.id)}>
              <View style={styles.txRow}>
                <View style={styles.iconBox}>
                  <Icon
                    name={tx.paymentMode === 'fonepay' ? 'qr-code-outline' : 'cash-outline'}
                    size={20}
                    color={tx.paymentMode === 'fonepay' ? Colors.fonepayText : Colors.cashText}
                  />
                </View>

                <View style={styles.txContent}>
                  <View style={styles.topRow}>
                    <Text style={styles.invoiceNo}>{tx.invoiceNumber}</Text>
                    <Text style={styles.amount}>{formatNPR(tx.amount)}</Text>
                  </View>

                  <View style={styles.bottomRow}>
                    <Text style={styles.timeText}>
                      {tx.date} • {tx.time}
                    </Text>
                    <View style={styles.badgeRow}>
                      <Badge status={tx.paymentMode} size="sm" />
                      <Badge status={tx.paymentStatus} size="sm" />
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Local Pagination Bar (10 per page) */}
      <View style={styles.paginationBar}>
        <IconButton
          icon="chevron-back"
          onPress={prevPage}
          disabled={page <= 1}
          size={40}
          iconSize={20}
          backgroundColor={Colors.surface}
          borderColor={Colors.border}
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
          backgroundColor={Colors.surface}
          borderColor={Colors.border}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.textInverse,
  },
  txList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  txCard: {
    marginBottom: 0,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  invoiceNo: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  amount: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 4,
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
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  pageIndicatorText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
  },
});
