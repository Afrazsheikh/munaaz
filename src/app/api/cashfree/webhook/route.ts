import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { verifyCashfreeWebhookSignature, isCashfreeConfigured } from '@/lib/cashfree';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Read raw body as text for HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';

    // Verify signature in production / configured environments
    if (isCashfreeConfigured()) {
      const isValid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);
      if (!isValid) {
        console.warn('[Cashfree Webhook] Invalid webhook signature detected.');
        return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON payload' }, { status: 400 });
    }

    const { type, event_time, data } = payload;
    const orderData = data?.order;
    const paymentData = data?.payment;
    const refundData = data?.refund;

    const cashfreeOrderId = orderData?.order_id || refundData?.order_id;

    if (!cashfreeOrderId) {
      return NextResponse.json({ success: true, message: 'No order identifier found, ignored' });
    }

    const order = await OrderModel.findOne({
      $or: [
        { cashfreeOrderId: cashfreeOrderId },
        { id: cashfreeOrderId },
        { orderNumber: cashfreeOrderId }
      ]
    });

    if (!order) {
      console.warn(`[Cashfree Webhook] Order not found for CF Order ID: ${cashfreeOrderId}`);
      return NextResponse.json({ success: true, message: 'Order not found in database' });
    }

    const history = order.trackingHistory ? [...order.trackingHistory] : [];

    switch (type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
      case 'ORDER_PAID_SUCCESS': {
        if (order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          if (paymentData?.cf_payment_id) {
            order.cashfreePaymentId = String(paymentData.cf_payment_id);
          }
          history.push({
            id: `tr-${Date.now()}`,
            status: 'Payment Received (Webhook)',
            location: 'Cashfree PG',
            timestamp: new Date().toLocaleString(),
            description: `Payment confirmed via webhook. Payment ID: ${paymentData?.cf_payment_id || 'N/A'}`
          });
          order.trackingHistory = history;
          await order.save();
        }
        break;
      }

      case 'PAYMENT_FAILED_WEBHOOK': {
        if (order.paymentStatus !== 'paid') {
          order.paymentStatus = 'failed';
          history.push({
            id: `tr-${Date.now()}`,
            status: 'Payment Failed (Webhook)',
            location: 'Cashfree PG',
            timestamp: new Date().toLocaleString(),
            description: `Payment failed: ${paymentData?.payment_message || 'Transaction rejected'}`
          });
          order.trackingHistory = history;
          await order.save();
        }
        break;
      }

      case 'REFUND_STATUS_WEBHOOK': {
        const cfRefundStatus = refundData?.refund_status;
        if (cfRefundStatus === 'SUCCESS') {
          order.refundStatus = 'success';
          order.paymentStatus = 'refunded';
          // Update refund details list
          if (order.refundDetails && order.refundDetails.length > 0) {
            const targetRefund = order.refundDetails.find(
              (r) => r.refundId === refundData.refund_id || r.cfRefundId === String(refundData.cf_refund_id)
            );
            if (targetRefund) {
              targetRefund.status = 'success';
              if (refundData.refund_arn) targetRefund.arn = refundData.refund_arn;
            }
          }
          history.push({
            id: `tr-${Date.now()}`,
            status: 'Refund Settled',
            location: 'Cashfree Gateway',
            timestamp: new Date().toLocaleString(),
            description: `Refund settled successfully. ARN: ${refundData?.refund_arn || 'N/A'}`
          });
          order.trackingHistory = history;
          await order.save();
        } else if (cfRefundStatus === 'FAILED') {
          order.refundStatus = 'failed';
          history.push({
            id: `tr-${Date.now()}`,
            status: 'Refund Failed',
            location: 'Cashfree Gateway',
            timestamp: new Date().toLocaleString(),
            description: `Refund attempt failed on Cashfree: ${refundData?.refund_note || 'Processing error'}`
          });
          order.trackingHistory = history;
          await order.save();
        }
        break;
      }

      default:
        console.log(`[Cashfree Webhook] Unhandled event type: ${type}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('[Cashfree Webhook] Processing error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
