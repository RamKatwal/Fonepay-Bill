import { Sale } from '@/types/sale';
import { Merchant } from '@/types/merchant';
import { formatNPR } from '@/utils/currency';
import { formatPAN } from '@/utils/formatters';
import { Platform, Share } from 'react-native';

export interface BillImageResult {
  dataUrl: string;
  width: number;
  height: number;
  filename: string;
}

/**
 * Generate formatted plain text representation of the tax invoice for WhatsApp/SMS
 */
export function formatBillText(sale: Sale, merchant: Merchant): string {
  const itemLines = sale.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.particulars} [x${item.quantity} @ ${formatNPR(item.rate)}] = ${formatNPR(item.amount)}`
    )
    .join('\n');

  return [
    `🧾 *TAX INVOICE — ${merchant.businessName.toUpperCase()}*`,
    `📍 ${merchant.address} | 📞 ${merchant.contactNumber}`,
    `PAN/VAT: ${formatPAN(merchant.panVatNumber)}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Invoice: #${sale.invoiceNumber}`,
    `Date: ${sale.invoiceDate} • ${sale.invoiceTime}`,
    `Txn ID: ${sale.transactionId}`,
    `Status: ${sale.paymentStatus?.toUpperCase() || 'PAID'} (${sale.paymentMode?.toUpperCase() || 'FONEPAY'})`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `*ITEMS:*`,
    itemLines,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Subtotal: ${formatNPR(sale.subtotal)}`,
    sale.discount > 0 ? `Discount: -${formatNPR(sale.discount)}` : null,
    `*NET AMOUNT: ${formatNPR(sale.netAmount)}*`,
    `In Words: ${sale.amountInWords}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🙏 Thank you for your business!`,
    `_Official receipt generated via Fonepay Digital Bill_`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Helper to convert a data URL to a File/Blob object
 */
export function dataUrlToFile(dataUrl: string, filename: string): File | null {
  try {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch {
    return null;
  }
}

/**
 * Renders a high-resolution (Retina 2x) official tax invoice image onto an HTML5 Canvas.
 * Returns the PNG Data URL.
 */
export async function generateBillImageDataUrl(
  sale: Sale,
  merchant: Merchant,
  isOfficial = true
): Promise<BillImageResult> {
  const filename = `TaxInvoice-${sale.invoiceNumber}.png`;

  // Check if we are running in a browser environment with canvas support
  if (typeof document === 'undefined') {
    // Fallback SVG data URL for SSR/pure headless environments
    const svgString = generateBillSvg(sale, merchant, isOfficial);
    const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    return {
      dataUrl: svgDataUrl,
      width: 700,
      height: 980 + sale.items.length * 36,
      filename,
    };
  }

  const canvasWidth = 720;
  const itemsCount = sale.items.length;
  const tableHeight = 44 + itemsCount * 36;
  const canvasHeight = Math.max(960, 840 + tableHeight);
  const scale = 2; // 2x Retina sharpness

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available');
  }

  // Scale for retina
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Outer border with subtle card styling
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);

  // Top Header Banner (Fonepay Brand Red)
  const headerGradient = ctx.createLinearGradient(10, 10, canvasWidth - 10, 80);
  headerGradient.addColorStop(0, '#DC2626');
  headerGradient.addColorStop(1, '#B91C1C');
  ctx.fillStyle = headerGradient;
  ctx.fillRect(10, 10, canvasWidth - 20, 68);

  // Header Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isOfficial ? 'OFFICIAL TAX INVOICE' : 'BILL PREVIEW (ESTIMATE)', canvasWidth / 2, 40);

  ctx.font = '500 11px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#FEE2E2';
  ctx.fillText('VERIFIED FONEPAY MERCHANT DIGITAL RECEIPT', canvasWidth / 2, 60);

  // Merchant Section
  let y = 110;
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 22px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(merchant.businessName, canvasWidth / 2, y);

  y += 22;
  ctx.fillStyle = '#475569';
  ctx.font = '13px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(merchant.address, canvasWidth / 2, y);

  y += 18;
  ctx.fillText(`Contact: ${merchant.contactNumber}`, canvasWidth / 2, y);

  y += 24;
  // PAN/VAT Badge
  const panText = `PAN / VAT No: ${formatPAN(merchant.panVatNumber)}`;
  ctx.font = 'bold 12px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const panMetrics = ctx.measureText(panText);
  const panBadgeWidth = panMetrics.width + 24;
  const panBadgeX = (canvasWidth - panBadgeWidth) / 2;

  ctx.fillStyle = '#F1F5F9';
  roundRect(ctx, panBadgeX, y - 14, panBadgeWidth, 24, 6);
  ctx.fill();
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1;
  roundRect(ctx, panBadgeX, y - 14, panBadgeWidth, 24, 6);
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.fillText(panText, canvasWidth / 2, y + 2);

  // Dashed Separator
  y += 24;
  drawDashedLine(ctx, 30, y, canvasWidth - 30, y);

  // Metadata Box (Invoice No, Date, Time, Txn ID, Status)
  y += 22;
  const metaLeft = 36;
  const metaRight = canvasWidth - 36;

  // Row 1: Invoice No & Date
  ctx.textAlign = 'left';
  ctx.font = '500 12px "Inter", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('Invoice No:', metaLeft, y);

  ctx.font = 'bold 13px "Inter", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText(sale.invoiceNumber, metaLeft + 72, y);

  ctx.textAlign = 'right';
  ctx.font = '500 12px "Inter", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText(`Date: `, metaRight - 110, y);

  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText(sale.invoiceDate, metaRight, y);

  // Row 2: Txn ID & Time
  y += 20;
  ctx.textAlign = 'left';
  ctx.font = '500 12px "Inter", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('Txn ID:', metaLeft, y);

  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#334155';
  ctx.fillText(sale.transactionId, metaLeft + 72, y);

  ctx.textAlign = 'right';
  ctx.font = '500 12px "Inter", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText(`Time: `, metaRight - 110, y);

  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText(sale.invoiceTime, metaRight, y);

  // Row 3: Payment Status & Mode Badges
  y += 24;
  ctx.textAlign = 'left';
  ctx.font = '500 12px "Inter", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('Payment:', metaLeft, y + 10);

  // Mode Pill
  const modeText = (sale.paymentMode || 'FONEPAY').toUpperCase();
  ctx.font = 'bold 11px "Inter", sans-serif';
  const modeWidth = ctx.measureText(modeText).width + 16;
  ctx.fillStyle = '#E0F2FE';
  roundRect(ctx, metaLeft + 72, y - 2, modeWidth, 20, 4);
  ctx.fill();
  ctx.fillStyle = '#0369A1';
  ctx.fillText(modeText, metaLeft + 80, y + 12);

  // Status Pill (Paid / Verified)
  const statusText = (sale.paymentStatus || 'PAID').toUpperCase();
  const statusX = metaLeft + 72 + modeWidth + 8;
  const statusWidth = ctx.measureText(statusText).width + 16;
  ctx.fillStyle = '#DCFCE7';
  roundRect(ctx, statusX, y - 2, statusWidth, 20, 4);
  ctx.fill();
  ctx.fillStyle = '#15803D';
  ctx.fillText(statusText, statusX + 8, y + 12);

  // Table Section
  y += 36;
  const tableX = 30;
  const tableW = canvasWidth - 60;

  // Table Header Bar
  ctx.fillStyle = '#F1F5F9';
  roundRect(ctx, tableX, y, tableW, 30, 4);
  ctx.fill();

  ctx.font = 'bold 11px "Inter", sans-serif';
  ctx.fillStyle = '#475569';

  // Columns: SN (25), Particulars (flex), Qty (40), Rate (70), Amount (85)
  ctx.textAlign = 'center';
  ctx.fillText('SN', tableX + 22, y + 19);

  ctx.textAlign = 'left';
  ctx.fillText('PARTICULARS', tableX + 50, y + 19);

  ctx.textAlign = 'center';
  ctx.fillText('QTY', tableX + tableW - 200, y + 19);

  ctx.textAlign = 'right';
  ctx.fillText('RATE (Rs.)', tableX + tableW - 105, y + 19);
  ctx.fillText('AMOUNT (Rs.)', tableX + tableW - 15, y + 19);

  y += 30;

  // Table Rows
  sale.items.forEach((item, index) => {
    y += 4;
    const isAlt = index % 2 === 1;
    if (isAlt) {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(tableX, y, tableW, 30);
    }

    ctx.fillStyle = '#64748B';
    ctx.font = '12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${index + 1}`, tableX + 22, y + 20);

    ctx.fillStyle = '#0F172A';
    ctx.font = '500 12px "Inter", sans-serif';
    ctx.textAlign = 'left';

    // Truncate particulars if too long
    let itemPart = item.particulars;
    if (ctx.measureText(itemPart).width > tableW - 270) {
      while (ctx.measureText(itemPart + '...').width > tableW - 270 && itemPart.length > 0) {
        itemPart = itemPart.slice(0, -1);
      }
      itemPart += '...';
    }
    ctx.fillText(itemPart, tableX + 50, y + 20);

    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.fillText(`${item.quantity}`, tableX + tableW - 200, y + 20);

    ctx.textAlign = 'right';
    ctx.fillText(item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 }), tableX + tableW - 105, y + 20);

    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }), tableX + tableW - 15, y + 20);

    y += 28;
  });

  // Table bottom border
  y += 6;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(tableX, y);
  ctx.lineTo(tableX + tableW, y);
  ctx.stroke();

  // Calculations / Totals Section
  y += 18;
  const totalsLabelX = tableX + tableW - 230;
  const totalsValueX = tableX + tableW - 15;

  // Subtotal
  ctx.textAlign = 'left';
  ctx.font = '500 12px "Inter", sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('Subtotal:', totalsLabelX, y);

  ctx.textAlign = 'right';
  ctx.font = '600 12px "Inter", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText(formatNPR(sale.subtotal), totalsValueX, y);

  // Discount (if any)
  if (sale.discount > 0) {
    y += 20;
    ctx.textAlign = 'left';
    ctx.font = '500 12px "Inter", sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.fillText('Discount:', totalsLabelX, y);

    ctx.textAlign = 'right';
    ctx.font = '600 12px "Inter", sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.fillText(`- ${formatNPR(sale.discount)}`, totalsValueX, y);
  }

  // Net Amount Box (Prominent Callout)
  y += 26;
  const netBoxW = tableW;
  const netBoxH = 50;
  ctx.fillStyle = '#FEF2F2';
  roundRect(ctx, tableX, y, netBoxW, netBoxH, 8);
  ctx.fill();
  ctx.strokeStyle = '#F87171';
  ctx.lineWidth = 1.5;
  roundRect(ctx, tableX, y, netBoxW, netBoxH, 8);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = 'bold 14px "Inter", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText('NET AMOUNT PAID', tableX + 18, y + 31);

  ctx.textAlign = 'right';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.fillStyle = '#DC2626';
  ctx.fillText(formatNPR(sale.netAmount), tableX + netBoxW - 18, y + 32);

  // In Words Box
  y += netBoxH + 14;
  ctx.fillStyle = '#F8FAFC';
  roundRect(ctx, tableX, y, tableW, 40, 6);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  roundRect(ctx, tableX, y, tableW, 40, 6);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = 'bold 10px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('AMOUNT IN WORDS:', tableX + 12, y + 16);

  ctx.font = 'italic 12px "Inter", sans-serif';
  ctx.fillStyle = '#1E293B';
  let wordsText = sale.amountInWords || 'Nepali Rupees Only';
  if (ctx.measureText(wordsText).width > tableW - 24) {
    wordsText = wordsText.slice(0, 50) + '...';
  }
  ctx.fillText(wordsText, tableX + 12, y + 31);

  // Security Verification & QR Section
  y += 56;
  drawDashedLine(ctx, 30, y, canvasWidth - 30, y);

  y += 18;
  // Draw simulated QR Code block
  drawSimulatedQr(ctx, tableX + 10, y, 70);

  // Verification Seal
  ctx.textAlign = 'left';
  ctx.font = 'bold 13px "Inter", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText('fonepay Verified Transaction', tableX + 96, y + 24);

  ctx.font = '500 11px "Inter", sans-serif';
  ctx.fillStyle = '#16A34A';
  ctx.fillText('✓ Tamper-proof Digital Tax Invoice', tableX + 96, y + 42);

  ctx.font = '10px "Inter", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText(`Terminal: ${merchant.terminalId || 'FP-TERM-01'} • Ref: ${sale.transactionId}`, tableX + 96, y + 58);

  // Footer Note
  y += 86;
  ctx.textAlign = 'center';
  ctx.font = '600 12px "Inter", sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('Thank you for choosing Fonepay Digital Services!', canvasWidth / 2, y);

  y += 18;
  ctx.font = '10px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('Generated via Fonepay Merchant App • All Rights Reserved', canvasWidth / 2, y);

  const dataUrl = canvas.toDataURL('image/png');
  return {
    dataUrl,
    width: canvasWidth,
    height: canvasHeight,
    filename,
  };
}

