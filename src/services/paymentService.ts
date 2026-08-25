import type { PaymentMethod, PaymentMethodType, PaymentResult } from '@/types';
import { mockRequest } from './api/httpClient';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'webpay_plus',
    type: 'webpay_plus',
    label: 'Webpay Plus',
    description: 'Débito o crédito, todos los bancos. Simulación de Transbank.',
  },
  {
    id: 'mercado_pago',
    type: 'mercado_pago',
    label: 'Mercado Pago',
    description: 'Paga con tu cuenta o tarjeta asociada.',
  },
  {
    id: 'bank_transfer',
    type: 'bank_transfer',
    label: 'Transferencia bancaria',
    description: 'Datos de transferencia al confirmar el pedido.',
  },
];

function randomTransactionId(): string {
  return `TBK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function randomAuthCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export interface MockCardInput {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  installments: number;
}

/**
 * Simula el ciclo completo de una pasarela de pago chilena estilo Webpay Plus:
 * "iniciar transacción" -> "procesar" -> "resultado". Sin backend, todo ocurre
 * dentro del propio SPA con demoras artificiales para simular el redirect real.
 * El día que exista integración real con Transbank, solo cambia la implementación
 * interna de `confirmTransaction`, no su firma.
 */
export const paymentService = {
  getPaymentMethods: (): Promise<PaymentMethod[]> => mockRequest(PAYMENT_METHODS),

  async confirmTransaction(
    methodType: PaymentMethodType,
    amountClp: number,
    card?: MockCardInput,
  ): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // Una tarjeta que termina en "0000" simula un rechazo, útil para demos.
    const isRejected = card?.cardNumber?.replace(/\s/g, '').endsWith('0000');

    if (isRejected) {
      return {
        transactionId: randomTransactionId(),
        status: 'rejected',
        paymentMethod: methodType,
        amountClp,
      };
    }

    return {
      transactionId: randomTransactionId(),
      status: 'authorized',
      authorizationCode: randomAuthCode(),
      paymentMethod: methodType,
      amountClp,
      cardLast4: card?.cardNumber ? card.cardNumber.replace(/\s/g, '').slice(-4) : undefined,
      paidAt: new Date().toISOString(),
    };
  },
};
