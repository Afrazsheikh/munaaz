import { Product } from './product';

export interface CartItem {
  id: string; // unique item key in cart: `${productId}-${color}-${size}`
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  unitPriceINR: number;
  unitPriceUSD: number;
}

export interface CouponCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g., 10 for 10% off or 500 for ₹500 off
  minSubtotalINR: number;
  minSubtotalUSD: number;
}
