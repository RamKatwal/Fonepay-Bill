import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, InteractionManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { useSaleContext } from '@/store/SaleContext';
import { useItemHistory } from '@/store/ItemHistoryContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { BillPreview } from '@/components/bill/BillPreview';
import { ItemNameField } from '@/components/sales/ItemNameField';
import { SaleLineItem } from '@/components/sales/SaleLineItem';
import { SaleDateSheet } from '@/components/sales/SaleDateSheet';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { Icon } from '@/components/ui/Icon';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';
import { getCurrentDateFormatted } from '@/utils/invoice';
import { lightTick } from '@/utils/haptics';

export default function CreateSaleScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { merchant } = useAppContext();
  const {
    currentSale,
    addItem,
    updateItem,
    removeItem,
    setDiscount,
    setSaleDate,
    hasItems,
    isValidToPreview,
  } = useSaleContext();
  const { recordItem } = useItemHistory();

  // Add / edit item sheet — open after mount so the slide-up animation plays
  const [sheetVisible, setSheetVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [dateSheetVisible, setDateSheetVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftQty, setDraftQty] = useState('1');
  const [draftRate, setDraftRate] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const nameRef = useRef<TextInput>(null);
  const qtyRef = useRef<TextInput>(null);
  const rateRef = useRef<TextInput>(null);
  /** When false, programmatic qty focus won't open the keyboard. */
  const [qtySoftInputOnFocus, setQtySoftInputOnFocus] = useState(true);
  const quietQtyFocusPending = useRef(false);

  // Discount — flat rupee amount off the subtotal.
  const [discInput, setDiscInput] = useState('');

  const qtyN = Math.max(1, parseInt(draftQty, 10) || 1);
  const rateN = parseFloat(draftRate) || 0;
  const lineAmount = qtyN * rateN;

  const { subtotal } = currentSale;

  // Slide the add-item sheet up once the create-sale transition settles.
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setSheetVisible(true);
    });
    return () => task.cancel();
  }, []);

  // Keep the sale's discount in sync with the input, clamped to the subtotal.
  useEffect(() => {
    const v = parseFloat(discInput) || 0;
    const amount = Math.max(0, Math.min(Math.round(v * 100) / 100, subtotal));
    setDiscount(amount);
  }, [discInput, subtotal, setDiscount]);

  useEffect(() => {
    if (!qtySoftInputOnFocus && quietQtyFocusPending.current) {
      quietQtyFocusPending.current = false;
      qtyRef.current?.focus();
    }
  }, [qtySoftInputOnFocus]);

  /** Move focus to qty without opening the keyboard; tap qty later to type. */
  const focusQuantityQuietly = useCallback(() => {
    if (!qtySoftInputOnFocus) {
      qtyRef.current?.focus();
      return;
    }
    quietQtyFocusPending.current = true;
    setQtySoftInputOnFocus(false);
  }, [qtySoftInputOnFocus]);

  const enableQtyKeyboard = useCallback(() => {
    setQtySoftInputOnFocus(true);
  }, []);

  const discountLabel = useMemo(() => {
    if (currentSale.discount <= 0) return null;
    const pct = subtotal > 0 ? Math.round((currentSale.discount / subtotal) * 100) : 0;
    return `≈ ${pct}% off`;
  }, [currentSale.discount, subtotal]);

  const dateLabel = useMemo(() => {
    const [y, m, d] = currentSale.invoiceDate.split('-').map(Number);
    const dt = new Date(y || 1970, (m || 1) - 1, d || 1);
    const pretty = dt.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return currentSale.invoiceDate === getCurrentDateFormatted()
      ? `Today · ${pretty}`
      : pretty;
  }, [currentSale.invoiceDate]);

  const openAdd = () => {
    setEditId(null);
    setDraftName('');
    setDraftQty('1');
    setDraftRate('');
    setNameError(null);
    setQtySoftInputOnFocus(true);
    setSheetVisible(true);
  };

  const openEdit = (id: string) => {
    const item = currentSale.items.find((i) => i.id === id);
    if (!item) return;
    setEditId(id);
    setDraftName(item.particulars);
    setDraftQty(String(item.quantity));
    setDraftRate(String(item.rate));
    setNameError(null);
    setQtySoftInputOnFocus(true);
    setSheetVisible(true);
  };

  const handleCloseSheet = () => {
    if (editId || hasItems) {
      // Editing, or the sale already has items — stay on this page.
      setSheetVisible(false);
      setEditId(null);
      return;
    }
    // Cancelling before any item is added backs out of the sale entirely.
    router.replace('/dashboard' as any);
  };

  const handleSaveItem = () => {
    const name = draftName.trim();
    if (!name) {
      setNameError('Enter an item name');
      return;
    }

    const duplicate = currentSale.items.find(
      (i) =>
        i.id !== editId && i.particulars.trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      setNameError(`“${name}” is already in this sale`);
      return;
    }

    lightTick();
    if (editId) {
      updateItem(editId, { particulars: name, quantity: qtyN, rate: rateN });
    } else {
      addItem({ particulars: name, quantity: qtyN, rate: rateN });
    }
    recordItem(name, rateN);
    setSheetVisible(false);
    setEditId(null);
  };

  const adjustQty = (next: number) => {
    lightTick();
    setDraftQty(String(Math.max(1, next)));
  };

  const handleProceedToPreview = () => {
    if (!hasItems) {
      Alert.alert('No items', 'Add at least one item before previewing the bill.');
      return;
    }
    setPreviewVisible(true);
  };

  const handleContinueFromPreview = () => {
    setPreviewVisible(false);
    // Let the preview sheet finish dismissing before navigating — pushing the
    // next screen while this Modal is still animating out makes the payment
    // screen's Fonepay QR sheet fail to present on native.
    setTimeout(() => router.push('/sales/payment'), 260);
  };

  return (
    <Screen
      headerProps={{
        title: 'New sale',
        showBack: true,
      }}
      footer={
        <Button
          title={hasItems ? `Preview bill · ${formatNPR(currentSale.netAmount)}` : 'Preview bill'}
          onPress={handleProceedToPreview}
          disabled={!isValidToPreview}
          size="lg"
          rightIcon={
            hasItems ? <Icon name="arrow-forward" size={20} color={t.text.inverse} /> : undefined
          }
        />
      }>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setDateSheetVisible(true)}
        style={styles.dateRow}
        accessibilityRole="button"
        accessibilityLabel={`Sale date: ${dateLabel}. Tap to change.`}>
        <Icon name="calendar-outline" size={17} color={t.text.secondary} />
        <Text style={styles.dateText}>{dateLabel}</Text>
        <Icon name="chevron-down" size={15} color={t.text.muted} />
      </TouchableOpacity>

      {hasItems && (
        <View style={styles.itemsList}>
          {currentSale.items.map((item) => (
            <SaleLineItem
              key={item.id}
              name={item.particulars}
              quantity={item.quantity}
              rate={item.rate}
              amount={item.amount}
              onPress={() => openEdit(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </View>
      )}

      <TouchableOpacity activeOpacity={0.8} onPress={openAdd} style={styles.addItemBtn}>
        <Icon name="add" size={18} color={t.brand.primary} />
        <Text style={styles.addItemText}>Add item</Text>
      </TouchableOpacity>

      {/* Discount — flat rupee amount */}
      {hasItems && (
        <View style={styles.discountSection}>
          <Text style={styles.sectionTitle}>Discount</Text>
          <Input
            value={discInput}
            onChangeText={(text) => setDiscInput(text.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            keyboardType="numeric"
            prefix="Rs."
            containerStyle={styles.noMargin}
          />
        </View>
      )}

      {/* Totals */}
      {hasItems && (
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatNPR(currentSale.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <View style={styles.discountLabelWrap}>
              <Text style={styles.totalLabel}>Discount</Text>
              {discountLabel && <Text style={styles.discountHint}>{discountLabel}</Text>}
            </View>
            <Text style={[styles.totalValue, styles.discountValue]}>
              {currentSale.discount > 0 ? `− ${formatNPR(currentSale.discount)}` : formatNPR(0)}
            </Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.netLabel}>Net payable</Text>
            <Text style={styles.netValue}>{formatNPR(currentSale.netAmount)}</Text>
          </View>
        </View>
      )}

      {/* Add / edit item bottom sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={handleCloseSheet}
        title={editId ? 'Edit item' : 'Add item'}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Item</Text>
          <ItemNameField
            value={draftName}
            onChangeText={(text) => {
              setDraftName(text);
              setNameError(null);
            }}
            onPick={(name, price) => {
              setDraftName(name);
              if (price > 0) setDraftRate(String(price));
              setNameError(null);
            }}
            onSubmit={focusQuantityQuietly}
            error={nameError ?? undefined}
            inputRef={nameRef}
          />
        </View>

        <View style={styles.sheetRow}>
          <View style={styles.sheetCol}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                onPress={() => adjustQty(qtyN - 1)}
                style={styles.stepBtn}>
                <Text style={styles.stepGlyph}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepValueWrap}>
                <TextInput
                  ref={qtyRef}
                  value={draftQty}
                  onChangeText={(text) => setDraftQty(text.replace(/[^0-9]/g, ''))}
                  onBlur={() => {
                    setQtySoftInputOnFocus(true);
                    const n = parseInt(draftQty, 10);
                    setDraftQty(!n || n < 1 ? '1' : String(n));
                  }}
                  onPressIn={enableQtyKeyboard}
                  showSoftInputOnFocus={qtySoftInputOnFocus}
                  keyboardType="numeric"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => rateRef.current?.focus()}
                  selectTextOnFocus
                  style={styles.stepValueInput}
                  maxLength={5}
                  accessibilityLabel="Quantity"
                />
              </View>
              <TouchableOpacity
                onPress={() => adjustQty(qtyN + 1)}
                style={styles.stepBtn}>
                <Text style={styles.stepGlyph}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sheetCol}>
            <Text style={styles.fieldLabel}>Rate (Rs.)</Text>
            <Input
              ref={rateRef}
              value={draftRate}
              onChangeText={(text) => setDraftRate(text.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={handleSaveItem}
              containerStyle={styles.noMargin}
            />
          </View>
        </View>

        <View style={styles.lineAmountBox}>
          <Text style={styles.lineAmountLabel}>Line amount</Text>
          <Text style={styles.lineAmountValue}>{formatNPR(lineAmount)}</Text>
        </View>

        <Button
          title={editId ? 'Save changes' : 'Add to sale'}
          onPress={handleSaveItem}
          size="lg"
        />
      </BottomSheet>

      {/* Bill preview bottom sheet */}
      <BottomSheet
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        title="Bill preview">
        <BillPreview
          sale={currentSale}
          merchant={merchant}
          isOfficial={false}
          showInvoice={false}
          showPaymentFooter={false}
        />
        <Button title="Continue" onPress={handleContinueFromPreview} size="lg" />
      </BottomSheet>

      {/* Sale date calendar */}
      <SaleDateSheet
        visible={dateSheetVisible}
        onClose={() => setDateSheetVisible(false)}
        value={currentSale.invoiceDate}
        onSelect={setSaleDate}
      />
    </Screen>
  );
}

const useStyles = makeStyles((t, type) => ({
  sectionTitle: {
    ...type.sectionTitle,
    color: t.text.primary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 10,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: t.border.subtle,
  },
  dateText: {
    ...type.bodyMedium,
    fontWeight: '600',
    color: t.text.primary,
    flex: 1,
  },
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: t.border.subtle,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: t.brand.primary,
    borderStyle: 'dashed',
    borderRadius: radius.medium,
    paddingVertical: 14,
    marginTop: Spacing.sm,
  },
  addItemText: {
    ...type.bodyMedium,
    fontWeight: '700',
    color: t.brand.primary,
  },
  discountSection: {
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  noMargin: {
    marginBottom: 0,
  },
  totals: {
    backgroundColor: t.background.subtle,
    borderRadius: radius.card,
    padding: Spacing.lg,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
    gap: 9,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: {
    ...type.bodySmall,
    color: t.text.secondary,
  },
  discountLabelWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  discountHint: {
    ...type.caption,
    fontSize: 11,
    color: t.text.muted,
  },
  totalValue: {
    ...type.bodySmall,
    fontWeight: '500',
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
  },
  discountValue: {
    color: t.status.success,
  },
  totalDivider: {
    height: 1,
    backgroundColor: t.border.default,
  },
  netLabel: {
    ...type.sectionTitle,
    color: t.text.primary,
  },
  netValue: {
    ...type.amountLarge,
    fontSize: 22,
    color: t.text.primary,
  },

  // Sheet
  field: {
    gap: 7,
  },
  fieldLabel: {
    ...type.label,
    color: t.text.primary,
  },
  sheetRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sheetCol: {
    flex: 1,
    gap: 7,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.medium,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 44,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.background.surface,
  },
  stepGlyph: {
    fontSize: 18,
    color: t.text.secondary,
  },
  stepValueWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: t.border.default,
    height: 46,
  },
  stepValueInput: {
    ...type.bodyMedium,
    fontWeight: '700',
    fontSize: 16,
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    height: 46,
    width: '100%',
    paddingVertical: 0,
  },
  lineAmountBox: {
    backgroundColor: t.background.subtle,
    borderRadius: radius.medium,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  lineAmountLabel: {
    ...type.bodySmall,
    fontWeight: '600',
    color: t.text.secondary,
  },
  lineAmountValue: {
    ...type.amount,
    fontSize: 20,
    color: t.text.primary,
  },
}));
