import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { BillPreview } from '@/components/bill/BillPreview';
import { Spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';

export default function BillPreviewScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { merchant } = useAppContext();
  const { currentSale } = useSaleContext();

  return (
    <Screen
      backgroundColor={t.background.subtle}
      headerProps={{
        title: 'Bill preview',
        showBack: true,
      }}
      footer={
        <View style={styles.footerCol}>
          <Button
            title="Confirm · choose payment"
            onPress={() => router.push('/sales/payment')}
            variant="primary"
            size="lg"
          />
          <View style={styles.linkRow}>
            <Text onPress={() => router.back()} style={styles.link}>
              Edit items
            </Text>
          </View>
        </View>
      }>
      <View style={styles.content}>
        <BillPreview sale={currentSale} merchant={merchant} isOfficial={false} />
      </View>
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
