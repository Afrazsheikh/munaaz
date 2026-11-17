import mongoose, { Schema, Document, Model } from 'mongoose';
import { Order } from '@/types/order';

export interface IOrderDocument extends Document {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: any;
  billingAddress: any;
  items: any[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: 'INR' | 'USD';
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  cashfreeOrderId?: string;
  cashfreePaymentId?: string;
  paymentSessionId?: string;
  refundStatus?: string;
  refundDetails?: any[];
  rtoDetails?: any;
  cancellationReason?: string;
  cancelledAt?: string;
  shiprocketOrderId?: number | string;
  shiprocketShipmentId?: number | string;
  shiprocketAwb?: string;
  shiprocketCourier?: string;
  shiprocketStatus?: string;
  shiprocketLabelUrl?: string;
  shiprocketManifestUrl?: string;
  trackingNumber?: string;
  courierCarrier?: string;
  trackingHistory?: any[];
  adminNotes?: string;
  estimatedDelivery: string;
}

const AddressSchema = new Schema({
  id: { type: String, default: '' },
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean }
}, { _id: false });

const TrackingEventSchema = new Schema({
  id: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const CartItemSchema = new Schema({
  id: { type: String, required: true },
  productId: { type: String, required: true },
  product: { type: Schema.Types.Mixed, required: true },
  selectedColor: { type: String, required: true },
  selectedSize: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPriceINR: { type: Number, required: true },
  unitPriceUSD: { type: Number, required: true }
}, { _id: false });

const RefundDetailSchema = new Schema({
  refundId: { type: String, required: true },
  cfRefundId: { type: String },
  amount: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, required: true, enum: ['pending', 'success', 'failed'], default: 'pending' },
  createdAt: { type: String, required: true },
  speed: { type: String, enum: ['STANDARD', 'INSTANT'], default: 'STANDARD' },
  arn: { type: String }
}, { _id: false });

const RtoDetailSchema = new Schema({
  rtoReason: { type: String, required: true },
  initiatedAt: { type: String, required: true },
  completedAt: { type: String },
  returnTrackingNumber: { type: String },
  returnCourier: { type: String },
  refundProcessed: { type: Boolean, default: false },
  refundAmount: { type: Number }
}, { _id: false });

const OrderSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true, unique: true, index: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  items: [CartItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, required: true, enum: ['INR', 'USD'] },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true, enum: ['paid', 'pending', 'failed', 'refunded', 'partially_refunded'] },
  orderStatus: { type: String, required: true, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled', 'rto_initiated', 'rto_delivered'] },
  cashfreeOrderId: { type: String, index: true },
  cashfreePaymentId: { type: String },
  paymentSessionId: { type: String },
  refundStatus: { type: String, enum: ['none', 'pending', 'success', 'failed'], default: 'none' },
  refundDetails: [RefundDetailSchema],
  rtoDetails: RtoDetailSchema,
  cancellationReason: { type: String },
  cancelledAt: { type: String },
  shiprocketOrderId: { type: Schema.Types.Mixed },
  shiprocketShipmentId: { type: Schema.Types.Mixed },
  shiprocketAwb: { type: String, index: true },
  shiprocketCourier: { type: String },
  shiprocketStatus: { type: String },
  shiprocketLabelUrl: { type: String },
  shiprocketManifestUrl: { type: String },
  trackingNumber: { type: String, index: true },
  courierCarrier: { type: String },
  trackingHistory: [TrackingEventSchema],
  adminNotes: { type: String },
  estimatedDelivery: { type: String, required: true }
}, { timestamps: true });

const OrderModel: Model<IOrderDocument> = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default OrderModel;
