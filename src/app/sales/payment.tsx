import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, InteractionManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { FonepayQrSheet } from '@/components/sales/FonepayQrSheet';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';
import { PaymentMode } from '@/types/payment';

export default function PaymentSelectionScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { currentSale, setPaymentMode, setPaymentStatus, completeSale } = useSaleContext();
  const [selectedMode, setSelectedMode] = useState<PaymentMode>('fonepay');
  const [qrVisible, setQrVisible] = useState(false);

  // Fonepay QR is selected by default, so its sheet should be open on arrival.
  // Presenting a native Modal while the previous screen's sheet is still
  // dismissing gets silently dropped (iOS especially), so wait for the push
  // transition to settle before opening it.
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setQrVisible((v) => v || selectedMode === 'fonepay');
    });
    return () => task.cancel();
    // Run once on mount — later mode switches open/close the sheet directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCash = () => {
    setSelectedMode('cash');
    setQrVisible(false);
  };

  const handleSelectFonepay = () => {
    setSelectedMode('fonepay');
    setQrVisible(true);
  };

  const handleCashPaid = () => {
    setPaymentMode('cash');
    setPaymentStatus('paid');
    completeSale();
    router.replace('/sales/bill');
  };

  const handleFonepayPaid = () => {
    setQrVisible(false);
    router.replace('/sales/bill');
  };

  const handleCloseQr = () => {
    setQrVisible(false);
    setSelectedMode('cash');
  };

  const renderOption = (
    mode: PaymentMode,
    icon: 'qr-code-outline' | 'cash-outline',
    title: string,
    description: string,
    onPress: () => void
  ) => {
    const on = selectedMode === mode;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.option, on && styles.optionOn]}>
        <View style={[styles.optionIcon, on && styles.optionIconOn]}>
          <Icon name={icon} size={22} color={on ? t.text.inverse : t.text.secondary} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionDesc}>{description}</Text>
        </View>
        <View style={[styles.radio, on && styles.radioOn]}>
          {on && <Icon name="checkmark" size={13} color={t.text.inverse} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Screen
        headerProps={{ title: 'Payment', showBack: true }}
        footer={
          selectedMode === 'cash' ? (
            <Button title="Mark as paid in cash" onPress={handleCashPaid} size="lg" />
          ) : undefined
        }>
        <View style={styles.amountBlock}>
          <Text style={styles.amountLabel}>Amount due</Text>
          <Text style={styles.amount}>{formatNPR(currentSale.netAmount)}</Text>
          <Text style={styles.amountMeta}>
            {currentSale.items.length === 1 ? '1 item' : `${currentSale.items.length} items`}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>How is the customer paying?</Text>

        <View style={styles.options}>
          {renderOption(
            'fonepay',
            'qr-code-outline',
            'Fonepay QR',
            'Customer scans · settles to your account',
            handleSelectFonepay
          )}
          {renderOption(
            'cash',
            'cash-outline',
            'Cash',
            'Collected at the counter',
            handleSelectCash
          )}
        </View>
      </Screen>

      <FonepayQrSheet
        visible={qrVisible}
        onClose={handleCloseQr}
        onPaid={handleFonepayPaid}
      />
    </>
  );
}

const useStyles = makeStyles((t, type) => ({
  amountBlock: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
    gap: 4,
  },
  amountLabel: {
    ...type.label,
    color: t.text.secondary,
  },
  amount: {
    ...type.display,
    fontSize: 36,
    lineHeight: 42,
    color: t.text.primary,
  },
  amountMeta: {
    ...type.invoiceNumber,
    fontFamily: Typography.family.mono,
    color: t.text.secondary,
  },
  sectionTitle: {
    ...type.sectionTitle,
    color: t.text.primary,
    marginBottom: Spacing.md,
  },
  options: {
    gap: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.card,
    padding: Spacing.lg,
    backgroundColor: t.background.surface,
  },
  optionOn: {
    borderWidth: 2,
    borderColor: t.brand.primary,
    backgroundColor: t.brand.subtle,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: t.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconOn: {
    backgroundColor: t.brand.primary,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...type.cardTitle,
    color: t.text.primary,
  },
  optionDesc: {
    ...type.caption,
    color: t.text.secondary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: t.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderWidth: 0,
    backgroundColor: t.brand.primary,
  },
}));
