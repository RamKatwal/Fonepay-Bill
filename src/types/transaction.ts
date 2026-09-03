import { PaymentMode, PaymentStatus } from './payment';
import { Sale } from './sale';

export interface Transaction {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  amount: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  itemsCount: number;
  customerName?: string;
  saleDetails: Sale;
}

export interface TransactionFilters {
  searchQuery?: string;
  paymentMode?: PaymentMode | 'all';
  paymentStatus?: PaymentStatus | 'all';
}
