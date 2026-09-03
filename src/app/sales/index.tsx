import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSaleContext } from '@/store/SaleContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { Modal } from '@/components/ui/Modal';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { formatNPR } from '@/utils/currency';
import { mockProducts } from '@/data/mockProducts';

export default function CreateSaleScreen() {
  const router = useRouter();
  const { currentSale, addItem, removeItem, setDiscount, hasItems, isValidToPreview } =
    useSaleContext();

  // Add Item Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [particulars, setParticulars] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [rate, setRate] = useState('');
  const [formError, setFormError] = useState('');

  const handleOpenAddModal = () => {
    setParticulars('');
    setQuantity('1');
    setRate('');
    setFormError('');
    setModalVisible(true);
  };

  const handleSelectQuickProduct = (p: typeof mockProducts[0]) => {
    setParticulars(p.particulars);
    setRate(String(p.defaultRate));
  };

  const handleSaveItem = () => {
    if (!particulars.trim()) {
      setFormError('Item particulars / name is required');
      return;
    }
    const q = parseFloat(quantity);
    if (isNaN(q) || q <= 0) {
      setFormError('Please enter a valid quantity greater than 0');
      return;
    }
    const r = parseFloat(rate);
    if (isNaN(r) || r < 0) {
      setFormError('Please enter a valid rate');
      return;
    }

    addItem({
      particulars: particulars.trim(),
      quantity: q,
      rate: r,
    });
    setModalVisible(false);
  };

  const handleProceedToPreview = () => {
    if (!hasItems) {
      Alert.alert('No Items', 'Please add at least one item before previewing the bill.');
      return;
    }
    router.push('/sales/preview');
  };

  return (
    <Screen
      headerProps={{
        title: 'Create Sales Bill',
        subtitle: currentSale.invoiceNumber,
        showBack: true,
      }}
      footer={
        <Button
          title={`Preview Bill • ${formatNPR(currentSale.netAmount)}`}
          onPress={handleProceedToPreview}
          disabled={!isValidToPreview}
          size="lg"
          rightIcon={<Icon name="arrow-forward" size={20} color={Colors.textInverse} />}
        />
      }>
      {/* Bill Meta Card */}
      <Card variant="surface" padding="sm" style={styles.metaCard}>
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValueBold}>{currentSale.invoiceNumber}</Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.metaLabel}>Date & Time</Text>
            <Text style={styles.metaValue}>
              {currentSale.invoiceDate} • {currentSale.invoiceTime}
            </Text>
          </View>
        </View>
      </Card>

      {/* Items Section Header */}
      <View style={styles.itemsHeader}>
        <Text style={styles.sectionTitle}>Bill Particulars / Items</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpenAddModal}
          style={styles.addItemHeaderBtn}>
          <Icon name="add" size={18} color={Colors.primary} />
          <Text style={styles.addItemHeaderText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      {!hasItems ? (
        <Card variant="flat" style={styles.emptyItemsCard}>
          <Icon name="receipt-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No items added yet</Text>
          <Text style={styles.emptySubtitle}>
            Add items with particulars, quantity and rate to calculate the bill.
          </Text>
          <Button
            title="+ Add First Item"
            onPress={handleOpenAddModal}
            size="sm"
            variant="outline"
            fullWidth={false}
            style={styles.addFirstBtn}
          />
        </Card>
      ) : (
        <View style={styles.itemsList}>
          {currentSale.items.map((item, index) => (
            <Card key={item.id} variant="surface" padding="sm" style={styles.itemCard}>
              <View style={styles.itemRow}>
                <View style={styles.itemIndexBox}>
                  <Text style={styles.itemIndexText}>{index + 1}</Text>
                </View>

                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{item.particulars}</Text>
                  <Text style={styles.itemSubtitle}>
                    {item.quantity} × {formatNPR(item.rate)}
                  </Text>
                </View>

                <View style={styles.itemRight}>
                  <Text style={styles.itemAmount}>{formatNPR(item.amount)}</Text>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Icon name="trash" size={18} color={Colors.failed} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Bill Calculations Card */}
      {hasItems && (
        <Card variant="surface" style={styles.calculationsCard}>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Subtotal</Text>
            <Text style={styles.calcValue}>{formatNPR(currentSale.subtotal)}</Text>
          </View>

          <View style={styles.discountRow}>
            <View style={styles.discountLabelCol}>
              <Text style={styles.calcLabel}>Discount (Rs.)</Text>
              <Text style={styles.discountHint}>Optional deduction</Text>
            </View>
            <View style={styles.discountInputWrap}>
              <Input
                value={currentSale.discount ? String(currentSale.discount) : ''}
                onChangeText={(text) => setDiscount(parseFloat(text) || 0)}
                placeholder="0"
                keyboardType="numeric"
                prefix="Rs."
                containerStyle={styles.discountInput}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.calcRowNet}>
            <Text style={styles.netLabel}>Net Amount</Text>
            <Text style={styles.netValue}>{formatNPR(currentSale.netAmount)}</Text>
          </View>
        </Card>
      )}

      {/* Add Item Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Add Bill Item">
        <View style={styles.quickCatalog}>
          <Text style={styles.quickLabel}>Popular Items:</Text>
          <View style={styles.quickChips}>
            {mockProducts.slice(0, 4).map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => handleSelectQuickProduct(p)}
                style={styles.quickChip}>
                <Text style={styles.quickChipText}>{p.particulars}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Particulars / Item Name"
          placeholder="e.g., Chicken Momo"
          value={particulars}
          onChangeText={setParticulars}
          required
        />

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Input
              label="Quantity"
              placeholder="1"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              required
            />
          </View>
          <View style={styles.col}>
            <Input
              label="Rate"
              placeholder="0.00"
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
              prefix="Rs."
              required
            />
          </View>
        </View>

        {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}

        <Button
          title="Add Item to Bill"
          onPress={handleSaveItem}
          size="md"
          style={styles.modalAddBtn}
        />
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metaCard: {
    marginBottom: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: Typography.size.xxs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  metaValueBold: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  addItemHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addItemHeaderText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  emptyItemsCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  addFirstBtn: {
    minWidth: 160,
  },
  itemsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  itemCard: {
    marginBottom: 0,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  itemIndexBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIndexText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  itemAmount: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  calculationsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  calcLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  calcValue: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountLabelCol: {
    flex: 1,
  },
  discountHint: {
    fontSize: Typography.size.xxs,
    color: Colors.textMuted,
  },
  discountInputWrap: {
    width: 140,
  },
  discountInput: {
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  calcRowNet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  netValue: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.heavy,
    color: Colors.primary,
  },
  quickCatalog: {
    marginBottom: Spacing.md,
  },
  quickLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  quickChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChip: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipText: {
    fontSize: Typography.size.xs,
    color: Colors.text,
  },
  twoCol: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  col: {
    flex: 1,
  },
  formErrorText: {
    color: Colors.failed,
    fontSize: Typography.size.xs,
    marginBottom: Spacing.sm,
  },
  modalAddBtn: {
    marginTop: Spacing.sm,
  },
});
