import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaleContext } from '@/store/SaleContext';
import { useAppContext } from '@/store/AppContext';
import { usePayment } from '@/hooks/usePayment';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography, Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';

export default function PaymentStatusScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { currentSale, completeSale } = useSaleContext();
  const { merchant } = useAppContext();
  const {
    paymentStatus,
    isVerifying,
    simulateSuccess,
    simulateFailure,
    resetSimulatedPayment,
  } = usePayment();

  const handleFinishSuccess = () => {
    completeSale();
    router.replace('/sales/success');
  };

  const paid = paymentStatus === 'paid';
  const failed = paymentStatus === 'failed';

  return (
    <Screen
      headerProps={{ title: 'Fonepay QR', showBack: !paid }}
      backgroundColor={t.background.subtle}
      footer={
        paid ? (
          <Button
            title="Generate official bill"
            onPress={handleFinishSuccess}
            size="lg"
            rightIcon={<Icon name="arrow-forward" size={20} color={t.text.inverse} />}
          />
        ) : (
          <View style={styles.footerCol}>
            <Button
              title="Simulate payment received"
              onPress={simulateSuccess}
              loading={isVerifying}
              disabled={isVerifying}
              variant="outline"
              size="lg"
            />
            <View style={styles.linkRow}>
              {failed ? (
                <Text onPress={resetSimulatedPayment} style={styles.link}>
                  Reset QR
                </Text>
              ) : (
                <Text
                  onPress={isVerifying ? undefined : simulateFailure}
                  style={[styles.link, styles.linkDanger]}>
                  Cancel payment request
                </Text>
              )}
            </View>
          </View>
        )
      }>
      <View style={styles.amountBlock}>
        <Text style={styles.amountLabel}>Requesting</Text>
        <Text style={styles.amount}>{formatNPR(currentSale.netAmount)}</Text>
        <Text style={styles.amountMeta}>
          {currentSale.items.length === 1 ? '1 item' : `${currentSale.items.length} items`}
        </Text>
      </View>

      <View style={styles.qrCard}>
        <View style={styles.qrBox}>
          {isVerifying ? (
            <View style={styles.qrOverlay}>
              <ActivityIndicator size="large" color={t.text.secondary} />
              <Text style={styles.qrOverlayText}>Verifying payment…</Text>
            </View>
          ) : paid ? (
            <View style={styles.qrOverlay}>
              <View style={styles.paidCircle}>
                <Icon name="checkmark" size={34} color={t.status.success} />
              </View>
            </View>
          ) : failed ? (
            <View style={styles.qrOverlay}>
              <View style={styles.failedCircle}>
                <Icon name="close" size={34} color={t.status.error} />
              </View>
            </View>
          ) : (
            <Icon name="qr-code" size={168} color={t.text.primary} />
          )}
        </View>
        <Text style={styles.merchantName}>{merchant.businessName}</Text>
      </View>

      <View style={styles.statusWrap}>
        {paid ? (
          <View style={[styles.statusPill, { backgroundColor: t.status.successBackground }]}>
            <Icon name="checkmark-circle" size={14} color={t.status.success} />
            <Text style={[styles.statusText, { color: t.status.success }]}>Payment received</Text>
          </View>
        ) : failed ? (
          <View style={[styles.statusPill, { backgroundColor: t.status.errorBackground }]}>
            <Icon name="close-circle" size={14} color={t.status.error} />
            <Text style={[styles.statusText, { color: t.status.error }]}>Payment failed</Text>
          </View>
        ) : (
          <View style={[styles.statusPill, { backgroundColor: t.status.pendingBackground }]}>
            <View style={styles.pendingDot} />
            <Text style={[styles.statusText, { color: t.status.pending }]}>
              Waiting for payment
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.helper}>
        Ask the customer to scan with any Fonepay-enabled mobile banking or wallet app.
        This bill updates the moment payment settles.
      </Text>
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  amountBlock: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    gap: 3,
  },
  amountLabel: {
    ...typography.label,
    color: t.text.secondary,
  },
  amount: {
    ...typography.display,
    fontSize: 34,
    lineHeight: 40,
    color: t.text.primary,
  },
  amountMeta: {
    ...typography.invoiceNumber,
    fontFamily: Typography.family.mono,
    color: t.text.secondary,
  },
  qrCard: {
    alignSelf: 'center',
    marginTop: Spacing.lg,
    backgroundColor: t.background.surface,
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.card,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  qrBox: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  qrOverlayText: {
    ...typography.bodyMedium,
    color: t.text.secondary,
  },
  paidCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: t.status.successBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  failedCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: t.status.errorBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantName: {
    ...typography.caption,
    fontWeight: '600',
    color: t.text.secondary,
  },
  statusWrap: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: t.status.pending,
  },
  helper: {
    ...typography.caption,
    color: t.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
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
  linkDanger: {
    color: t.status.error,
  },
}));
