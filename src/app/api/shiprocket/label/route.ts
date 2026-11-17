import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { generateShiprocketLabel } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { orderId, shipmentId } = await req.json();

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
      return NextResponse.json(
        { success: false, message: 'Shipment ID not found. Has this order been manifested on Shiprocket?' },
        { status: 400 }
      );
    }

    const labelResult = await generateShiprocketLabel(targetShipmentId);
    const labelUrl = labelResult?.label_url;

    if (order && labelUrl) {
      order.shiprocketLabelUrl = labelUrl;
      await order.save();
    }

    return NextResponse.json({
      success: true,
      labelUrl,
      data: labelResult
    });
  } catch (err: any) {
    console.error('[Shiprocket Label API Error]:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
