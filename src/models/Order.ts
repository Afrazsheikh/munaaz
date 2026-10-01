import mongoose, { Schema, Document, Model } from 'mongoose';
import { Order } from '@/types/order';

export interface IOrderDocument extends Omit<Order, 'id'>, Document {}

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
  paymentStatus: { type: String, required: true, enum: ['paid', 'pending', 'failed'] },
  orderStatus: { type: String, required: true, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'] },
  trackingNumber: { type: String, index: true },
  courierCarrier: { type: String },
  trackingHistory: [TrackingEventSchema],
  adminNotes: { type: String },
  estimatedDelivery: { type: String, required: true }
}, { timestamps: true });

const OrderModel: Model<IOrderDocument> = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default OrderModel;
