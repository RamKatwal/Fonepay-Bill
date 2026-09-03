/**
 * Formats a number as Nepali Rupees (Rs. X,XX,XXX.XX or Rs. X,XXX)
 */
export function formatNPR(amount: number, includeDecimals = false): string {
  if (isNaN(amount)) {
    return includeDecimals ? 'Rs. 0.00' : 'Rs. 0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const parts = absAmount.toFixed(includeDecimals ? 2 : 0).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // South Asian numbering format (last 3 digits, then groups of 2)
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    integerPart = `${formattedOthers},${lastThree}`;
  }

  const prefix = isNegative ? '-Rs. ' : 'Rs. ';
  return includeDecimals && decimalPart
    ? `${prefix}${integerPart}.${decimalPart}`
    : `${prefix}${integerPart}`;
}
