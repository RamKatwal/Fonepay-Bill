import { useCallback, useState } from 'react';
import { PaymentStatus } from '@/types/payment';
import { AppConfig } from '@/constants/config';
import { useSaleContext } from '@/store/SaleContext';

export function usePayment() {
  const { setPaymentStatus, setPaymentMode } = useSaleContext();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [paymentStatus, setLocalStatus] = useState<PaymentStatus>('pending');

  const simulateSuccess = useCallback(async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, AppConfig.simulatedVerificationDelayMs));
    setIsVerifying(false);
    setLocalStatus('paid');
    setPaymentMode('fonepay');
    setPaymentStatus('paid');
  }, [setPaymentMode, setPaymentStatus]);

  const simulateFailure = useCallback(async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, AppConfig.simulatedVerificationDelayMs));
    setIsVerifying(false);
    setLocalStatus('failed');
    setPaymentMode('fonepay');
    setPaymentStatus('failed');
  }, [setPaymentMode, setPaymentStatus]);

  const resetSimulatedPayment = useCallback(() => {
    setIsVerifying(false);
    setLocalStatus('pending');
    setPaymentStatus('pending');
  }, [setPaymentStatus]);

  return {
    paymentStatus,
    isVerifying,
    simulateSuccess,
    simulateFailure,
    resetSimulatedPayment,
  };
}
