import { useState, useMemo } from 'react';
import { useAppContext } from '@/store/AppContext';
import { Transaction } from '@/types/transaction';
import { AppConfig } from '@/constants/config';
import { getCurrentDateFormatted } from '@/utils/invoice';

export function useTransactions() {
  const { transactions, getTransactionById } = useAppContext();
  const [page, setPage] = useState<number>(1);
  const pageSize = AppConfig.historyPageSize;

  // Latest 10 for dashboard
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, AppConfig.dashboardRecentLimit);
  }, [transactions]);

  // Paginated list for Sales History (10 per page)
  const totalPages = Math.ceil(transactions.length / pageSize) || 1;

  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return transactions.slice(startIndex, startIndex + pageSize);
  }, [transactions, page, pageSize]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  // Today summary statistics for dashboard
  const todaySummary = useMemo(() => {
    const todayStr = getCurrentDateFormatted();
    const todayTxs = transactions.filter((t) => t.date === todayStr);

    const totalSalesCount = todayTxs.length;
    const totalVolume = todayTxs.reduce((sum, t) => sum + (t.paymentStatus === 'paid' ? t.amount : 0), 0);
    const fonepayCount = todayTxs.filter((t) => t.paymentMode === 'fonepay' && t.paymentStatus === 'paid').length;
    const cashCount = todayTxs.filter((t) => t.paymentMode === 'cash' && t.paymentStatus === 'paid').length;
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
    paginatedTransactions,
    page,
    totalPages,
    pageSize,
    totalCount: transactions.length,
    goToPage,
    nextPage,
    prevPage,
    todaySummary,
    getTransactionById,
  };
}
