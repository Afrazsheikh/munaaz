import mongoose, { Schema, Document, Model } from 'mongoose';
import { Coupon } from '@/types/coupon';

export interface ICouponDocument extends Omit<Coupon, 'id'>, Document {}

const CouponSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  discountType: { type: String, required: true, enum: ['percentage', 'fixed'] },
  discountValue: { type: Number, required: true },
  minOrderAmountINR: { type: Number, default: 0 },
  minOrderAmountUSD: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: String },
  usageCount: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const CouponModel: Model<ICouponDocument> = mongoose.models.Coupon || mongoose.model<ICouponDocument>('Coupon', CouponSchema);

export default CouponModel;
