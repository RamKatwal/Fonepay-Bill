import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sale } from '@/types/sale';
import { Merchant } from '@/types/merchant';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography, Typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';
import { formatPAN } from '@/utils/formatters';

interface BillPreviewProps {
  sale: Sale;
  merchant: Merchant;
  isOfficial?: boolean;
}

export function BillPreview({ sale, merchant, isOfficial = false }: BillPreviewProps) {
  const styles = useStyles();
  const t = useTheme();

  const pct =
    sale.discount > 0 && sale.subtotal > 0
      ? Math.round((sale.discount / sale.subtotal) * 100)
      : 0;

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
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Invoice</Text>
            <Text style={styles.metaMono}>{sale.invoiceNumber || '—'}</Text>
          </View>
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
        <Text style={[styles.th, styles.colName]}>Particulars</Text>
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
            <Text style={styles.totalLabel}>
              Discount{pct > 0 ? ` (${pct}%)` : ''}
            </Text>
            <Text style={[styles.totalValue, { color: t.status.success }]}>
              − {formatNPR(sale.discount)}
            </Text>
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
        <Text style={styles.footerNote}>Generated on Fonepay Digital Bill</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
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
    ...typography.cardTitle,
    fontSize: 17,
    fontFamily: Typography.family.sansHeavy,
    fontWeight: '800',
    color: t.text.primary,
  },
  merchantMeta: {
    ...typography.caption,
    color: t.text.secondary,
    lineHeight: 16,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  docLabel: {
    ...typography.label,
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
    ...typography.label,
    fontSize: 10,
    color: t.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaMono: {
    ...typography.invoiceNumber,
    fontFamily: Typography.family.mono,
    color: t.text.primary,
  },
  metaValue: {
    ...typography.caption,
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
    ...typography.label,
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
    ...typography.bodySmall,
    color: t.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  tdName: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: t.text.primary,
    lineHeight: 18,
  },
  tdStrong: {
    ...typography.bodySmall,
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
    ...typography.bodySmall,
    color: t.text.secondary,
  },
  totalValue: {
    ...typography.bodySmall,
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
    ...typography.sectionTitle,
    fontSize: 14,
    color: t.text.primary,
  },
  netValue: {
    ...typography.amountLarge,
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
    ...typography.caption,
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
    ...typography.bodySmall,
    fontWeight: '600',
    color: t.text.primary,
  },
  txnMono: {
    ...typography.invoiceNumber,
    fontFamily: Typography.family.mono,
    fontSize: 11,
    color: t.text.secondary,
  },
  footerNote: {
    ...typography.caption,
    fontSize: 10,
    color: t.text.muted,
    textAlign: 'right',
    maxWidth: 150,
    lineHeight: 14,
  },
}));
