import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import { trackShiprocketShipment } from '@/lib/shiprocket';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const awb = searchParams.get('awb');

    let order = null;
    if (orderId) {
      order = await OrderModel.findOne({
        $or: [{ id: orderId }, { orderNumber: orderId }]
      });
    } else if (awb) {
      order = await OrderModel.findOne({
        $or: [{ shiprocketAwb: awb }, { trackingNumber: awb }]
      });
    }

    const targetAwb = awb || order?.shiprocketAwb || order?.trackingNumber;

    if (!targetAwb) {
      return NextResponse.json({ success: false, message: 'No AWB code found to track' }, { status: 400 });
    }

    const trackingData = await trackShiprocketShipment(targetAwb);
    const trackObj = trackingData?.tracking_data;
    const shipmentTrack = trackObj?.shipment_track?.[0];
    const trackActivities = trackObj?.shipment_track_activities || [];

    // Sync status back to MongoDB if order found
    if (order && trackActivities.length > 0) {
      const currentHistory = order.trackingHistory || [];
      const existingTimestamps = new Set(currentHistory.map((h) => h.timestamp));

      let hasNewEvents = false;
      for (const act of trackActivities) {
        const timeStr = act.date || act['activity-date'] || '';
        if (timeStr && !existingTimestamps.has(timeStr)) {
          currentHistory.push({
            id: `tr-sr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            status: act['sr-status-label'] || act.activity || 'In Transit',
            location: act.location || 'Hub',
            timestamp: timeStr,
            description: act.activity || act['sr-status-label'] || 'Package in movement'
          });
          hasNewEvents = true;
        }
      }

      if (shipmentTrack?.current_status) {
        order.shiprocketStatus = shipmentTrack.current_status;
        const statusLower = shipmentTrack.current_status.toLowerCase();
        if (statusLower.includes('delivered')) {
          order.orderStatus = 'delivered';
        } else if (statusLower.includes('rto')) {
          order.orderStatus = statusLower.includes('delivered') ? 'rto_delivered' : 'rto_initiated';
        }
      }

      if (hasNewEvents) {
        order.trackingHistory = currentHistory;
        await order.save();
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        awb: targetAwb,
        currentStatus: shipmentTrack?.current_status || 'IN TRANSIT',
        courier: shipmentTrack?.courier_name || order?.courierCarrier,
        expectedDelivery: shipmentTrack?.edd,
        scans: trackActivities,
        order
      }
    });
  } catch (err: any) {
    console.error('[Shiprocket Track API Error]:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
