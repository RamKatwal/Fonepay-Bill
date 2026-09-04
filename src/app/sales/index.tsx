import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';
import { mockProducts } from '@/data/mockProducts';

type DiscountMode = 'pct' | 'amt';

export default function CreateSaleScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const {
    currentSale,
    addItem,
    updateItem,
    removeItem,
    setDiscount,
    hasItems,
    isValidToPreview,
  } = useSaleContext();

  // Add / edit item sheet — open on load so the merchant can start immediately
  const [sheetVisible, setSheetVisible] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftQty, setDraftQty] = useState('1');
  const [draftRate, setDraftRate] = useState('');
  const [nameError, setNameError] = useState(false);

  // Combined discount control
  const [discMode, setDiscMode] = useState<DiscountMode>('pct');
  const [discInput, setDiscInput] = useState('');

  const qtyN = Math.max(1, parseInt(draftQty, 10) || 1);
  const rateN = parseFloat(draftRate) || 0;
  const lineAmount = qtyN * rateN;

  const { subtotal } = currentSale;

  // Keep the sale's discount in sync with the combined control.
  useEffect(() => {
    const v = parseFloat(discInput) || 0;
    let amount = discMode === 'pct' ? (subtotal * Math.min(v, 100)) / 100 : v;
    amount = Math.max(0, Math.min(Math.round(amount * 100) / 100, subtotal));
    setDiscount(amount);
  }, [discInput, discMode, subtotal, setDiscount]);

  const discountLabel = useMemo(() => {
    if (currentSale.discount <= 0) return null;
    const pct = subtotal > 0 ? Math.round((currentSale.discount / subtotal) * 100) : 0;
    return discMode === 'pct' ? `${discInput || pct}% off` : `≈ ${pct}% off`;
  }, [currentSale.discount, subtotal, discMode, discInput]);

  const openAdd = () => {
    setEditId(null);
    setDraftName('');
    setDraftQty('1');
    setDraftRate('');
    setNameError(false);
    setSheetVisible(true);
  };

  const openEdit = (id: string) => {
    const item = currentSale.items.find((i) => i.id === id);
    if (!item) return;
    setEditId(id);
    setDraftName(item.particulars);
    setDraftQty(String(item.quantity));
    setDraftRate(String(item.rate));
    setNameError(false);
    setSheetVisible(true);
  };

  const handleSaveItem = () => {
    const name = draftName.trim();
    if (!name) {
      setNameError(true);
      return;
    }
    if (editId) {
      updateItem(editId, { particulars: name, quantity: qtyN, rate: rateN });
    } else {
      addItem({ particulars: name, quantity: qtyN, rate: rateN });
    }
    setSheetVisible(false);
    setEditId(null);
  };

  const handleProceedToPreview = () => {
    if (!hasItems) {
      Alert.alert('No items', 'Add at least one item before previewing the bill.');
      return;
    }
    router.push('/sales/preview');
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
      {/* Items */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Items</Text>
        <Text style={styles.itemCount}>
          {currentSale.items.length === 1 ? '1 item' : `${currentSale.items.length} items`}
        </Text>
      </View>

      {hasItems && (
        <View style={styles.itemsList}>
          {currentSale.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemName}>{item.particulars}</Text>
                <Text style={styles.itemAmount}>{formatNPR(item.amount)}</Text>
              </View>
              <View style={styles.itemBottomRow}>
                <Text style={styles.itemMeta}>
                  {item.quantity} × {formatNPR(item.rate)}
                </Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => openEdit(item.id)}
                    style={styles.itemActionPill}
                    hitSlop={6}>
                    <Text style={styles.itemActionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={[styles.itemActionPill, styles.itemRemovePill]}
                    hitSlop={6}>
                    <Text style={[styles.itemActionText, styles.itemRemoveText]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity activeOpacity={0.8} onPress={openAdd} style={styles.addItemBtn}>
        <Icon name="add" size={18} color={t.brand.primary} />
        <Text style={styles.addItemText}>Add item</Text>
      </TouchableOpacity>

      {/* Discount — combined percent / amount */}
      {hasItems && (
        <View style={styles.discountSection}>
          <Text style={styles.sectionTitle}>Discount</Text>

          <View style={styles.discountControl}>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                onPress={() => {
                  if (discMode !== 'pct') {
                    setDiscMode('pct');
                    setDiscInput('');
                  }
                }}
                style={[styles.modeBtn, discMode === 'pct' && styles.modeBtnActive]}>
                <Text
                  style={[styles.modeText, discMode === 'pct' && styles.modeTextActive]}>
                  %
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (discMode !== 'amt') {
                    setDiscMode('amt');
                    setDiscInput('');
                  }
                }}
                style={[styles.modeBtn, discMode === 'amt' && styles.modeBtnActive]}>
                <Text
                  style={[styles.modeText, discMode === 'amt' && styles.modeTextActive]}>
                  Rs
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.discountInputWrap}>
              <Input
                value={discInput}
                onChangeText={(text) =>
                  setDiscInput(text.replace(/[^0-9.]/g, ''))
                }
                placeholder={discMode === 'pct' ? '0' : '0.00'}
                keyboardType="numeric"
                prefix={discMode === 'amt' ? 'Rs.' : undefined}
                suffix={discMode === 'pct' ? '%' : undefined}
                containerStyle={styles.noMargin}
              />
            </View>
          </View>

          {discMode === 'pct' && (
            <View style={styles.discChips}>
              {['5', '10', '15', '20'].map((p) => (
                <Chip
                  key={p}
                  label={`${p}%`}
                  size="sm"
                  selectedTone="brand"
                  selected={discInput === p}
                  onPress={() => setDiscInput(discInput === p ? '' : p)}
                />
              ))}
            </View>
          )}
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
        onClose={() => setSheetVisible(false)}
        title={editId ? 'Edit item' : 'Add item'}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Particulars</Text>
          <Input
            value={draftName}
            onChangeText={(text) => {
              setDraftName(text);
              setNameError(false);
            }}
            placeholder="e.g. Chicken Steam Momo"
            error={nameError ? 'Enter an item name' : undefined}
            containerStyle={styles.noMargin}
          />
          <View style={styles.catalogChips}>
            {mockProducts.slice(0, 5).map((p) => (
              <Chip
                key={p.id}
                label={p.particulars}
                size="sm"
                selected={draftName === p.particulars}
                onPress={() => {
                  setDraftName(p.particulars);
                  setDraftRate(String(p.defaultRate));
                  setNameError(false);
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.sheetRow}>
          <View style={styles.sheetCol}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                onPress={() => setDraftQty(String(Math.max(1, qtyN - 1)))}
                style={styles.stepBtn}>
                <Text style={styles.stepGlyph}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepValueWrap}>
                <Text style={styles.stepValue}>{draftQty || '1'}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDraftQty(String(qtyN + 1))}
                style={styles.stepBtn}>
                <Text style={styles.stepGlyph}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sheetCol}>
            <Text style={styles.fieldLabel}>Rate (Rs.)</Text>
            <Input
              value={draftRate}
              onChangeText={(text) => setDraftRate(text.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              keyboardType="numeric"
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
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: t.text.primary,
  },
  itemCount: {
    ...typography.caption,
    color: t.text.secondary,
  },
  itemsList: {
    gap: Spacing.sm,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.medium,
    padding: Spacing.md,
    gap: 9,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
  },
  itemName: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: t.text.primary,
    flex: 1,
  },
  itemAmount: {
    ...typography.amount,
    fontSize: 15,
    color: t.text.primary,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  itemMeta: {
    ...typography.caption,
    color: t.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  itemActions: {
    flexDirection: 'row',
    gap: 6,
  },
  itemActionPill: {
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 13,
  },
  itemRemovePill: {
    borderColor: t.status.errorBackground,
  },
  itemActionText: {
    ...typography.caption,
    fontWeight: '600',
    color: t.text.primary,
  },
  itemRemoveText: {
    color: t.status.error,
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
    ...typography.bodyMedium,
    fontWeight: '700',
    color: t.brand.primary,
  },
  discountSection: {
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  discountControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  modeToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.medium,
    overflow: 'hidden',
  },
  modeBtn: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.background.surface,
  },
  modeBtnActive: {
    backgroundColor: t.text.primary,
  },
  modeText: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: t.text.secondary,
  },
  modeTextActive: {
    color: t.background.surface,
  },
  discountInputWrap: {
    flex: 1,
  },
  noMargin: {
    marginBottom: 0,
  },
  discChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
    ...typography.bodySmall,
    color: t.text.secondary,
  },
  discountLabelWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  discountHint: {
    ...typography.caption,
    fontSize: 11,
    color: t.text.muted,
  },
  totalValue: {
    ...typography.bodySmall,
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
    ...typography.sectionTitle,
    color: t.text.primary,
  },
  netValue: {
    ...typography.amountLarge,
    fontSize: 22,
    color: t.text.primary,
  },

  // Sheet
  field: {
    gap: 7,
  },
  fieldLabel: {
    ...typography.label,
    color: t.text.primary,
  },
  catalogChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 2,
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
  stepValue: {
    ...typography.bodyMedium,
    fontWeight: '700',
    fontSize: 16,
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
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
    ...typography.bodySmall,
    fontWeight: '600',
    color: t.text.secondary,
  },
  lineAmountValue: {
    ...typography.amount,
    fontSize: 20,
    color: t.text.primary,
  },
}));
