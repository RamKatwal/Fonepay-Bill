import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sale } from '@/types/sale';
import { Merchant } from '@/types/merchant';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { formatNPR } from '@/utils/currency';
import { formatPAN } from '@/utils/formatters';

interface BillPreviewProps {
  sale: Sale;
  merchant: Merchant;
  isOfficial?: boolean;
}

export function BillPreview({ sale, merchant, isOfficial = false }: BillPreviewProps) {
  return (
    <Card variant="surface" style={styles.billContainer}>
      {/* Official Tax Invoice Header / Preview Banner */}
      <View style={styles.headerBanner}>
        <Text style={styles.bannerText}>
          {isOfficial ? 'TAX INVOICE' : 'BILL PREVIEW (ESTIMATE)'}
        </Text>
      </View>

      {/* Merchant Header (Read-Only) */}
      <View style={styles.merchantSection}>
        <Text style={styles.businessName}>{merchant.businessName}</Text>
        <Text style={styles.merchantDetail}>{merchant.address}</Text>
        <Text style={styles.merchantDetail}>Contact: {merchant.contactNumber}</Text>
        <View style={styles.panRow}>
          <Text style={styles.panLabel}>PAN / VAT No:</Text>
          <Text style={styles.panValue}>{formatPAN(merchant.panVatNumber)}</Text>
        </View>
      </View>

      <Divider dashed style={styles.divider} />

      {/* Bill Meta Data */}
      <View style={styles.metaGrid}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Invoice No:</Text>
          <Text style={styles.metaValueBold}>{sale.invoiceNumber}</Text>
        </View>
        <View style={styles.metaColRight}>
          <Text style={styles.metaLabel}>Date:</Text>
          <Text style={styles.metaValue}>{sale.invoiceDate}</Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Txn ID:</Text>
          <Text style={styles.metaValueMono}>{sale.transactionId}</Text>
        </View>
        <View style={styles.metaColRight}>
          <Text style={styles.metaLabel}>Time:</Text>
          <Text style={styles.metaValue}>{sale.invoiceTime}</Text>
        </View>
      </View>

      {sale.paymentMode && (
        <View style={styles.paymentStatusRow}>
          <Text style={styles.metaLabel}>Payment Mode:</Text>
          <View style={styles.badgeWrap}>
            <Badge status={sale.paymentMode} size="sm" />
            {sale.paymentStatus && <Badge status={sale.paymentStatus} size="sm" />}
          </View>
        </View>
      )}

      <Divider style={styles.divider} />

      {/* Items Table */}
      <View style={styles.tableHeader}>
        <Text style={[styles.thText, styles.colSn]}>SN</Text>
        <Text style={[styles.thText, styles.colPart]}>Particulars</Text>
        <Text style={[styles.thText, styles.colQty]}>Qty</Text>
        <Text style={[styles.thText, styles.colRate]}>Rate</Text>
        <Text style={[styles.thText, styles.colAmt]}>Amount</Text>
      </View>

      <View style={styles.tableBody}>
        {sale.items.map((item, idx) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tdText, styles.colSn]}>{idx + 1}</Text>
            <Text style={[styles.tdTextBold, styles.colPart]} numberOfLines={2}>
              {item.particulars}
            </Text>
            <Text style={[styles.tdText, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.tdText, styles.colRate]}>{item.rate}</Text>
            <Text style={[styles.tdTextBold, styles.colAmt]}>
              {formatNPR(item.amount)}
            </Text>
          </View>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* Totals & Calculations */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatNPR(sale.subtotal)}</Text>
        </View>

        {sale.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.discountLabel}>Discount</Text>
            <Text style={styles.discountValue}>- {formatNPR(sale.discount)}</Text>
          </View>
        )}

        <View style={styles.netAmountRow}>
          <Text style={styles.netLabel}>Net Amount</Text>
          <Text style={styles.netValue}>{formatNPR(sale.netAmount)}</Text>
        </View>
      </View>

      {/* In Words Section */}
      <View style={styles.inWordsBox}>
        <Text style={styles.inWordsLabel}>In Words:</Text>
        <Text style={styles.inWordsText}>{sale.amountInWords}</Text>
      </View>

      {/* Footer Notes */}
      <View style={styles.billFooter}>
        <Text style={styles.footerNote}>Generated via Fonepay Digital Bill Generator</Text>
        <Text style={styles.thankYouNote}>Thank you for your business!</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  billContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerBanner: {
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 6,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bannerText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
  },
  merchantSection: {
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  businessName: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.heavy,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  merchantDetail: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  panRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  panLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  panValue: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  divider: {
    marginVertical: Spacing.sm,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaCol: {
    flexDirection: 'row',
    gap: 4,
  },
  metaColRight: {
    flexDirection: 'row',
    gap: 4,
  },
  metaLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  metaValue: {
    fontSize: Typography.size.xs,
    color: Colors.text,
  },
  metaValueBold: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  metaValueMono: {
    fontSize: Typography.size.xs,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
  },
  paymentStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  badgeWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.xs,
    marginBottom: 4,
  },
  thText: {
    fontSize: Typography.size.xxs,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  tableBody: {
    gap: 6,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tdText: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  tdTextBold: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  colSn: {
    width: 24,
  },
  colPart: {
    flex: 1,
    paddingRight: 4,
  },
  colQty: {
    width: 36,
    textAlign: 'center',
  },
  colRate: {
    width: 50,
    textAlign: 'right',
  },
  colAmt: {
    width: 68,
    textAlign: 'right',
  },
  totalsContainer: {
    marginTop: 4,
    gap: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  discountLabel: {
    fontSize: Typography.size.xs,
    color: Colors.failed,
  },
  discountValue: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.failed,
  },
  netAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 4,
  },
  netLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  netValue: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.heavy,
    color: Colors.primary,
  },
  inWordsBox: {
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
    marginTop: Spacing.md,
  },
  inWordsLabel: {
    fontSize: Typography.size.xxs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  inWordsText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.text,
    fontStyle: 'italic',
  },
  billFooter: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  footerNote: {
    fontSize: Typography.size.xxs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  thankYouNote: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
  },
});
