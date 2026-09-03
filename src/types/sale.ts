import { PaymentMode, PaymentStatus } from './payment';

export interface SaleItem {
  id: string;
  particulars: string;
  quantity: number;
  rate: number;
  amount: number; // quantity * rate
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD or formatted date
  invoiceTime: string; // HH:mm AM/PM
  transactionId: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  netAmount: number;
  paymentMode: PaymentMode | null;
  paymentStatus: PaymentStatus | null;
  amountInWords: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateSaleInput {
  items: SaleItem[];
  discount?: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}
