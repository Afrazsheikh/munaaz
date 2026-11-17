import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { getCashfreeOrderPayments, isCashfreeConfigured } from '@/lib/cashfree';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { orderId, cfPaymentId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Missing orderId' }, { status: 400 });
    }

    const order = await OrderModel.findOne({
      $or: [
        { id: orderId },
        { orderNumber: orderId },
        { cashfreeOrderId: orderId }
      ]
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Already marked as paid?
    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ success: true, message: 'Payment already verified', data: order });
    }

    let isSuccess = false;
    let paymentId = cfPaymentId;

    if (!isCashfreeConfigured()) {
      // Mock mode simulation
      isSuccess = true;
      paymentId = cfPaymentId || `cf_pay_mock_${Date.now()}`;
    } else {
      // Real Cashfree API verification
      try {
        const payments = await getCashfreeOrderPayments(order.cashfreeOrderId || order.id);
        const successfulPayment = Array.isArray(payments)
          ? payments.find((p: any) => p.payment_status === 'SUCCESS')
          : null;

        if (successfulPayment) {
          isSuccess = true;
          paymentId = successfulPayment.cf_payment_id || cfPaymentId;
        }
      } catch (err: any) {
        console.error('[Cashfree Verify] Error fetching payments:', err);
      }
    }

    if (isSuccess) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'placed';
      if (paymentId) order.cashfreePaymentId = String(paymentId);

      const history = order.trackingHistory ? [...order.trackingHistory] : [];
      history.push({
        id: `tr-${Date.now()}`,
        status: 'Payment Received',
        location: 'Cashfree Gateway',
        timestamp: new Date().toLocaleString(),
        description: `Payment verified successfully via Cashfree. Ref: ${paymentId || 'N/A'}`
      });
      order.trackingHistory = history;

      await order.save();
      return NextResponse.json({ success: true, message: 'Payment verified', data: order });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      return NextResponse.json(
        { success: false, message: 'Payment was not successful or is pending', data: order },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[Cashfree Verify API] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
