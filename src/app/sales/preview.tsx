import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { BillPreview } from '@/components/bill/BillPreview';
import { Spacing } from '@/constants/spacing';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { formatNPR } from '@/utils/currency';

export default function BillPreviewScreen() {
  const router = useRouter();
  const { merchant } = useAppContext();
  const { currentSale } = useSaleContext();

  const handleEditBill = () => {
    router.back();
  };

  const handleConfirmAndPay = () => {
    router.push('/sales/payment');
  };

  return (
    <Screen
      headerProps={{
        title: 'Review Bill',
        subtitle: currentSale.invoiceNumber,
        showBack: true,
      }}
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Edit Bill"
            onPress={handleEditBill}
            variant="outline"
            fullWidth={false}
            size="lg"
            leftIcon={<Icon name="create-outline" size={20} color={Colors.primary} />}
            style={styles.editBtn}
          />
          <Button
            title={`Confirm • ${formatNPR(currentSale.netAmount)}`}
            onPress={handleConfirmAndPay}
            variant="primary"
            fullWidth={false}
            size="lg"
            rightIcon={<Icon name="arrow-forward" size={20} color={Colors.textInverse} />}
            style={styles.confirmBtn}
          />
        </View>
      }>
      <View style={styles.content}>
        <BillPreview sale={currentSale} merchant={merchant} isOfficial={false} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.xl,
  },
  footerRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  editBtn: {
    flex: 1,
  },
  confirmBtn: {
    flex: 2,
  },
});
