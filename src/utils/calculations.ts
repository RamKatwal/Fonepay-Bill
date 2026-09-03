import { SaleItem } from '@/types/sale';

/**
 * Calculates line-item total amount: quantity * rate
 */
export function calculateItemAmount(quantity: number, rate: number): number {
  const q = isNaN(quantity) ? 0 : Math.max(0, quantity);
  const r = isNaN(rate) ? 0 : Math.max(0, rate);
  return Math.round(q * r * 100) / 100;
}

/**
 * Calculates sum of all item amounts
 */
export function calculateSubtotal(items: SaleItem[]): number {
  const sum = items.reduce((acc, item) => acc + (item.amount || 0), 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Normalizes discount amount (cannot be negative)
 */
export function calculateDiscount(discount: number): number {
  const d = isNaN(discount) ? 0 : Math.max(0, discount);
  return Math.round(d * 100) / 100;
}

/**
 * Calculates net amount: subtotal - discount (minimum 0)
 */
export function calculateNetAmount(subtotal: number, discount: number): number {
  const sub = Math.max(0, subtotal || 0);
  const disc = Math.max(0, discount || 0);
  return Math.max(0, Math.round((sub - disc) * 100) / 100);
}

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertThreeDigitChunk(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ONES[n % 10] : '');
  } else if (n > 0) {
    str += ONES[n];
  }
  return str.trim();
}

/**
 * Converts numeric amount to words in Nepali / South Asian numbering style
 * (Crores, Lakhs, Thousands, Hundreds, Rupees Only)
 */
export function convertAmountToWords(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return 'Zero Rupees Only';
  }

  const integerPart = Math.floor(Math.abs(amount));
  const paisaPart = Math.round((Math.abs(amount) - integerPart) * 100);

  if (integerPart === 0 && paisaPart > 0) {
    return `${convertThreeDigitChunk(paisaPart)} Paisa Only`;
  }

  let num = integerPart;
  let words = '';

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  if (crore > 0) {
    words += convertThreeDigitChunk(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertThreeDigitChunk(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertThreeDigitChunk(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    words += ONES[hundred] + ' Hundred ';
  }
  if (remainder > 0) {
    if (words !== '') words += 'and ';
    words += convertThreeDigitChunk(remainder) + ' ';
  }

  words = words.trim() + ' Rupees';

  if (paisaPart > 0) {
    words += ` and ${convertThreeDigitChunk(paisaPart)} Paisa`;
  }

  return words + ' Only';
}
