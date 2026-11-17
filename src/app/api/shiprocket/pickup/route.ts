import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { scheduleShiprocketPickup } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { orderId, shipmentId, pickupDate } = await req.json();

    let targetShipmentId = shipmentId;
    let order = null;

    if (orderId) {
      order = await OrderModel.findOne({
        $or: [{ id: orderId }, { orderNumber: orderId }]
      });
      if (order && order.shiprocketShipmentId) {
        targetShipmentId = order.shiprocketShipmentId;
      }
    }

    if (!targetShipmentId) {
      return NextResponse.json({ success: false, message: 'Shipment ID not found' }, { status: 400 });
    }

    const pickupRes = await scheduleShiprocketPickup(targetShipmentId, pickupDate);

    if (order) {
      const history = order.trackingHistory ? [...order.trackingHistory] : [];
      history.push({
        id: `tr-${Date.now()}`,
        status: 'Pickup Requested',
        location: 'Atelier Primary Warehouse',
        timestamp: new Date().toLocaleString(),
        description: `Doorstep pickup scheduled with ${order.courierCarrier || 'Shiprocket courier'}.`
      });
      order.trackingHistory = history;
      await order.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Doorstep pickup successfully scheduled with Shiprocket courier.',
      data: pickupRes
    });
  } catch (err: any) {
    console.error('[Shiprocket Pickup API Error]:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
