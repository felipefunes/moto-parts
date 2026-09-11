export interface CartLineProduct {
  slug: string;
  name: string;
  brand: string;
  stock: number;
  images: { url: string; alt: string }[];
}

export interface CartItem {
  productId: string;
  product: CartLineProduct;
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
