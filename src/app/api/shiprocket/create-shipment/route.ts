import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import {
  createShiprocketOrder,
  generateShiprocketAwb,
  generateShiprocketLabel,
  scheduleShiprocketPickup
} from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { orderId, length = 15, breadth = 15, height = 5, weight = 0.5 } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Missing orderId' }, { status: 400 });
    }

    const order = await OrderModel.findOne({
      $or: [{ id: orderId }, { orderNumber: orderId }]
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // 1. Create order on Shiprocket
    const srOrderResult = await createShiprocketOrder({
      orderId: order.orderNumber,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone
      },
      shippingAddress: {
        street: order.shippingAddress.street,
        apartment: order.shippingAddress.apartment,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country
      },
      items: order.items.map((item) => ({
        name: item.product?.name || 'Garment Item',
        sku: item.productId || `SKU-${item.id}`,
        units: item.quantity,
        selling_price: item.unitPriceINR,
        discount: 0,
        tax: 0
      })),
      paymentMethod: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      subtotal: order.subtotal,
      discount: order.discount,
      shippingFee: order.shippingFee,
      tax: order.tax,
      total: order.total,
      length: Number(length),
      breadth: Number(breadth),
      height: Number(height),
      weight: Number(weight)
    });

    const srOrderId = srOrderResult.order_id;
    const srShipmentId = srOrderResult.shipment_id;

    order.shiprocketOrderId = srOrderId;
    order.shiprocketShipmentId = srShipmentId;

    let awbCode = '';
    let courierName = 'Shiprocket Logistics';

    // 2. Assign Courier & Generate AWB
    try {
      const awbResult = await generateShiprocketAwb(srShipmentId);
      const awbData = awbResult?.response?.data;
      if (awbData) {
        awbCode = awbData.awb_code || '';
        courierName = awbData.courier_name || 'Assigned Courier';
      }
    } catch (awbErr: any) {
      console.warn('[Shiprocket AWB Warning]:', awbErr.message);
    }

    // 3. Try to generate label
    let labelUrl = '';
    if (awbCode) {
      try {
        const labelResult = await generateShiprocketLabel(srShipmentId);
        if (labelResult?.label_url) {
          labelUrl = labelResult.label_url;
        }
      } catch (labelErr) {
        console.warn('[Shiprocket Label Warning]:', labelErr);
      }
    }

    // 4. Update Order in DB
    order.orderStatus = 'shipped';
    if (awbCode) {
      order.shiprocketAwb = awbCode;
      order.trackingNumber = awbCode;
    }
    order.shiprocketCourier = courierName;
    order.courierCarrier = courierName;
    order.shiprocketStatus = 'AWB_ASSIGNED';
    if (labelUrl) order.shiprocketLabelUrl = labelUrl;

    const history = order.trackingHistory ? [...order.trackingHistory] : [];
    history.push({
      id: `tr-${Date.now()}`,
      status: 'Shipped via Shiprocket',
      location: 'MUNAAZ Dispatch Hub',
      timestamp: new Date().toLocaleString(),
      description: `Order manifested with ${courierName}. Airway Bill (AWB): ${awbCode || 'Pending Assignment'}`
    });
    order.trackingHistory = history;

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Shipment created and manifested on Shiprocket successfully.',
      data: {
        order,
        shiprocketOrderId: srOrderId,
        shiprocketShipmentId: srShipmentId,
        awbCode,
        courierName,
        labelUrl
      }
    });
  } catch (err: any) {
    console.error('[Shiprocket Create Shipment API Error]:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create shipment on Shiprocket' },
      { status: 500 }
    );
  }
}
