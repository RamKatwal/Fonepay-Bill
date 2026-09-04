import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { PrimaryButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { BillPreview } from '@/components/bill/BillPreview';
import { ShareBillModal } from '@/components/bill/ShareBillModal';
import { Spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';

export default function GeneratedBillScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { merchant } = useAppContext();
  const { currentSale, resetSale } = useSaleContext();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const handleBackToDashboard = () => {
    resetSale();
    router.replace('/dashboard' as any);
  };

  return (
    <Screen
      backgroundColor={t.background.subtle}
      headerProps={{
        title: 'Bill',
        subtitle: currentSale.invoiceNumber,
        showBack: false,
      }}
      footer={
        <View style={styles.footerCol}>
          <PrimaryButton
            title="Share"
            onPress={() => setIsShareModalVisible(true)}
            size="lg"
            leftIcon={<Icon name="share-outline" size={20} color={t.text.inverse} />}
          />
          <View style={styles.linkRow}>
            <Text onPress={handleBackToDashboard} style={styles.link}>
              Back to dashboard
            </Text>
          </View>
        </View>
      }>
      <View style={styles.content}>
        <BillPreview sale={currentSale} merchant={merchant} isOfficial />
      </View>

      <ShareBillModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        sale={currentSale}
        merchant={merchant}
        isOfficial
      />
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  content: {
    paddingBottom: Spacing.xl,
  },
  footerCol: {
    width: '100%',
    gap: Spacing.xs,
  },
  linkRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  link: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: t.text.secondary,
    textDecorationLine: 'underline',
    padding: 4,
  },
}));
