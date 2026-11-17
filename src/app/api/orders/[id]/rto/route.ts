import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { createCashfreeRefund } from '@/lib/cashfree';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const {
      action = 'initiate', // 'initiate' | 'delivered'
      rtoReason = 'Delivery attempt failed / Customer unavailable',
      returnTrackingNumber,
      returnCourier,
      processRefund = true,
      deductionAmount = 0, // e.g. optional courier deduction
      refundSpeed = 'STANDARD'
    } = body;

    const order = await OrderModel.findOne({
      $or: [{ id: id }, { orderNumber: id }]
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const history = order.trackingHistory ? [...order.trackingHistory] : [];

    if (action === 'initiate') {
      order.orderStatus = 'rto_initiated';
      order.rtoDetails = {
        rtoReason,
        initiatedAt: new Date().toISOString(),
        returnTrackingNumber: returnTrackingNumber || order.trackingNumber || `RTO-${order.orderNumber}`,
        returnCourier: returnCourier || order.courierCarrier || 'BlueDart Logistics',
        refundProcessed: false
      };

      history.push({
        id: `tr-${Date.now()}`,
        status: 'RTO Initiated (Return to Origin)',
        location: 'Courier Destination Hub',
        timestamp: new Date().toLocaleString(),
        description: `Shipment marked as Return to Origin. Reason: ${rtoReason}. Package in transit back to MUNAAZ atelier.`
      });
      order.trackingHistory = history;

      await order.save();
      return NextResponse.json({
        success: true,
        message: 'Order marked as RTO Initiated.',
        data: order
      });
    }

    if (action === 'delivered') {
      order.orderStatus = 'rto_delivered';

      const existingRto: any = order.rtoDetails || {
        rtoReason: rtoReason || 'Returned by courier',
        initiatedAt: new Date().toISOString()
      };
      existingRto.completedAt = new Date().toISOString();

      let refundMessage = '';

      // If prepaid via Cashfree and refund is requested
      if (
        processRefund &&
        order.paymentStatus === 'paid' &&
        (order.paymentMethod === 'cashfree' || order.cashfreeOrderId)
      ) {
        const netRefundAmount = Math.max(0, order.total - Number(deductionAmount || 0));
        const refundId = `rto_ref_${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now().toString().slice(-6)}`;
        const targetCfOrderId = order.cashfreeOrderId || order.id;

        try {
          const cfRefund = await createCashfreeRefund({
            orderId: targetCfOrderId,
            refundId,
            refundAmount: netRefundAmount,
            refundNote: `RTO Return: ${rtoReason}`,
            refundSpeed: refundSpeed
          });

          order.paymentStatus = 'refunded';
          order.refundStatus = cfRefund.refund_status === 'SUCCESS' ? 'success' : 'pending';
          existingRto.refundProcessed = true;
          existingRto.refundAmount = netRefundAmount;

          const existingRefunds = order.refundDetails ? [...order.refundDetails] : [];
          existingRefunds.push({
            refundId,
            cfRefundId: String(cfRefund.cf_refund_id || ''),
            amount: netRefundAmount,
            reason: `RTO Package Returned: ${rtoReason}`,
            status: cfRefund.refund_status === 'SUCCESS' ? 'success' : 'pending',
            createdAt: new Date().toISOString(),
            speed: refundSpeed,
            arn: cfRefund.refund_arn
          });
          order.refundDetails = existingRefunds;

          refundMessage = ` Cashfree refund of ₹${netRefundAmount.toLocaleString()} initiated to customer (Ref: ${refundId}${cfRefund.refund_arn ? `, ARN: ${cfRefund.refund_arn}` : ''}).`;
        } catch (err: any) {
          console.error('[Cashfree RTO Refund Error]', err);
          refundMessage = ` Cashfree refund could not be initiated automatically: ${err.message}.`;
        }
      } else if (order.paymentMethod === 'cod') {
        refundMessage = ' Cash on Delivery order returned; no refund required.';
      }

      order.rtoDetails = existingRto;

      history.push({
        id: `tr-${Date.now()}`,
        status: 'RTO Delivered to Atelier',
        location: 'MUNAAZ Central Atelier',
        timestamp: new Date().toLocaleString(),
        description: `Returned package securely received back at origin atelier.${refundMessage}`
      });
      order.trackingHistory = history;

      await order.save();
      return NextResponse.json({
        success: true,
        message: `RTO delivery confirmed.${refundMessage}`,
        data: order
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid RTO action' }, { status: 400 });
  } catch (error: any) {
    console.error('[RTO API] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
