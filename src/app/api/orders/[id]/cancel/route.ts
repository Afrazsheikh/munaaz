import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { createCashfreeRefund } from '@/lib/cashfree';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { reason, initiatedBy = 'customer', refundSpeed = 'STANDARD' } = await req.json();

    const order = await OrderModel.findOne({
      $or: [{ id: id }, { orderNumber: id }]
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (order.orderStatus === 'cancelled') {
      return NextResponse.json({ success: false, message: 'Order is already cancelled' }, { status: 400 });
    }

    // Only allow customer cancellation before dispatch
    if (initiatedBy === 'customer' && (order.orderStatus === 'shipped' || order.orderStatus === 'delivered')) {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel an order that has already been dispatched. Please contact support or request a return.' },
        { status: 400 }
      );
    }

    let refundSummary = '';
    const history = order.trackingHistory ? [...order.trackingHistory] : [];

    // Process Cashfree refund if order was paid online via Cashfree
    if (order.paymentStatus === 'paid' && (order.paymentMethod === 'cashfree' || order.cashfreeOrderId)) {
      const refundId = `ref_${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now().toString().slice(-6)}`;
      const targetCfOrderId = order.cashfreeOrderId || order.id;

      try {
        const cfRefund = await createCashfreeRefund({
          orderId: targetCfOrderId,
          refundId,
          refundAmount: order.total,
          refundNote: `Cancellation: ${reason || 'Customer requested cancellation'}`,
          refundSpeed: refundSpeed
        });

        order.paymentStatus = 'refunded';
        order.refundStatus = cfRefund.refund_status === 'SUCCESS' ? 'success' : 'pending';

        const existingRefunds = order.refundDetails ? [...order.refundDetails] : [];
        existingRefunds.push({
          refundId,
          cfRefundId: String(cfRefund.cf_refund_id || ''),
          amount: order.total,
          reason: reason || 'Order cancellation',
          status: cfRefund.refund_status === 'SUCCESS' ? 'success' : 'pending',
          createdAt: new Date().toISOString(),
          speed: refundSpeed,
          arn: cfRefund.refund_arn
        });
        order.refundDetails = existingRefunds;

        refundSummary = `Cashfree refund of ₹${order.total.toLocaleString()} initiated (Ref: ${refundId}${cfRefund.refund_arn ? `, ARN: ${cfRefund.refund_arn}` : ''}).`;
      } catch (refundErr: any) {
        console.error('[Cashfree Refund Error]', refundErr);
        order.refundStatus = 'failed';
        refundSummary = `Refund trigger encountered an issue: ${refundErr.message}. Admin will re-verify.`;
      }
    } else if (order.paymentMethod === 'cod') {
      refundSummary = 'COD order cancelled prior to delivery. No refund needed.';
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason || 'Cancelled by ' + initiatedBy;
    order.cancelledAt = new Date().toISOString();

    history.push({
      id: `tr-${Date.now()}`,
      status: 'Order Cancelled',
      location: 'Atelier Order Desk',
      timestamp: new Date().toLocaleString(),
      description: `Order cancelled by ${initiatedBy}. Reason: ${order.cancellationReason}. ${refundSummary}`
    });
    order.trackingHistory = history;

    await order.save();
    return NextResponse.json({
      success: true,
      message: `Order successfully cancelled. ${refundSummary}`,
      data: order
    });
  } catch (error: any) {
    console.error('[Order Cancel API] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
