import { useMemo } from 'react';
import { useAppContext } from '@/store/AppContext';
import { AppConfig } from '@/constants/config';
import { getCurrentDateFormatted } from '@/utils/invoice';

export function useTransactions() {
  const { transactions, getTransactionById } = useAppContext();

  // Latest N for dashboard
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, AppConfig.dashboardRecentLimit);
  }, [transactions]);

  // Today summary statistics for dashboard
  const todaySummary = useMemo(() => {
    const todayStr = getCurrentDateFormatted();
    const todayTxs = transactions.filter((t) => t.date === todayStr);

    const totalSalesCount = todayTxs.length;
    const totalVolume = todayTxs.reduce(
      (sum, t) => sum + (t.paymentStatus === 'paid' ? t.amount : 0),
      0
    );
    const fonepayCount = todayTxs.filter(
      (t) => t.paymentMode === 'fonepay' && t.paymentStatus === 'paid'
    ).length;
    const cashCount = todayTxs.filter(
      (t) => t.paymentMode === 'cash' && t.paymentStatus === 'paid'
    ).length;
    const fonepayVolume = todayTxs
      .filter((t) => t.paymentMode === 'fonepay' && t.paymentStatus === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);
    const cashVolume = todayTxs
      .filter((t) => t.paymentMode === 'cash' && t.paymentStatus === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      todayStr,
      totalSalesCount,
      totalVolume,
      fonepayCount,
      cashCount,
      fonepayVolume,
      cashVolume,
    };
  }, [transactions]);

  return {
    allTransactions: transactions,
    recentTransactions,
    totalCount: transactions.length,
    todaySummary,
    getTransactionById,
  };
}
