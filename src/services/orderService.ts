import type { Address, CartItem, Order, PaymentResult } from '@/types';
import { ORDERS_STORAGE_KEY, ORDER_COUNTER_STORAGE_KEY } from '@/lib/constants';
import { mockRequest } from './api/httpClient';

function nextOrderNumber(): string {
  const year = new Date().getFullYear();
  const raw = localStorage.getItem(ORDER_COUNTER_STORAGE_KEY);
  const next = raw ? Number(raw) + 1 : 1;
  localStorage.setItem(ORDER_COUNTER_STORAGE_KEY, String(next));
  return `MP-${year}-${String(next).padStart(6, '0')}`;
}

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export const orderService = {
  createOrder(params: {
    items: CartItem[];
    address: Address;
    paymentResult: PaymentResult;
    shippingClp: number;
  }): Promise<Order> {
    // productName/productSlug/imageUrl come from each cart item's own snapshot (see the
    // addItem comment in cartStore.ts), taken at add-time and never refreshed. Unlike the
    // stock snapshot (a UI cap that's just wrong until the page reloads), this one is written
    // into an order that's kept indefinitely: if a product's slug changes on the backend after
    // it was added to a cart that later checks out, that order's "view product" link 404s
    // forever. Accepted for the same reason (cart/checkout is client-only for now) -- revisit
    // if orders start being read back against a live catalog.
    const lineItems = params.items.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      productSlug: item.product.slug,
      imageUrl: item.product.images[0]?.url ?? '',
      quantity: item.quantity,
      unitPriceClp: item.unitPriceClp,
      subtotalClp: item.unitPriceClp * item.quantity,
    }));

    const subtotalClp = lineItems.reduce((sum, li) => sum + li.subtotalClp, 0);

    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: nextOrderNumber(),
      items: lineItems,
      address: params.address,
      paymentResult: params.paymentResult,
      subtotalClp,
      shippingClp: params.shippingClp,
      totalClp: subtotalClp + params.shippingClp,
      status: params.paymentResult.status === 'authorized' ? 'paid' : 'created',
      createdAt: new Date().toISOString(),
    };

    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);

    return mockRequest(order, { delayMs: 150 });
  },

  getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return mockRequest(readOrders().find((o) => o.orderNumber === orderNumber), { delayMs: 150 });
  },
};
