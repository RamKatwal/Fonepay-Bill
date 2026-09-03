let invoiceSequence = 125;

/**
 * Generates an invoice number in the format INV-000125
 */
export function generateInvoiceNumber(seq?: number): string {
  const currentSeq = seq !== undefined ? seq : ++invoiceSequence;
  return `INV-${String(currentSeq).padStart(6, '0')}`;
}

/**
 * Generates a realistic Fonepay simulated transaction ID
 */
export function generateTransactionId(): string {
  const randomPart = Math.floor(10000000 + Math.random() * 90000000);
  return `FP-${randomPart}`;
}

/**
 * Returns formatted date string: YYYY-MM-DD
 */
export function getCurrentDateFormatted(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns formatted time string: hh:mm AM/PM
 */
export function getCurrentTimeFormatted(date: Date = new Date()): string {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}
