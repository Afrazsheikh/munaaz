export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 500 for ₹500 off
  minOrderAmountINR: number;
  minOrderAmountUSD: number;
  isActive: boolean;
  expiryDate?: string;
  usageCount: number;
  createdAt: string;
}
