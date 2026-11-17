import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { createCashfreeOrder, isCashfreeConfigured } from '@/lib/cashfree';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      customer,
      shippingAddress,
      billingAddress,
      items,
      subtotal,
      discount = 0,
      shippingFee = 0,
      tax = 0,
      total,
      currency = 'INR'
    } = body;

    if (!customer?.email || !customer?.phone || !customer?.name || !items || !total) {
      return NextResponse.json(
        { success: false, message: 'Missing required order details' },
        { status: 400 }
      );
    }

    const orderNumber = `MNZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const internalId = `ord-${Date.now()}`;
    // Cashfree order_id max length 50 chars, allowed chars [a-zA-Z0-9_-]
    const cashfreeOrderId = `order_${orderNumber.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now().toString().slice(-6)}`;

    // 1. Create or prepare pending Order in MongoDB
    const pendingOrder: any = await OrderModel.create({
      id: internalId,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      items,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      currency,
      paymentMethod: 'cashfree',
      paymentStatus: 'pending',
      orderStatus: 'placed',
      cashfreeOrderId,
      refundStatus: 'none',
      courierCarrier: 'BlueDart Express',
      trackingNumber: `MNZ-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingHistory: [
        {
          id: `tr-${Date.now()}`,
          status: 'Order Initiated',
          location: 'MUNAAZ Online Atelier',
          timestamp: new Date().toLocaleString(),
          description: 'Order initiated, awaiting Cashfree payment confirmation.'
        }
      ],
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    });

    // 2. Call Cashfree Orders API to create payment session
    const cfResponse = await createCashfreeOrder({
      orderId: cashfreeOrderId,
      orderAmount: total,
      orderCurrency: currency,
      customer: {
        customerId: `cust_${customer.phone.replace(/[^0-9]/g, '') || Date.now()}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone
      },
      orderNote: `Order #${orderNumber} at MUNAAZ`
    });

    // Update with session ID
    pendingOrder.paymentSessionId = cfResponse.payment_session_id;
    await pendingOrder.save();

    return NextResponse.json({
      success: true,
      orderId: pendingOrder.id,
      orderNumber: pendingOrder.orderNumber,
      cashfreeOrderId,
      paymentSessionId: cfResponse.payment_session_id,
      mockMode: !isCashfreeConfigured(),
      data: pendingOrder
    });
  } catch (error: any) {
    console.error('[Cashfree API] Error creating order session:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
