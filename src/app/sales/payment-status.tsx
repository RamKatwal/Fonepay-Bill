import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaleContext } from '@/store/SaleContext';
import { useAppContext } from '@/store/AppContext';
import { usePayment } from '@/hooks/usePayment';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { formatNPR } from '@/utils/currency';

export default function PaymentStatusScreen() {
  const router = useRouter();
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

  return (
    <Screen
      headerProps={{
        title: 'Fonepay Dynamic QR',
        subtitle: currentSale.invoiceNumber,
        showBack: paymentStatus !== 'paid',
      }}
      footer={
        paymentStatus === 'paid' ? (
          <Button
            title="Generate & View Official Bill"
            onPress={handleFinishSuccess}
            size="lg"
            variant="primary"
            rightIcon={<Icon name="arrow-forward" size={20} color={Colors.textInverse} />}
          />
        ) : undefined
      }>
      {/* QR & Status Card */}
      <Card variant="surface" style={styles.qrCard}>
        {/* Merchant & Fonepay Banner */}
        <View style={styles.brandRow}>
          <Text style={styles.merchantName}>{merchant.businessName}</Text>
          <Badge status="fonepay" label="Fonepay QR" size="sm" />
        </View>

        {/* Amount to Pay */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Scan to Pay</Text>
          <Text style={styles.amountText}>{formatNPR(currentSale.netAmount)}</Text>
          <Text style={styles.invoiceText}>Invoice #{currentSale.invoiceNumber}</Text>
        </View>

        {/* QR Code Placeholder Box */}
        <View style={styles.qrBox}>
          {isVerifying ? (
            <View style={styles.verifyingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.verifyingText}>Verifying Payment...</Text>
            </View>
          ) : paymentStatus === 'paid' ? (
            <View style={styles.paidOverlay}>
              <View style={styles.successCircle}>
                <Icon name="checkmark" size={42} color={Colors.textInverse} />
              </View>
              <Text style={styles.paidTitle}>Payment Received!</Text>
              <Text style={styles.paidSub}>Verified by Fonepay</Text>
            </View>
          ) : paymentStatus === 'failed' ? (
            <View style={styles.failedOverlay}>
              <View style={styles.failedCircle}>
                <Icon name="close" size={42} color={Colors.textInverse} />
              </View>
              <Text style={styles.failedTitle}>Payment Failed</Text>
              <Text style={styles.failedSub}>Customer cancelled or timed out</Text>
            </View>
          ) : (
            <View style={styles.qrVisual}>
              <Icon name="qr-code-outline" size={160} color={Colors.text} />
              <Text style={styles.qrScanHint}>Ask customer to scan with any bank/wallet app</Text>
            </View>
          )}
        </View>

        {/* Current Status Indicator */}
        <View style={styles.statusIndicatorRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Badge status={paymentStatus} size="md" />
        </View>
      </Card>

      {/* Prototype Presenter Controls */}
      <Card variant="accent" style={styles.prototypeControlCard}>
        <View style={styles.controlHeaderRow}>
          <Icon name="information-circle-outline" size={18} color={Colors.primary} />
          <Text style={styles.controlTitle}>Prototype Simulator Controls</Text>
        </View>
        <Text style={styles.controlDesc}>
          Simulate the merchant receiving instant notification from Fonepay:
        </Text>

        <View style={styles.controlButtons}>
          <Button
            title="Simulate: Customer Paid"
            onPress={simulateSuccess}
            loading={isVerifying}
            disabled={isVerifying || paymentStatus === 'paid'}
            variant="primary"
            size="md"
            leftIcon={<Icon name="checkmark-circle" size={18} color={Colors.textInverse} />}
          />

          <View style={styles.controlSubButtons}>
            <Button
              title="Simulate Failure"
              onPress={simulateFailure}
              disabled={isVerifying || paymentStatus === 'paid'}
              variant="danger"
              size="sm"
              fullWidth={false}
              style={styles.subBtn}
            />
            <Button
              title="Reset QR"
              onPress={resetSimulatedPayment}
              disabled={isVerifying || paymentStatus === 'pending'}
              variant="outline"
              size="sm"
              fullWidth={false}
              style={styles.subBtn}
            />
          </View>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  qrCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  merchantName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  amountLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  amountText: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.heavy,
    color: Colors.primary,
    marginBottom: 2,
  },
  invoiceText: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  qrBox: {
    width: 240,
    height: 240,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  qrVisual: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrScanHint: {
    fontSize: Typography.size.xxs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  verifyingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  verifyingText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  paidOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  paidTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.successText,
    marginBottom: 2,
  },
  paidSub: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  failedOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  failedCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.failed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  failedTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.failedText,
    marginBottom: 2,
  },
  failedSub: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  prototypeControlCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  controlHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  controlTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.primaryDark,
  },
  controlDesc: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  controlButtons: {
    gap: Spacing.sm,
  },
  controlSubButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  subBtn: {
    flex: 1,
  },
});
