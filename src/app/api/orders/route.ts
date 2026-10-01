import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

const p0 = MOCK_PRODUCTS[0];
const p1 = MOCK_PRODUCTS[1] || p0;
const p2 = MOCK_PRODUCTS[2] || p0;

const SAMPLE_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 'MNZ-892101',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      phone: '+91 98765 43210'
    },
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Aarav Mehta',
      street: '42 Marine Drive, Flat 8B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400020',
      country: 'IN',
      phone: '+91 98765 43210'
    },
    billingAddress: {
      id: 'addr-1',
      fullName: 'Aarav Mehta',
      street: '42 Marine Drive, Flat 8B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400020',
      country: 'IN',
      phone: '+91 98765 43210'
    },
    items: [
      {
        id: 'cart-1',
        productId: p0?.id || 'prod-1',
        product: p0,
        selectedColor: 'Terracotta Slub',
        selectedSize: 'L',
        quantity: 1,
        unitPriceINR: 4800,
        unitPriceUSD: 65
      }
    ],
    subtotal: 4800,
    discount: 0,
    shippingFee: 0,
    tax: 864,
    total: 5664,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    courierCarrier: 'BlueDart Express',
    trackingNumber: 'BLUEDART-88219401',
    trackingHistory: [
      {
        id: 'tr-1',
        status: 'Order Placed',
        location: 'MUNAAZ Online Atelier',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
        description: 'Customer order placed successfully.'
      },
      {
        id: 'tr-2',
        status: 'Dispatched via Carrier',
        location: 'BlueDart Hub, Mumbai North',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(),
        description: 'Package handed over to BlueDart courier team.'
      }
    ],
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
];

export async function GET() {
  try {
    await dbConnect();
    let orders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();

    if (!orders || orders.length === 0) {
      await OrderModel.insertMany(SAMPLE_ORDERS);
      orders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newOrderNumber = `MNZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      ...body,
      id: body.id || `ord-${Date.now()}`,
      orderNumber: body.orderNumber || newOrderNumber,
      createdAt: new Date().toISOString(),
      paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: body.orderStatus || 'placed',
      courierCarrier: body.courierCarrier || 'BlueDart Express',
      trackingNumber: body.trackingNumber || `MNZ-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingHistory: body.trackingHistory || [
        {
          id: `tr-${Date.now()}`,
          status: 'Order Placed',
          location: 'MUNAAZ Online Atelier',
          timestamp: new Date().toLocaleString(),
          description: 'Customer order placed successfully.'
        }
      ],
      estimatedDelivery: body.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    const created = await OrderModel.create(newOrder);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
