import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { createCashfreeRefund } from '@/lib/cashfree';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const payload = await req.json();

    const orderNumber = payload.order_id || payload.orderId;
    const shipmentId = payload.shipment_id || payload.shipmentId;
    const awb = payload.awb || payload.awb_code;
    const currentStatus = payload.current_status || payload.shipment_status || '';
    const statusId = payload.current_status_id || payload.shipment_status_id;
    const location = payload.location || payload.current_city || 'In Transit';
    const activity = payload.activity || payload.status || currentStatus;

    if (!orderNumber && !shipmentId && !awb) {
      return NextResponse.json({ success: true, message: 'No identifiable order info, ignored' });
    }

    const order = await OrderModel.findOne({
      $or: [
        ...(orderNumber ? [{ orderNumber: String(orderNumber) }, { id: String(orderNumber) }] : []),
        ...(shipmentId ? [{ shiprocketShipmentId: shipmentId }] : []),
        ...(awb ? [{ shiprocketAwb: awb }, { trackingNumber: awb }] : [])
      ]
    });

    if (!order) {
      console.warn(`[Shiprocket Webhook] No matching order for Order: ${orderNumber}, AWB: ${awb}`);
      return NextResponse.json({ success: true, message: 'Order not found, ignored' });
    }

    const history = order.trackingHistory ? [...order.trackingHistory] : [];
    const statusUpper = currentStatus.toUpperCase();

    // Map Shiprocket Status
    if (statusUpper.includes('DELIVERED') && !statusUpper.includes('RTO')) {
      order.orderStatus = 'delivered';
      if (order.paymentMethod === 'cod') {
        order.paymentStatus = 'paid';
      }
    } else if (statusUpper.includes('RTO INITIATED') || statusUpper.includes('RTO_INITIATED') || statusId === 9) {
      order.orderStatus = 'rto_initiated';
      order.rtoDetails = {
        rtoReason: payload.rto_reason || activity || 'Delivery attempts failed',
        initiatedAt: new Date().toISOString(),
        returnTrackingNumber: awb || order.trackingNumber,
        returnCourier: payload.courier_name || order.courierCarrier
      };
    } else if (statusUpper.includes('RTO DELIVERED') || statusUpper.includes('RTO_DELIVERED') || statusId === 10) {
      order.orderStatus = 'rto_delivered';
      if (order.rtoDetails) {
        order.rtoDetails.completedAt = new Date().toISOString();
      }

      // If prepaid with Cashfree, trigger refund automatically
      if (order.paymentStatus === 'paid' && (order.paymentMethod === 'cashfree' || order.cashfreeOrderId)) {
        try {
          const refundId = `rto_sr_${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now().toString().slice(-6)}`;
          const cfRefund = await createCashfreeRefund({
            orderId: order.cashfreeOrderId || order.id,
            refundId,
            refundAmount: order.total,
            refundNote: 'Automated RTO Delivery Refund via Shiprocket Webhook'
          });
          order.paymentStatus = 'refunded';
          order.refundStatus = cfRefund.refund_status === 'SUCCESS' ? 'success' : 'pending';
        } catch (rtoRefundErr) {
          console.error('[Shiprocket Webhook RTO Cashfree Refund Error]:', rtoRefundErr);
        }
      }
    } else if (statusUpper.includes('PICKED UP') || statusUpper.includes('SHIPPED') || statusUpper.includes('IN TRANSIT')) {
      if (order.orderStatus === 'placed' || order.orderStatus === 'processing') {
        order.orderStatus = 'shipped';
      }
    }

    if (payload.courier_name) {
      order.courierCarrier = payload.courier_name;
      order.shiprocketCourier = payload.courier_name;
    }
    if (awb) {
      order.shiprocketAwb = awb;
      order.trackingNumber = awb;
    }
    order.shiprocketStatus = currentStatus;

    history.push({
      id: `tr-sr-wh-${Date.now()}`,
      status: currentStatus || 'Shipment Status Update',
      location: location,
      timestamp: new Date().toLocaleString(),
      description: activity || `Shiprocket update: ${currentStatus}`
    });
    order.trackingHistory = history;

    await order.save();
    return NextResponse.json({ success: true, message: 'Tracking updated via Shiprocket Webhook' });
  } catch (err: any) {
    console.error('[Shiprocket Webhook Error]:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
