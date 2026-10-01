import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

export async function GET() {
  try {
    await dbConnect();
    let products = await ProductModel.find({}).sort({ createdAt: -1 }).lean();

    // Auto-seed if database collection is empty
    if (!products || products.length === 0) {
      await ProductModel.insertMany(MOCK_PRODUCTS);
      products = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newProduct = {
      ...body,
      id: body.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const created = await ProductModel.create(newProduct);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
