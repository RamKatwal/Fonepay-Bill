import React, { createContext, useContext, useState, useMemo } from 'react';
import { Merchant } from '@/types/merchant';
import { Transaction } from '@/types/transaction';
import { mockMerchant } from '@/data/mockMerchant';
import { mockTransactions } from '@/data/mockTransactions';

interface AppContextType {
  merchant: Merchant;
  isConsented: boolean;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  giveConsent: () => void;
  loginWithFonepay: () => Promise<void>;
  logout: () => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  getTransactionById: (id: string) => Transaction | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [merchant] = useState<Merchant>(mockMerchant);
  const [isConsented, setIsConsented] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const giveConsent = () => {
    setIsConsented(true);
  };

  const loginWithFonepay = async () => {
    setIsLoadingAuth(true);
    // Simulate brief Fonepay auth handshake
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsConsented(true);
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsConsented(false);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const getTransactionById = (id: string): Transaction | undefined => {
    return transactions.find((tx) => tx.id === id || tx.invoiceNumber === id);
  };

  const value = useMemo(
    () => ({
      merchant,
      isConsented,
      isAuthenticated,
      isLoadingAuth,
      giveConsent,
      loginWithFonepay,
      logout,
      transactions,
      addTransaction,
      getTransactionById,
    }),
    [merchant, isConsented, isAuthenticated, isLoadingAuth, transactions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