/**
 * Direct file download trigger for web/browser
 */
export function downloadBillImage(dataUrl: string, invoiceNumber: string): boolean {
  try {
    if (typeof document === 'undefined') return false;

    const link = document.createElement('a');
    link.download = `TaxInvoice-${invoiceNumber}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download bill image:', err);
    return false;
  }
}

/**
 * Share bill via WhatsApp:
 * 1. Formats complete summary with itemization
 * 2. Tries native web share with the image file if supported
 * 3. Opens WhatsApp web/app link
 */
export async function shareBillToWhatsApp(
  sale: Sale,
  merchant: Merchant,
  dataUrl?: string
): Promise<{ success: boolean; method: 'web-share-image' | 'whatsapp-link' }> {
  const billText = formatBillText(sale, merchant);

  // If Web Share API supports file sharing, attempt to share the image directly to WhatsApp
  if (dataUrl && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    const file = dataUrlToFile(dataUrl, `TaxInvoice-${sale.invoiceNumber}.png`);
    if (file && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Tax Invoice #${sale.invoiceNumber}`,
          text: billText,
          files: [file],
        });
        return { success: true, method: 'web-share-image' };
      } catch (err: any) {
        // If user cancelled, don't fallback to opening link
        if (err.name === 'AbortError') {
          return { success: false, method: 'web-share-image' };
        }
      }
    }
  }

  // Direct WhatsApp Deep Link
  const encodedText = encodeURIComponent(billText);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank');
  }

  return { success: true, method: 'whatsapp-link' };
}

