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

export type PaymentMethodType = 'cashfree' | 'razorpay' | 'upi' | 'card_in' | 'netbanking' | 'cod' | 'stripe' | 'card_us' | 'apple_pay';

export type PaymentStatusType = 'paid' | 'pending' | 'failed' | 'refunded' | 'partially_refunded';

export type OrderStatusType = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'rto_initiated' | 'rto_delivered';

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface RefundDetail {
  refundId: string;
  cfRefundId?: string;
  amount: number;
  reason?: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
  speed?: 'STANDARD' | 'INSTANT';
  arn?: string;
}

export interface RtoDetail {
  rtoReason: string;
  initiatedAt: string;
  completedAt?: string;
  returnTrackingNumber?: string;
  returnCourier?: string;
  refundProcessed?: boolean;
  refundAmount?: number;
}

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
  paymentStatus: PaymentStatusType;
  orderStatus: OrderStatusType;
  cashfreeOrderId?: string;
  cashfreePaymentId?: string;
  paymentSessionId?: string;
  refundStatus?: 'none' | 'pending' | 'success' | 'failed';
  refundDetails?: RefundDetail[];
  rtoDetails?: RtoDetail;
  cancellationReason?: string;
  cancelledAt?: string;
  // Shiprocket Logistics
  shiprocketOrderId?: number | string;
  shiprocketShipmentId?: number | string;
  shiprocketAwb?: string;
  shiprocketCourier?: string;
  shiprocketStatus?: string;
  shiprocketLabelUrl?: string;
  shiprocketManifestUrl?: string;
  trackingNumber?: string;
  courierCarrier?: string;
  trackingHistory?: TrackingEvent[];
  adminNotes?: string;
  estimatedDelivery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}
