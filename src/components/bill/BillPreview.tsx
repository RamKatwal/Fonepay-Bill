import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sale } from '@/types/sale';
import { Merchant } from '@/types/merchant';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { Typography } from '@/constants/typography';
import { makeStyles } from '@/theme';
import { formatNPR } from '@/utils/currency';
import { formatPAN } from '@/utils/formatters';

interface BillPreviewProps {
  sale: Sale;
  merchant: Merchant;
  isOfficial?: boolean;
  /** Hide the invoice number meta column (e.g. estimate overlay). */
  showInvoice?: boolean;
  /** Hide payment method + "Generated on…" footer. */
  showPaymentFooter?: boolean;
}

export function BillPreview({
  sale,
  merchant,
  isOfficial = false,
  showInvoice = true,
  showPaymentFooter = true,
}: BillPreviewProps) {
  const styles = useStyles();

  const methodLabel =
    sale.paymentMode === 'fonepay' ? 'Fonepay QR' : sale.paymentMode === 'cash' ? 'Cash' : '—';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.merchantCol}>
            <Text style={styles.merchantName}>{merchant.businessName}</Text>
            <Text style={styles.merchantMeta}>{merchant.address}</Text>
            <Text style={styles.merchantMeta}>
              PAN {formatPAN(merchant.panVatNumber)} · {merchant.contactNumber}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docLabel}>{isOfficial ? 'Tax Invoice' : 'Estimate'}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          {showInvoice && (
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Invoice</Text>
              <Text style={styles.metaMono}>{sale.invoiceNumber || '—'}</Text>
            </View>
          )}
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{sale.invoiceDate}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Time</Text>
            <Text style={styles.metaValue}>{sale.invoiceTime}</Text>
          </View>
        </View>
      </View>

      {/* Items table */}
      <View style={styles.tableHead}>
        <Text style={[styles.th, styles.colName]}>Items</Text>
        <Text style={[styles.th, styles.colQty]}>Qty</Text>
        <Text style={[styles.th, styles.colRate]}>Rate</Text>
        <Text style={[styles.th, styles.colAmt]}>Amount</Text>
      </View>
      {sale.items.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={[styles.tdName, styles.colName]}>{item.particulars}</Text>
          <Text style={[styles.td, styles.colQty]}>{item.quantity}</Text>
          <Text style={[styles.td, styles.colRate]}>{formatNPR(item.rate)}</Text>
          <Text style={[styles.tdStrong, styles.colAmt]}>{formatNPR(item.amount)}</Text>
        </View>
      ))}

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalLine}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatNPR(sale.subtotal)}</Text>
        </View>
        {sale.discount > 0 && (
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Discount</Text>
            <Text style={styles.totalValue}>− {formatNPR(sale.discount)}</Text>
          </View>
        )}
        <View style={styles.totalDivider} />
        <View style={styles.totalLine}>
          <Text style={styles.netLabel}>Net amount</Text>
          <Text style={styles.netValue}>{formatNPR(sale.netAmount)}</Text>
        </View>
        <View style={styles.wordsBox}>
          <Text style={styles.wordsText}>
            In words: <Text style={styles.wordsStrong}>{sale.amountInWords}</Text>
          </Text>
        </View>
      </View>

      {/* Footer */}
      {showPaymentFooter && (
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.metaLabel}>Payment</Text>
            <Text style={styles.methodLabel}>
              {sale.paymentMode ? methodLabel : 'Not selected'}
            </Text>
            {isOfficial && sale.paymentMode === 'fonepay' && sale.transactionId ? (
              <Text style={styles.txnMono}>Txn {sale.transactionId}</Text>
            ) : null}
          </View>
          <Text style={styles.footerNote}>Generated on Fonepay</Text>
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((t, type) => ({
  card: {
    backgroundColor: t.background.surface,
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: t.border.default,
    borderStyle: 'dashed',
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  merchantCol: {
    flex: 1,
    gap: 3,
  },
  merchantName: {
    ...type.cardTitle,
    fontSize: 17,
    fontFamily: type.display.fontFamily,
    fontWeight: '800',
    color: t.text.primary,
  },
  merchantMeta: {
    ...type.caption,
    color: t.text.secondary,
    lineHeight: 16,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  docLabel: {
    ...type.label,
    fontSize: 10,
    color: t.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.xxl,
  },
  metaCol: {
    gap: 2,
  },
  metaLabel: {
    ...type.label,
    fontSize: 10,
    color: t.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaMono: {
    ...type.invoiceNumber,
    fontFamily: Typography.family.mono,
    color: t.text.primary,
  },
  metaValue: {
    ...type.caption,
    fontWeight: '500',
    color: t.text.primary,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: t.background.subtle,
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
  },
  th: {
    ...type.label,
    fontSize: 10,
    color: t.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: t.border.subtle,
    alignItems: 'baseline',
  },
  td: {
    ...type.bodySmall,
    color: t.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  tdName: {
    ...type.bodySmall,
    fontWeight: '500',
    color: t.text.primary,
    lineHeight: 18,
  },
  tdStrong: {
    ...type.bodySmall,
    fontWeight: '600',
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
  },
  colName: {
    flex: 1,
    paddingRight: 8,
  },
  colQty: {
    width: 30,
    textAlign: 'right',
  },
  colRate: {
    width: 72,
    textAlign: 'right',
  },
  colAmt: {
    width: 82,
    textAlign: 'right',
  },
  totals: {
    padding: Spacing.lg,
    gap: 8,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: {
    ...type.bodySmall,
    color: t.text.secondary,
  },
  totalValue: {
    ...type.bodySmall,
    fontWeight: '500',
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
  },
  totalDivider: {
    height: 1,
    backgroundColor: t.border.default,
    marginVertical: 2,
  },
  netLabel: {
    ...type.sectionTitle,
    fontSize: 14,
    color: t.text.primary,
  },
  netValue: {
    ...type.amountLarge,
    fontSize: 22,
    color: t.text.primary,
  },
  wordsBox: {
    backgroundColor: t.background.subtle,
    borderRadius: radius.small,
    padding: Spacing.md,
    marginTop: 4,
  },
  wordsText: {
    ...type.caption,
    fontSize: 11,
    color: t.text.secondary,
    lineHeight: 16,
  },
  wordsStrong: {
    fontWeight: '600',
    color: t.text.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: t.border.default,
  },
  footerLeft: {
    gap: 3,
  },
  methodLabel: {
    ...type.bodySmall,
    fontWeight: '600',
    color: t.text.primary,
  },
  txnMono: {
    ...type.invoiceNumber,
    fontFamily: Typography.family.mono,
    fontSize: 11,
    color: t.text.secondary,
  },
  footerNote: {
    ...type.caption,
    fontSize: 10,
    color: t.text.muted,
    textAlign: 'right',
    maxWidth: 150,
    lineHeight: 14,
  },
}));