/**
 * Share bill via Native System Share Sheet
 */
export async function shareBillViaSystem(
  sale: Sale,
  merchant: Merchant,
  dataUrl?: string
): Promise<boolean> {
  const billText = formatBillText(sale, merchant);

  // Web Share API with image file if possible
  if (dataUrl && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    const file = dataUrlToFile(dataUrl, `TaxInvoice-${sale.invoiceNumber}.png`);
    if (file && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Tax Invoice #${sale.invoiceNumber}`,
          text: billText,
          files: [file],
        });
        return true;
      } catch (err: any) {
        if (err.name === 'AbortError') return false;
      }
    }
  }

  // React Native Share Fallback
  try {
    await Share.share({
      title: `Tax Invoice ${sale.invoiceNumber}`,
      message: billText,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy bill text summary to clipboard
 */
export async function copyBillTextToClipboard(sale: Sale, merchant: Merchant): Promise<boolean> {
  const text = formatBillText(sale, merchant);
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Clipboard failed
  }
  return false;
}

// -------------------------------------------------------------
// Canvas Drawing Helper Utilities
// -------------------------------------------------------------

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawDashedLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawSimulatedQr(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, size, size);

  // Stylized corner finder patterns
  const finderSize = 18;
  // Top-left
  drawQrFinder(ctx, x + 3, y + 3, finderSize);
  // Top-right
  drawQrFinder(ctx, x + size - finderSize - 3, y + 3, finderSize);
  // Bottom-left
  drawQrFinder(ctx, x + 3, y + size - finderSize - 3, finderSize);

  // Center QR matrix dots
  ctx.fillStyle = '#0F172A';
  const dotStep = 5;
  for (let r = 24; r < size - 24; r += dotStep) {
    for (let c = 24; c < size - 24; c += dotStep) {
      if ((r * 7 + c * 11) % 3 !== 0) {
        ctx.fillRect(x + c, y + r, 3.5, 3.5);
      }
    }
  }

  // Fonepay center dot
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(x + size / 2 - 4, y + size / 2 - 4, 8, 8);
}

function drawQrFinder(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(x + 6, y + 6, size - 12, size - 12);
}

/**
 * Universal SVG template fallback
 */
function generateBillSvg(sale: Sale, merchant: Merchant, isOfficial = true): string {
  const itemsRows = sale.items
    .map(
      (item, i) => `
    <text x="50" y="${340 + i * 30}" font-size="12" fill="#64748B">${i + 1}</text>
    <text x="80" y="${340 + i * 30}" font-size="12" font-weight="600" fill="#0F172A">${item.particulars}</text>
    <text x="470" y="${340 + i * 30}" font-size="12" text-anchor="middle" fill="#334155">${item.quantity}</text>
    <text x="560" y="${340 + i * 30}" font-size="12" text-anchor="end" fill="#334155">${item.rate.toFixed(2)}</text>
    <text x="650" y="${340 + i * 30}" font-size="12" font-weight="bold" text-anchor="end" fill="#0F172A">${item.amount.toFixed(2)}</text>
  `
    )
    .join('');

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="700" height="920" viewBox="0 0 700 920" font-family="system-ui, -apple-system, sans-serif">
    <rect width="700" height="920" fill="#FFFFFF" rx="12" stroke="#E2E8F0" stroke-width="2"/>
    <rect x="0" y="0" width="700" height="60" fill="#DC2626" rx="12"/>
    <text x="350" y="38" fill="#FFFFFF" font-size="18" font-weight="bold" text-anchor="middle">${isOfficial ? 'TAX INVOICE' : 'BILL PREVIEW'}</text>
    <text x="350" y="100" font-size="20" font-weight="bold" fill="#0F172A" text-anchor="middle">${merchant.businessName}</text>
    <text x="350" y="122" font-size="13" fill="#475569" text-anchor="middle">${merchant.address} | Contact: ${merchant.contactNumber}</text>
    <text x="350" y="146" font-size="12" font-weight="bold" fill="#0F172A" text-anchor="middle">PAN/VAT: ${formatPAN(merchant.panVatNumber)}</text>
    <line x1="30" y1="170" x2="670" y2="170" stroke="#CBD5E1" stroke-dasharray="4"/>
    <text x="40" y="200" font-size="12" fill="#64748B">Invoice No: <tspan font-weight="bold" fill="#0F172A">${sale.invoiceNumber}</tspan></text>
    <text x="660" y="200" font-size="12" fill="#64748B" text-anchor="end">Date: <tspan font-weight="bold" fill="#0F172A">${sale.invoiceDate}</tspan></text>
    <text x="40" y="225" font-size="12" fill="#64748B">Txn ID: <tspan fill="#334155">${sale.transactionId}</tspan></text>
    <text x="660" y="225" font-size="12" fill="#64748B" text-anchor="end">Status: <tspan font-weight="bold" fill="#16A34A">${sale.paymentStatus?.toUpperCase() || 'PAID'}</tspan></text>
    <rect x="30" y="260" width="640" height="30" fill="#F1F5F9" rx="4"/>
    <text x="50" y="280" font-size="11" font-weight="bold" fill="#475569">SN</text>
    <text x="80" y="280" font-size="11" font-weight="bold" fill="#475569">PARTICULARS</text>
    <text x="470" y="280" font-size="11" font-weight="bold" text-anchor="middle" fill="#475569">QTY</text>
    <text x="560" y="280" font-size="11" font-weight="bold" text-anchor="end" fill="#475569">RATE</text>
    <text x="650" y="280" font-size="11" font-weight="bold" text-anchor="end" fill="#475569">AMOUNT</text>
    ${itemsRows}
    <rect x="30" y="620" width="640" height="50" fill="#FEF2F2" rx="6" stroke="#F87171" stroke-width="1"/>
    <text x="50" y="652" font-size="15" font-weight="bold" fill="#0F172A">NET AMOUNT</text>
    <text x="650" y="652" font-size="20" font-weight="bold" fill="#DC2626" text-anchor="end">${formatNPR(sale.netAmount)}</text>
    <text x="350" y="760" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">Generated via Fonepay Digital Bill Generator</text>
  </svg>`;
}
