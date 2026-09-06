import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useShareBill } from '@/hooks/useShareBill';
import { Screen } from '@/components/layout/Screen';
import { PrimaryButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { BillPreview } from '@/components/bill/BillPreview';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spacing } from '@/constants/spacing';
import { makeStyles, useTheme } from '@/theme';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles = useStyles();
  const t = useTheme();
  const { merchant } = useAppContext();
  const { getTransactionById } = useTransactions();
  const { shareBill, isSharing } = useShareBill();

  const transaction = id ? getTransactionById(id) : undefined;

  if (!transaction) {
    return (
      <Screen headerProps={{ title: 'Transaction', showBack: true }}>
        <EmptyState
          icon="alert-circle-outline"
          title="Transaction not found"
          description="The requested transaction could not be located in your sales records."
        />
      </Screen>
    );
  }

  return (
    <Screen
      backgroundColor={t.background.subtle}
      headerProps={{
        title: transaction.invoiceNumber,
        subtitle: `${transaction.date} • ${transaction.time}`,
        showBack: true,
      }}
      footer={
        <PrimaryButton
          title={isSharing ? 'Preparing PDF…' : 'Share'}
          onPress={() => shareBill(transaction.saleDetails, merchant, true)}
          loading={isSharing}
          disabled={isSharing}
          size="lg"
          leftIcon={
            isSharing ? undefined : (
              <Icon name="share-outline" size={20} color={t.text.inverse} />
            )
          }
        />
      }>
      <View style={styles.container}>
        <BillPreview sale={transaction.saleDetails} merchant={merchant} isOfficial />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    paddingBottom: Spacing.xxxl,
  },
}));
