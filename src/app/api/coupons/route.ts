import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import CouponModel from '@/models/Coupon';

const DEFAULT_COUPONS = [
  {
    id: 'coup-1',
    code: 'MUNAAZ10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmountINR: 2000,
    minOrderAmountUSD: 30,
    isActive: true,
    usageCount: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coup-2',
    code: 'ATELIER500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmountINR: 5000,
    minOrderAmountUSD: 75,
    isActive: true,
    usageCount: 18,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coup-3',
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmountINR: 4000,
    minOrderAmountUSD: 50,
    isActive: true,
    usageCount: 89,
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    await dbConnect();
    let coupons = await CouponModel.find({}).sort({ createdAt: -1 }).lean();
    if (!coupons || coupons.length === 0) {
      await CouponModel.insertMany(DEFAULT_COUPONS);
      coupons = await CouponModel.find({}).sort({ createdAt: -1 }).lean();
    }
    return NextResponse.json({ success: true, data: coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newCoupon = {
      ...body,
      id: body.id || `coup-${Date.now()}`,
      code: body.code.toUpperCase().trim(),
      createdAt: new Date().toISOString()
    };

    const created = await CouponModel.create(newCoupon);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
