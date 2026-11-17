import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { createCashfreeRefund } from '@/lib/cashfree';

// 1. GET Handshake for Shiprocket test / ping
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Logistics webhook endpoint active' }, { status: 200 });
}

// 2. HEAD Handshake
export async function HEAD() {
  return new Response(null, { status: 200 });
}

// 3. OPTIONS Handshake
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
    }
  });
}

// 4. POST Handler for Shiprocket live updates & test pings
export async function POST(req: Request) {
  try {
    let payload: any = {};
    try {
      const rawText = await req.text();
      if (rawText && rawText.trim().length > 0) {
        payload = JSON.parse(rawText);
      }
    } catch {
      // Shiprocket sometimes sends empty test pings
      return NextResponse.json({ success: true, message: 'Test ping received' }, { status: 200 });
    }

    // If empty test payload from Shiprocket verification
    if (!payload || Object.keys(payload).length === 0) {
      return NextResponse.json({ success: true, message: 'Test ping acknowledged' }, { status: 200 });
    }

    const orderNumber = payload.order_id || payload.orderId;
    const shipmentId = payload.shipment_id || payload.shipmentId;
    const awb = payload.awb || payload.awb_code;
    const currentStatus = payload.current_status || payload.shipment_status || '';
    const statusId = payload.current_status_id || payload.shipment_status_id;
    const location = payload.location || payload.current_city || 'In Transit';
    const activity = payload.activity || payload.status || currentStatus;

    if (!orderNumber && !shipmentId && !awb) {
      return NextResponse.json({ success: true, message: 'No identifiable order info (test event), acknowledged' }, { status: 200 });
    }

    await dbConnect();

    const order = await OrderModel.findOne({
      $or: [
        ...(orderNumber ? [{ orderNumber: String(orderNumber) }, { id: String(orderNumber) }] : []),
        ...(shipmentId ? [{ shiprocketShipmentId: shipmentId }] : []),
        ...(awb ? [{ shiprocketAwb: awb }, { trackingNumber: awb }] : [])
      ]
    });

    if (!order) {
      console.warn(`[Logistics Webhook] No matching order found for Order: ${orderNumber}, AWB: ${awb}`);
      return NextResponse.json({ success: true, message: 'Order not found in database, acknowledged' }, { status: 200 });
    }

    const history = order.trackingHistory ? [...order.trackingHistory] : [];
    const statusUpper = currentStatus.toUpperCase();

    // Map Logistics Tracking Status
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
            refundNote: 'Automated RTO Delivery Refund via Logistics Webhook'
          });
          order.paymentStatus = 'refunded';
          order.refundStatus = cfRefund.refund_status === 'SUCCESS' ? 'success' : 'pending';
        } catch (rtoRefundErr) {
          console.error('[Logistics Webhook RTO Cashfree Refund Error]:', rtoRefundErr);
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
      id: `tr-wh-${Date.now()}`,
      status: currentStatus || 'Shipment Status Update',
      location: location,
      timestamp: new Date().toLocaleString(),
      description: activity || `Shiprocket update: ${currentStatus}`
    });
    order.trackingHistory = history;

    await order.save();
    return NextResponse.json({ success: true, message: 'Tracking updated via Webhook' }, { status: 200 });
  } catch (err: any) {
    console.error('[Logistics Webhook Error]:', err);
    // Return 200 even on non-critical error so webhook ping test does not fail
    return NextResponse.json({ success: false, message: err.message }, { status: 200 });
  }
}
