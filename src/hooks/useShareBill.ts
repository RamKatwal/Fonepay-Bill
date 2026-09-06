import { useCallback, useState } from 'react';
import { Sale } from '@/types/sale';
import { Merchant } from '@/types/merchant';
import { shareBillAsPdf } from '@/utils/shareBillPdf';

/**
 * Opens the native OS share sheet with a PDF invoice.
 */
export function useShareBill() {
  const [isSharing, setIsSharing] = useState(false);

  const shareBill = useCallback(
    async (sale: Sale, merchant: Merchant, isOfficial = true) => {
      if (isSharing) return;
      setIsSharing(true);
      try {
        await shareBillAsPdf(sale, merchant, isOfficial);
      } finally {
        setIsSharing(false);
      }
    },
    [isSharing]
  );

  return { shareBill, isSharing };
}
