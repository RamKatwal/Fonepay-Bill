import { Platform, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Sale } from '@/types/sale';
import { Merchant } from '@/types/merchant';
import { formatNPR } from '@/utils/currency';
import { formatPAN } from '@/utils/formatters';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build a print-ready HTML tax invoice for PDF generation.
 */
export function buildBillPdfHtml(
  sale: Sale,
  merchant: Merchant,
  isOfficial = true
): string {
  const methodLabel =
    sale.paymentMode === 'fonepay'
      ? 'Fonepay QR'
      : sale.paymentMode === 'cash'
        ? 'Cash'
        : '—';

  const itemRows = sale.items
    .map(
      (item) => `
      <tr>
        <td class="name">${escapeHtml(item.particulars)}</td>
        <td class="num">${item.quantity}</td>
        <td class="num">${escapeHtml(formatNPR(item.rate))}</td>
        <td class="num strong">${escapeHtml(formatNPR(item.amount))}</td>
      </tr>`
    )
    .join('');

  const discountRow =
    sale.discount > 0
      ? `<div class="total-line">
          <span>Discount</span>
          <span>− ${escapeHtml(formatNPR(sale.discount))}</span>
        </div>`
      : '';

  const txnLine = sale.transactionId
    ? `<div class="muted small">Txn ${escapeHtml(sale.transactionId)}</div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @page { margin: 24px; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      color: #0F172A;
      background: #fff;
      font-size: 13px;
      line-height: 1.4;
    }
    .card { border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
    .header { padding: 20px; border-bottom: 1px dashed #CBD5E1; }
    .header-row { display: flex; justify-content: space-between; gap: 16px; }
    .merchant-name { font-size: 17px; font-weight: 800; margin: 0 0 4px; }
    .meta { color: #64748B; margin: 0; font-size: 12px; }
    .doc-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.6px;
      text-transform: uppercase; color: #64748B; text-align: right;
    }
    .meta-row { display: flex; gap: 32px; margin-top: 16px; }
    .meta-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
      text-transform: uppercase; color: #94A3B8; margin-bottom: 2px;
    }
    .meta-value { font-weight: 600; font-size: 13px; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    table { width: 100%; border-collapse: collapse; }
    thead th {
      background: #F8FAFC; text-align: left; padding: 10px 16px;
      font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase;
      color: #64748B; border-bottom: 1px solid #E2E8F0;
    }
    tbody td { padding: 10px 16px; border-bottom: 1px solid #F1F5F9; vertical-align: top; }
    .name { font-weight: 600; width: 48%; }
    .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .strong { font-weight: 700; }
    th.num, td.num { text-align: right; }
    .totals { padding: 16px 20px; background: #F8FAFC; }
    .total-line { display: flex; justify-content: space-between; margin-bottom: 8px; color: #64748B; }
    .divider { height: 1px; background: #E2E8F0; margin: 10px 0; }
    .net { display: flex; justify-content: space-between; align-items: baseline; }
    .net-label { font-size: 16px; font-weight: 700; color: #0F172A; }
    .net-value { font-size: 22px; font-weight: 800; }
    .words { margin-top: 10px; font-size: 12px; color: #64748B; }
    .words strong { color: #0F172A; }
    .footer {
      padding: 16px 20px; display: flex; justify-content: space-between;
      align-items: flex-end; gap: 12px; border-top: 1px solid #E2E8F0;
    }
    .method { font-weight: 700; margin-top: 2px; }
    .muted { color: #64748B; }
    .small { font-size: 11px; margin-top: 2px; }
    .footer-note { font-size: 11px; color: #94A3B8; text-align: right; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="header-row">
        <div>
          <p class="merchant-name">${escapeHtml(merchant.businessName)}</p>
          <p class="meta">${escapeHtml(merchant.address)}</p>
          <p class="meta">PAN ${escapeHtml(formatPAN(merchant.panVatNumber))} · ${escapeHtml(merchant.contactNumber)}</p>
        </div>
        <div class="doc-label">${isOfficial ? 'Invoice' : 'Estimate'}</div>
      </div>
      <div class="meta-row">
        <div>
          <div class="meta-label">Invoice</div>
          <div class="meta-value mono">${escapeHtml(sale.invoiceNumber || '—')}</div>
        </div>
        <div>
          <div class="meta-label">Date</div>
          <div class="meta-value">${escapeHtml(sale.invoiceDate)}</div>
        </div>
        <div>
          <div class="meta-label">Time</div>
          <div class="meta-value">${escapeHtml(sale.invoiceTime)}</div>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Items</th>
          <th class="num">Qty</th>
          <th class="num">Rate</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div class="totals">
      <div class="total-line">
        <span>Subtotal</span>
        <span>${escapeHtml(formatNPR(sale.subtotal))}</span>
      </div>
      ${discountRow}
      <div class="divider"></div>
      <div class="net">
        <span class="net-label">Net amount</span>
        <span class="net-value">${escapeHtml(formatNPR(sale.netAmount))}</span>
      </div>
      <div class="words">In words: <strong>${escapeHtml(sale.amountInWords)}</strong></div>
    </div>

    <div class="footer">
      <div>
        <div class="meta-label">Payment</div>
        <div class="method">${escapeHtml(methodLabel)}</div>
        ${txnLine}
      </div>
      <div class="footer-note">Generated on Fonepay</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate a PDF invoice and open the OS share sheet (mobile default share modal).
 */
export async function shareBillAsPdf(
  sale: Sale,
  merchant: Merchant,
  isOfficial = true
): Promise<boolean> {
  const html = buildBillPdfHtml(sale, merchant, isOfficial);
  const filename = `TaxInvoice-${sale.invoiceNumber || 'draft'}.pdf`;

  try {
    if (Platform.OS === 'web') {
      // Web: print dialog is the closest equivalent to exporting a PDF.
      await Print.printAsync({ html });
      return true;
    }

    const { uri } = await Print.printToFileAsync({ html });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert('Sharing unavailable', 'Sharing is not available on this device.');
      return false;
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: filename,
      UTI: 'com.adobe.pdf',
    });

    return true;
  } catch (err: any) {
    // User dismissed the share sheet — not an error to surface.
    if (err?.message?.includes('dismiss') || err?.code === 'ERR_SHARE_DISMISSED') {
      return false;
    }
    console.error('Failed to share bill PDF:', err);
    Alert.alert('Share failed', 'Could not create or share the invoice PDF.');
    return false;
  }
}
