import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useSaleContext } from '@/store/SaleContext';
import { useTransactions } from '@/hooks/useTransactions';
import { Screen } from '@/components/layout/Screen';
import { PrimaryButton } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Icon } from '@/components/ui/Icon';
import { SalesSummaryCard } from '@/components/sales/SalesSummaryCard';
import { TransactionCard } from '@/components/history/TransactionCard';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
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
        title: 'Dashboard',
        subtitle: merchant.businessName,
        showBack: true,
        rightAction: (
          <IconButton
            icon="person-circle-outline"
            size={40}
            iconSize={26}
            color={t.text.primary}
            onPress={handleOpenProfile}
            accessibilityLabel="Merchant profile"
          />
        ),
      }}
      footer={
        <PrimaryButton
          title="Create sale"
          onPress={handleCreateSales}
          size="lg"
          leftIcon={<Icon name="add" size={22} color={t.text.inverse} />}
        />
      }>
      <SalesSummaryCard
        totalVolume={todaySummary.totalVolume}
        totalSalesCount={todaySummary.totalSalesCount}
        fonepayVolume={todaySummary.fonepayVolume}
        cashVolume={todaySummary.cashVolume}
        style={styles.cardSpacing}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent sales</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleViewAllHistory}
          style={styles.viewAllButton}
          accessibilityRole="button"
          accessibilityLabel="View all sales history">
          <Text style={styles.viewAllText}>View all</Text>
          <Icon name="chevron-forward" size={15} color={t.brand.primary} />
        </TouchableOpacity>
      </View>

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

const useStyles = makeStyles((t) => ({
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
    color: t.text.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.xs,
  },
  viewAllText: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: t.brand.primary,
    textDecorationLine: 'underline',
  },
  transactionsList: {
    gap: spacing.sm,
  },
}));
