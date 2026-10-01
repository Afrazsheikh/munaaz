import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();

    const currentOrder = await OrderModel.findOne({
      $or: [{ id: id }, { orderNumber: id }]
    });

    if (!currentOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const history = currentOrder.trackingHistory ? [...currentOrder.trackingHistory] : [];

    if (updates.newTrackingEvent && updates.newTrackingEvent.status.trim() !== '') {
      history.push({
        id: `tr-${Date.now()}`,
        status: updates.newTrackingEvent.status,
        location: updates.newTrackingEvent.location || 'Atelier Fulfillment',
        timestamp: new Date().toLocaleString(),
        description: updates.newTrackingEvent.description || 'Status update logged by admin.'
      });
    }

    if (updates.orderStatus) currentOrder.orderStatus = updates.orderStatus;
    if (updates.paymentStatus) currentOrder.paymentStatus = updates.paymentStatus;
    if (updates.trackingNumber !== undefined) currentOrder.trackingNumber = updates.trackingNumber;
    if (updates.courierCarrier !== undefined) currentOrder.courierCarrier = updates.courierCarrier;
    if (updates.adminNotes !== undefined) currentOrder.adminNotes = updates.adminNotes;
    if (updates.estimatedDelivery !== undefined) currentOrder.estimatedDelivery = updates.estimatedDelivery;
    currentOrder.trackingHistory = history;

    await currentOrder.save();
    return NextResponse.json({ success: true, data: currentOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await OrderModel.findOneAndDelete({
      $or: [{ id: id }, { orderNumber: id }]
    });

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
