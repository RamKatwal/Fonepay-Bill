import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';

export default function SaleSuccessScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { currentSale } = useSaleContext();

  const isCash = currentSale.paymentMode === 'cash';
  const title = isCash ? 'Bill generated' : 'Payment received';
  const subtitle = isCash
    ? 'Cash collected and the bill is recorded against your Fonepay merchant account.'
    : 'Fonepay confirmed the transfer. The bill is marked paid and saved to your history.';

  return (
    <Screen
      scrollable={false}
      footer={
        <View style={styles.footerCol}>
          <Button
            title="View & share bill"
            onPress={() => router.push('/sales/bill')}
            size="lg"
            variant="primary"
            rightIcon={
              <Icon name="document-text-outline" size={20} color={t.text.inverse} />
            }
          />
          <View style={styles.linkRow}>
            <Text onPress={() => router.replace('/dashboard' as any)} style={styles.link}>
              Back to dashboard
            </Text>
          </View>
        </View>
      }>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Icon name="checkmark" size={38} color={t.status.success} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.amountBox}>
          <Text style={styles.amount}>{formatNPR(currentSale.netAmount)}</Text>
          <Text style={styles.meta}>
            {currentSale.invoiceNumber} · {currentSale.transactionId}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((t, type) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: t.status.successBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    ...type.screenTitle,
    color: t.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...type.body,
    fontSize: 13,
    color: t.text.secondary,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 19,
  },
  amountBox: {
    marginTop: Spacing.sm,
    backgroundColor: t.background.subtle,
    borderRadius: radius.card,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    gap: 4,
  },
  amount: {
    ...type.display,
    color: t.text.primary,
  },
  meta: {
    ...type.invoiceNumber,
    fontFamily: Typography.family.mono,
    color: t.text.secondary,
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
    ...type.bodySmall,
    fontWeight: '600',
    color: t.text.secondary,
    textDecorationLine: 'underline',
    padding: 4,
  },
}));
