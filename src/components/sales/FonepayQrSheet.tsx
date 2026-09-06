import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '@/store/AppContext';
import { useSaleContext } from '@/store/SaleContext';
import { usePayment } from '@/hooks/usePayment';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { Typography } from '@/constants/typography';
import { shadows } from '@/constants/shadows';
import { motion } from '@/constants/motion';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';

/** How long the success tick stays visible before navigating to the bill. */
const SUCCESS_HOLD_MS = 1400;

interface FonepayQrSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Called after payment is confirmed and the sale is finalized. */
  onPaid: () => void;
}

/**
 * Fonepay QR payment as a bottom overlay. On confirm, shows a brief success
 * animation then finalizes the bill via `onPaid`.
 */
export function FonepayQrSheet({ visible, onClose, onPaid }: FonepayQrSheetProps) {
  const styles = useStyles();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { currentSale, completeSale, setPaymentMode, setPaymentStatus } = useSaleContext();
  const { merchant } = useAppContext();
  const {
    paymentStatus,
    isVerifying,
    simulateSuccess,
    simulateFailure,
    resetSimulatedPayment,
  } = usePayment();

  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;

    setPaymentMode('fonepay');
    setPaymentStatus('pending');
    resetSimulatedPayment();
    checkScale.setValue(0);
    checkOpacity.setValue(0);
    pillOpacity.setValue(0);

    return () => {
      if (navigateTimer.current) clearTimeout(navigateTimer.current);
    };
  }, [
    visible,
    setPaymentMode,
    setPaymentStatus,
    resetSimulatedPayment,
    checkScale,
    checkOpacity,
    pillOpacity,
  ]);

  const playSuccessAnimation = () => {
    checkScale.setValue(0.4);
    checkOpacity.setValue(0);
    pillOpacity.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: motion.duration.fast,
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 5,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(pillOpacity, {
        toValue: 1,
        duration: motion.duration.normal,
        delay: motion.duration.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSimulateSuccess = async () => {
    await simulateSuccess();
    playSuccessAnimation();
    completeSale();

    if (navigateTimer.current) clearTimeout(navigateTimer.current);
    navigateTimer.current = setTimeout(() => {
      onPaid();
    }, SUCCESS_HOLD_MS);
  };

  const handleClose = () => {
    if (paymentStatus === 'paid' || isVerifying) return;
    onClose();
  };

  const paid = paymentStatus === 'paid';
  const failed = paymentStatus === 'failed';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, Spacing.xl) },
          ]}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Fonepay QR</Text>
            {!paid && (
              <Pressable onPress={handleClose} hitSlop={8}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}>
            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>{paid ? 'Received' : 'Requesting'}</Text>
              <Text style={styles.amount}>{formatNPR(currentSale.netAmount)}</Text>
              <Text style={styles.amountMeta}>
                {currentSale.items.length === 1
                  ? '1 item'
                  : `${currentSale.items.length} items`}
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
                  <Animated.View
                    style={[
                      styles.qrOverlay,
                      { opacity: checkOpacity, transform: [{ scale: checkScale }] },
                    ]}>
                    <View style={styles.paidCircle}>
                      <Icon name="checkmark" size={42} color={t.status.success} />
                    </View>
                    <Text style={styles.paidTitle}>Payment received</Text>
                  </Animated.View>
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
              {!paid && <Text style={styles.merchantName}>{merchant.businessName}</Text>}
            </View>

            <View style={styles.statusWrap}>
              {paid ? (
                <Animated.View
                  style={[
                    styles.statusPill,
                    { backgroundColor: t.status.successBackground, opacity: pillOpacity },
                  ]}>
                  <Icon name="checkmark-circle" size={14} color={t.status.success} />
                  <Text style={[styles.statusText, { color: t.status.success }]}>
                    Generating bill…
                  </Text>
                </Animated.View>
              ) : failed ? (
                <View style={[styles.statusPill, { backgroundColor: t.status.errorBackground }]}>
                  <Icon name="close-circle" size={14} color={t.status.error} />
                  <Text style={[styles.statusText, { color: t.status.error }]}>
                    Payment failed
                  </Text>
                </View>
              ) : (
                <View
                  style={[styles.statusPill, { backgroundColor: t.status.pendingBackground }]}>
                  <View style={styles.pendingDot} />
                  <Text style={[styles.statusText, { color: t.status.pending }]}>
                    Waiting for payment
                  </Text>
                </View>
              )}
            </View>

            {!paid && (
              <View style={styles.actions}>
                <Button
                  title="Simulate payment received"
                  onPress={handleSimulateSuccess}
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
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const useStyles = makeStyles((t, type) => ({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: t.overlay,
  },
  sheet: {
    backgroundColor: t.background.elevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    maxHeight: '92%',
    ...shadows.elevated,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: t.border.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: Spacing.md,
  },
  title: {
    ...type.screenTitle,
    fontSize: 18,
    color: t.text.primary,
  },
  cancel: {
    ...type.bodyMedium,
    color: t.text.secondary,
    padding: 4,
  },
  body: {
    gap: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  amountBlock: {
    alignItems: 'center',
    gap: 3,
  },
  amountLabel: {
    ...type.label,
    color: t.text.secondary,
  },
  amount: {
    ...type.display,
    fontSize: 34,
    lineHeight: 40,
    color: t.text.primary,
  },
  amountMeta: {
    ...type.invoiceNumber,
    fontFamily: Typography.family.mono,
    color: t.text.secondary,
  },
  qrCard: {
    alignSelf: 'center',
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
    ...type.bodyMedium,
    color: t.text.secondary,
  },
  paidCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: t.status.successBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidTitle: {
    ...type.sectionTitle,
    color: t.status.success,
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
    ...type.caption,
    fontWeight: '600',
    color: t.text.secondary,
  },
  statusWrap: {
    alignItems: 'center',
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
    ...type.caption,
    fontWeight: '700',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: t.status.pending,
  },
  actions: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
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
  linkDanger: {
    color: t.status.error,
  },
}));
