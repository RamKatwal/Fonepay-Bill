import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { BillPreview } from '@/components/bill/BillPreview';
import { ShareBillModal } from '@/components/bill/ShareBillModal';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Icon } from '@/components/ui/Icon';

export default function GeneratedBillScreen() {
  const router = useRouter();
  const { merchant } = useAppContext();
  const { currentSale, resetSale } = useSaleContext();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const handleShareBill = () => {
    setIsShareModalVisible(true);
  };

  const handleBackToDashboard = () => {
    resetSale();
    router.replace('/dashboard' as any);
  };

  return (
    <Screen
      headerProps={{
        title: 'Tax Invoice',
        subtitle: currentSale.invoiceNumber,
        showBack: false,
      }}
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Share Bill"
            onPress={handleShareBill}
            variant="outline"
            fullWidth={false}
            size="lg"
            leftIcon={<Icon name="share-social-outline" size={20} color={Colors.primary} />}
            style={styles.shareBtn}
          />
          <Button
            title="Back to Dashboard"
            onPress={handleBackToDashboard}
            variant="primary"
            fullWidth={false}
            size="lg"
            style={styles.doneBtn}
          />
        </View>
      }>
      <View style={styles.content}>
        <BillPreview sale={currentSale} merchant={merchant} isOfficial={true} />
      </View>

      <ShareBillModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        sale={currentSale}
        merchant={merchant}
        isOfficial={true}
      />
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
  shareBtn: {
    flex: 1,
  },
  doneBtn: {
    flex: 1.5,
  },
});
