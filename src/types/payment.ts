export type PaymentMethodType = 'webpay_plus' | 'mercado_pago' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'authorized' | 'rejected' | 'failed';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  description: string;
}

export interface PaymentResult {
  transactionId: string;
  status: PaymentStatus;
  authorizationCode?: string;
  paymentMethod: PaymentMethodType;
  amountClp: number;
  cardLast4?: string;
  paidAt?: string;
}
