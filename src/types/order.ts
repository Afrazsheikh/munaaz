import { CartItem } from './cart';

export interface Address {
  id: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: 'IN' | 'US';
  phone: string;
  isDefault?: boolean;
}

export type PaymentMethodType = 'razorpay' | 'upi' | 'card_in' | 'netbanking' | 'cod' | 'stripe' | 'card_us' | 'apple_pay';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  billingAddress: Address;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: 'INR' | 'USD';
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}
