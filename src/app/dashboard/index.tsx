import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useSaleContext } from '@/store/SaleContext';
import { useTransactions } from '@/hooks/useTransactions';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { PrimaryButton } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Icon } from '@/components/ui/Icon';
import { MerchantInfoCard } from '@/components/merchant/MerchantInfoCard';
import { SalesSummaryCard } from '@/components/sales/SalesSummaryCard';
import { TransactionCard } from '@/components/history/TransactionCard';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function DashboardScreen() {
  const router = useRouter();
  const { merchant } = useAppContext();
  const { initNewSale } = useSaleContext();
  const { recentTransactions, todaySummary } = useTransactions();

  const handleCreateSales = () => {
    initNewSale();
    router.push('/sales' as any);
  };

  const handleViewAllHistory = () => {
    router.push('/history' as any);
  };

  const handleOpenTransaction = (id: string) => {
    router.push(`/history/${id}` as any);
  };

  const handleOpenProfile = () => {
    router.push('/profile' as any);
  };

  return (
    <Screen
      headerProps={{
        title: 'Merchant Dashboard',
        subtitle: merchant.businessName,
        rightAction: (
          <IconButton
            icon="person-circle-outline"
            size={40}
            iconSize={26}
            color={colors.brand.primary}
            onPress={handleOpenProfile}
            accessibilityLabel="Merchant Profile"
          />
        ),
      }}
      footer={
        <PrimaryButton
          title="Create Sales"
          onPress={handleCreateSales}
          size="lg"
          leftIcon={<Icon name="add" size={24} color={colors.text.inverse} />}
        />
      }>
      {/* 1. Verified Merchant Info Card (Read-only Fonepay pattern) */}
      <MerchantInfoCard merchant={merchant} compact style={styles.cardSpacing} />

      {/* 2. Today's Financial Sales Summary Card */}
      <SalesSummaryCard
        totalVolume={todaySummary.totalVolume}
        totalSalesCount={todaySummary.totalSalesCount}
        fonepayVolume={todaySummary.fonepayVolume}
        cashVolume={todaySummary.cashVolume}
        style={styles.cardSpacing}
      />

      {/* 3. Section Header for Recent Sales */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Sales (Latest 10)</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleViewAllHistory}
          style={styles.viewAllButton}
          accessibilityRole="button"
          accessibilityLabel="View All Sales History">
          <Text style={styles.viewAllText}>View All History</Text>
          <Icon name="chevron-forward" size={16} color={colors.brand.primary} />
        </TouchableOpacity>
      </View>

      {/* 4. Recent Transactions List using TransactionCard pattern */}
      <View style={styles.transactionsList}>
        {recentTransactions.map((tx) => (
          <TransactionCard
            key={tx.id}
            transaction={tx}
            onPress={() => handleOpenTransaction(tx.id)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardSpacing: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.xs,
  },
  viewAllText: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.brand.primary,
  },
  transactionsList: {
    gap: spacing.sm,
  },
});
