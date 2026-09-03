export type PaymentMode = 'cash' | 'fonepay';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface PaymentDetails {
  mode: PaymentMode;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  referenceCode?: string;
  payerName?: string;
}
