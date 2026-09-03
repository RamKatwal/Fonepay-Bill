/**
 * Formats a 9-digit PAN/VAT number for readability: XXX-XXX-XXX
 */
export function formatPAN(pan: string): string {
  if (!pan) return '';
  const cleaned = pan.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return pan;
}

/**
 * Formats a 10-digit Nepal mobile number: 98X-XXXXXXX
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned;
}

/**
 * Formats date string into human-friendly representation
 */
export function formatDatePretty(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
