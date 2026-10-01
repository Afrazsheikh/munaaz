import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import CouponModel from '@/models/Coupon';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();

    const updated = await CouponModel.findOneAndUpdate(
      { id: id },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await CouponModel.findOneAndDelete({ id: id });
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
