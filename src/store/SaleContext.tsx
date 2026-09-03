import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Sale, SaleItem } from '@/types/sale';
import { PaymentMode, PaymentStatus } from '@/types/payment';
import { Transaction } from '@/types/transaction';
import {
  calculateItemAmount,
  calculateSubtotal,
  calculateNetAmount,
  convertAmountToWords,
} from '@/utils/calculations';
import {
  generateInvoiceNumber,
  generateTransactionId,
  getCurrentDateFormatted,
  getCurrentTimeFormatted,
} from '@/utils/invoice';
import { useAppContext } from './AppContext';

interface SaleContextType {
  currentSale: Sale;
  hasItems: boolean;
  isValidToPreview: boolean;
  initNewSale: () => void;
  addItem: (item: { particulars: string; quantity: number; rate: number }) => void;
  updateItem: (id: string, updates: Partial<{ particulars: string; quantity: number; rate: number }>) => void;
  removeItem: (id: string) => void;
  setDiscount: (discount: number) => void;
  setCustomerInfo: (name?: string, phone?: string, notes?: string) => void;
  setPaymentMode: (mode: PaymentMode) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  completeSale: () => Transaction;
  resetSale: () => void;
}

function createFreshSale(): Sale {
  const date = getCurrentDateFormatted();
  const time = getCurrentTimeFormatted();
  const id = `sale-${Date.now()}`;
  const invoiceNumber = generateInvoiceNumber();
  const transactionId = generateTransactionId();

  return {
    id,
    invoiceNumber,
    invoiceDate: date,
    invoiceTime: time,
    transactionId,
    items: [],
    subtotal: 0,
    discount: 0,
    netAmount: 0,
    paymentMode: null,
    paymentStatus: null,
    amountInWords: 'Zero Rupees Only',
    createdAt: new Date().toISOString(),
  };
}

const SaleContext = createContext<SaleContextType | undefined>(undefined);

export function SaleContextProvider({ children }: { children: React.ReactNode }) {
  const { addTransaction } = useAppContext();
  const [currentSale, setCurrentSale] = useState<Sale>(createFreshSale);

  const initNewSale = useCallback(() => {
    setCurrentSale(createFreshSale());
  }, []);

  const resetSale = useCallback(() => {
    setCurrentSale(createFreshSale());
  }, []);

  const recalculateSale = (items: SaleItem[], discount: number, baseSale: Sale): Sale => {
    const subtotal = calculateSubtotal(items);
    const netAmount = calculateNetAmount(subtotal, discount);
    const amountInWords = convertAmountToWords(netAmount);

    return {
      ...baseSale,
      items,
      subtotal,
      discount,
      netAmount,
      amountInWords,
    };
  };

  const addItem = useCallback(
    ({ particulars, quantity, rate }: { particulars: string; quantity: number; rate: number }) => {
      setCurrentSale((prev) => {
        const newItem: SaleItem = {
          id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          particulars: particulars.trim(),
          quantity,
          rate,
          amount: calculateItemAmount(quantity, rate),
        };
        const updatedItems = [...prev.items, newItem];
        return recalculateSale(updatedItems, prev.discount, prev);
      });
    },
    []
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<{ particulars: string; quantity: number; rate: number }>) => {
      setCurrentSale((prev) => {
        const updatedItems = prev.items.map((item) => {
          if (item.id !== id) return item;
          const particulars = updates.particulars !== undefined ? updates.particulars.trim() : item.particulars;
          const quantity = updates.quantity !== undefined ? updates.quantity : item.quantity;
          const rate = updates.rate !== undefined ? updates.rate : item.rate;
          return {
            ...item,
            particulars,
            quantity,
            rate,
            amount: calculateItemAmount(quantity, rate),
          };
        });
        return recalculateSale(updatedItems, prev.discount, prev);
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setCurrentSale((prev) => {
      const updatedItems = prev.items.filter((item) => item.id !== id);
      return recalculateSale(updatedItems, prev.discount, prev);
    });
  }, []);

  const setDiscount = useCallback((discount: number) => {
    setCurrentSale((prev) => {
      const validDiscount = Math.max(0, isNaN(discount) ? 0 : discount);
      return recalculateSale(prev.items, validDiscount, prev);
    });
  }, []);

  const setCustomerInfo = useCallback((name?: string, phone?: string, notes?: string) => {
    setCurrentSale((prev) => ({
      ...prev,
      customerName: name?.trim() || undefined,
      customerPhone: phone?.trim() || undefined,
      notes: notes?.trim() || undefined,
    }));
  }, []);

  const setPaymentMode = useCallback((mode: PaymentMode) => {
    setCurrentSale((prev) => ({
      ...prev,
      paymentMode: mode,
    }));
  }, []);

  const setPaymentStatus = useCallback((status: PaymentStatus) => {
    setCurrentSale((prev) => ({
      ...prev,
      paymentStatus: status,
    }));
  }, []);

  const completeSale = useCallback((): Transaction => {
    const transaction: Transaction = {
      id: currentSale.id,
      invoiceNumber: currentSale.invoiceNumber,
      date: currentSale.invoiceDate,
      time: currentSale.invoiceTime,
      amount: currentSale.netAmount,
      paymentMode: currentSale.paymentMode || 'cash',
      paymentStatus: currentSale.paymentStatus || 'paid',
      itemsCount: currentSale.items.length,
      customerName: currentSale.customerName,
      saleDetails: currentSale,
    };

    addTransaction(transaction);
    return transaction;
  }, [currentSale, addTransaction]);

  const hasItems = currentSale.items.length > 0;
  const isValidToPreview = hasItems && currentSale.netAmount >= 0;

  const value = useMemo(
    () => ({
      currentSale,
      hasItems,
      isValidToPreview,
      initNewSale,
      addItem,
      updateItem,
      removeItem,
      setDiscount,
      setCustomerInfo,
      setPaymentMode,
      setPaymentStatus,
      completeSale,
      resetSale,
    }),
    [
      currentSale,
      hasItems,
      isValidToPreview,
      initNewSale,
      addItem,
      updateItem,
      removeItem,
      setDiscount,
      setCustomerInfo,
      setPaymentMode,
      setPaymentStatus,
      completeSale,
      resetSale,
    ]
  );

  return <SaleContext.Provider value={value}>{children}</SaleContext.Provider>;
}

export function useSaleContext(): SaleContextType {
  const context = useContext(SaleContext);
  if (!context) {
    throw new Error('useSaleContext must be used within a SaleContextProvider');
  }
  return context;
}
