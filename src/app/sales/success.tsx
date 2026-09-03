import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { formatNPR } from '@/utils/currency';

export default function SaleSuccessScreen() {
  const router = useRouter();
  const { currentSale } = useSaleContext();

  const handleViewBill = () => {
    router.push('/sales/bill');
  };

  const handleDone = () => {
    router.replace('/dashboard' as any);
  };

  return (
    <Screen
      scrollable={false}
      footer={
        <View style={styles.footerCol}>
          <Button
            title="View & Share Official Bill"
            onPress={handleViewBill}
            size="lg"
            variant="primary"
            rightIcon={<Icon name="document-text-outline" size={20} color={Colors.textInverse} />}
          />
          <Button
            title="Done / Back to Dashboard"
            onPress={handleDone}
            size="md"
            variant="ghost"
            style={styles.ghostBtn}
          />
        </View>
      }>
      <View style={styles.container}>
        {/* Animated / Celebratory Check Circle */}
        <View style={styles.successIconCircle}>
          <Icon name="checkmark" size={56} color={Colors.textInverse} />
        </View>

        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successSubtitle}>
          The digital bill has been generated and saved to sales history.
        </Text>

        <Card variant="surface" style={styles.receiptCard}>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Amount Received</Text>
            <Text style={styles.amountValue}>{formatNPR(currentSale.netAmount)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Invoice Number</Text>
            <Text style={styles.detailValueBold}>{currentSale.invoiceNumber}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Mode</Text>
            <Badge status={currentSale.paymentMode || 'cash'} size="sm" />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValueMono}>{currentSale.transactionId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {currentSale.invoiceDate} • {currentSale.invoiceTime}
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.heavy,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
    marginBottom: Spacing.xxl,
  },
  receiptCard: {
    width: '100%',
    padding: Spacing.lg,
    maxWidth: 380,
  },
  amountBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  amountLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.heavy,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: Typography.size.xs,
    color: Colors.text,
  },
  detailValueBold: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  detailValueMono: {
    fontSize: Typography.size.xs,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
  },
  footerCol: {
    gap: Spacing.xs,
  },
  ghostBtn: {
    marginTop: 2,
  },
});
