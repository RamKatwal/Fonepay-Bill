import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { formatNPR } from '@/utils/currency';
import { PaymentMode } from '@/types/payment';

export default function PaymentSelectionScreen() {
  const router = useRouter();
  const { currentSale, setPaymentMode, setPaymentStatus, completeSale } = useSaleContext();
  const [selectedMode, setSelectedMode] = useState<PaymentMode>('fonepay');

  const handleContinuePayment = () => {
    if (selectedMode === 'cash') {
      setPaymentMode('cash');
      setPaymentStatus('paid');
      completeSale();
      router.replace('/sales/success');
    } else {
      setPaymentMode('fonepay');
      setPaymentStatus('pending');
      router.push('/sales/payment-status');
    }
  };

  return (
    <Screen
      headerProps={{
        title: 'Payment Method',
        subtitle: currentSale.invoiceNumber,
        showBack: true,
      }}
      footer={
        <Button
          title={
            selectedMode === 'cash'
              ? `Confirm Cash Received • ${formatNPR(currentSale.netAmount)}`
              : `Continue to Fonepay QR • ${formatNPR(currentSale.netAmount)}`
          }
          onPress={handleContinuePayment}
          size="lg"
          rightIcon={<Icon name="arrow-forward" size={20} color={Colors.textInverse} />}
        />
      }>
      {/* Bill Total Card */}
      <Card variant="accent" style={styles.amountCard}>
        <Text style={styles.amountLabel}>Total Payable Amount</Text>
        <Text style={styles.amountValue}>{formatNPR(currentSale.netAmount)}</Text>
        <Text style={styles.invoiceMeta}>
          Invoice {currentSale.invoiceNumber} • {currentSale.items.length} Items
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Select Payment Mode</Text>

      {/* Payment Options */}
      <View style={styles.optionsList}>
        {/* Fonepay QR Option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedMode('fonepay')}
          style={[
            styles.optionCard,
            selectedMode === 'fonepay' && styles.optionCardSelected,
          ]}>
          <View style={styles.radioBox}>
            <View
              style={[
                styles.radioOuter,
                selectedMode === 'fonepay' && styles.radioOuterSelected,
              ]}>
              {selectedMode === 'fonepay' && <View style={styles.radioInner} />}
            </View>
          </View>

          <View style={styles.optionIconContainerFonepay}>
            <Icon name="qr-code-outline" size={26} color={Colors.fonepayText} />
          </View>

          <View style={styles.optionTextContainer}>
            <View style={styles.optionTitleRow}>
              <Text style={styles.optionTitle}>Fonepay QR</Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Digital</Text>
              </View>
            </View>
            <Text style={styles.optionDescription}>
              Customer scans dynamic QR code from any mobile banking or wallet app
            </Text>
          </View>
        </TouchableOpacity>

        {/* Cash Option */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedMode('cash')}
          style={[
            styles.optionCard,
            selectedMode === 'cash' && styles.optionCardSelected,
          ]}>
          <View style={styles.radioBox}>
            <View
              style={[
                styles.radioOuter,
                selectedMode === 'cash' && styles.radioOuterSelected,
              ]}>
              {selectedMode === 'cash' && <View style={styles.radioInner} />}
            </View>
          </View>

          <View style={styles.optionIconContainerCash}>
            <Icon name="cash-outline" size={26} color={Colors.cashText} />
          </View>

          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Cash Payment</Text>
            <Text style={styles.optionDescription}>
              Customer pays cash in person. Confirm payment and generate official bill.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  amountCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  amountLabel: {
    fontSize: Typography.size.xs,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
    fontWeight: Typography.weight.semibold,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.heavy,
    color: Colors.primary,
    marginBottom: 4,
  },
  invoiceMeta: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsList: {
    gap: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  radioBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  optionIconContainerFonepay: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.fonepaySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconContainerCash: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cashSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  optionTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  recommendedBadge: {
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  recommendedText: {
    fontSize: Typography.size.xxs,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
