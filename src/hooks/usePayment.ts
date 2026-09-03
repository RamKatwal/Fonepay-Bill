import { useState } from 'react';
import { PaymentStatus } from '@/types/payment';
import { AppConfig } from '@/constants/config';
import { useSaleContext } from '@/store/SaleContext';

export function usePayment() {
  const { setPaymentStatus, setPaymentMode } = useSaleContext();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [paymentStatus, setLocalStatus] = useState<PaymentStatus>('pending');

  const simulateSuccess = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, AppConfig.simulatedVerificationDelayMs));
    setIsVerifying(false);
    setLocalStatus('paid');
    setPaymentMode('fonepay');
    setPaymentStatus('paid');
  };

  const simulateFailure = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, AppConfig.simulatedVerificationDelayMs));
    setIsVerifying(false);
    setLocalStatus('failed');
    setPaymentMode('fonepay');
    setPaymentStatus('failed');
  };

  const resetSimulatedPayment = () => {
    setIsVerifying(false);
    setLocalStatus('pending');
    setPaymentStatus('pending');
  };

  return {
    paymentStatus,
    isVerifying,
    simulateSuccess,
    simulateFailure,
    resetSimulatedPayment,
  };
}
