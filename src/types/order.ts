import type { Address } from './address';
import type { PaymentResult } from './payment';

export type OrderStatus = 'created' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLineItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  quantity: number;
  unitPriceClp: number;
  subtotalClp: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderLineItem[];
  address: Address;
  paymentResult: PaymentResult;
  subtotalClp: number;
  shippingClp: number;
  totalClp: number;
  status: OrderStatus;
  createdAt: string;
}
