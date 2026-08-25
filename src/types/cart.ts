export interface CartItem {
  productId: string;
  quantity: number;
  unitPriceClp: number;
  addedAt: string;
}

export interface CartSummary {
  items: CartItem[];
  subtotalClp: number;
  shippingClp: number;
  totalClp: number;
}
