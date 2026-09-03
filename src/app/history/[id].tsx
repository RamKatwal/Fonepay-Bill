import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useTransactions } from '@/hooks/useTransactions';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { BillPreview } from '@/components/bill/BillPreview';
import { ShareBillModal } from '@/components/bill/ShareBillModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Icon } from '@/components/ui/Icon';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { merchant } = useAppContext();
  const { getTransactionById } = useTransactions();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const transaction = id ? getTransactionById(id) : undefined;

  if (!transaction) {
    return (
      <Screen
        headerProps={{
          title: 'Transaction Details',
          showBack: true,
        }}>
        <EmptyState
          icon="alert-circle"
          title="Transaction Not Found"
          description="The requested transaction could not be located in your sales records."
        />
      </Screen>
    );
  }

  const handleShare = () => {
    setIsShareModalVisible(true);
  };

  return (
    <Screen
      headerProps={{
        title: transaction.invoiceNumber,
        subtitle: `${transaction.date} • ${transaction.time}`,
        showBack: true,
      }}
      footer={
        <Button
          title="Share Receipt Copy"
          onPress={handleShare}
          size="lg"
          variant="outline"
          leftIcon={<Icon name="share-social-outline" size={20} color={Colors.primary} />}
        />
      }>
      <View style={styles.container}>
        <BillPreview
          sale={transaction.saleDetails}
          merchant={merchant}
          isOfficial={transaction.paymentStatus === 'paid'}
        />
      </View>

      <ShareBillModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        sale={transaction.saleDetails}
        merchant={merchant}
        isOfficial={transaction.paymentStatus === 'paid'}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
});
