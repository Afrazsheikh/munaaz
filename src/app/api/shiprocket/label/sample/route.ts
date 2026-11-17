import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import OrderModel from '@/models/Order';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const shipmentId = searchParams.get('shipment_id');
    const orderId = searchParams.get('order_id');

    let order = null;
    if (shipmentId) {
      order = await OrderModel.findOne({
        $or: [{ shiprocketShipmentId: shipmentId }, { shiprocketShipmentId: Number(shipmentId) }]
      });
    }
    if (!order && orderId) {
      order = await OrderModel.findOne({
        $or: [{ id: orderId }, { orderNumber: orderId }]
      });
    }

    const awb = order?.shiprocketAwb || order?.trackingNumber || `SR${Date.now().toString().slice(-9)}`;
    const courier = order?.shiprocketCourier || order?.courierCarrier || 'Delhivery Surface (Sandbox)';
    const orderNum = order?.orderNumber || 'MNZ-TEST-ORDER';
    const customerName = order?.customer?.name || 'Valued Customer';
    const street = order?.shippingAddress?.street || '123 Luxury Avenue';
    const apartment = order?.shippingAddress?.apartment || '';
    const city = order?.shippingAddress?.city || 'New Delhi';
    const state = order?.shippingAddress?.state || 'Delhi';
    const pincode = order?.shippingAddress?.postalCode || '110001';
    const phone = order?.customer?.phone || '+91 98765 43210';
    const paymentMethod = (order?.paymentMethod || 'Prepaid').toUpperCase();
    const total = order?.total || 4500;
    const currency = order?.currency === 'INR' ? '₹' : '$';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipping Label - ${awb}</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; background: white; }
      .no-print { display: none !important; }
      .label-box { border: 2px solid black !important; box-shadow: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace, sans-serif;
      background: #f4efe9;
      margin: 0;
      padding: 30px 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #111;
    }
    .no-print {
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
    }
    .btn {
      background: #111;
      color: #fff;
      padding: 10px 22px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }
    .btn:hover { background: #333; }
    .label-box {
      width: 420px;
      background: #fff;
      border: 2px solid #222;
      padding: 20px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      box-sizing: border-box;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #222;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-sub {
      font-size: 10px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .courier-badge {
      text-align: right;
    }
    .courier-name {
      font-size: 13px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .mode-pill {
      display: inline-block;
      background: #000;
      color: #fff;
      padding: 2px 8px;
      font-size: 10px;
      font-weight: 700;
      margin-top: 4px;
    }
    .barcode-section {
      text-align: center;
      padding: 15px 0;
      border-bottom: 2px dashed #999;
    }
    .barcode-svg {
      width: 80%;
      height: 50px;
    }
    .awb-text {
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 3px;
      margin-top: 6px;
    }
    .routing {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
      font-size: 11px;
    }
    .routing strong { font-size: 13px; }
    .address-section {
      padding: 12px 0;
      border-bottom: 1px solid #ccc;
      font-size: 11px;
      line-height: 1.4;
    }
    .address-section h4 {
      margin: 0 0 6px 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
    }
    .cust-name {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .pincode-highlight {
      font-size: 14px;
      font-weight: 900;
      background: #eee;
      padding: 1px 4px;
      display: inline-block;
      margin-top: 4px;
    }
    .footer-section {
      padding-top: 10px;
      font-size: 10px;
      color: #555;
      display: flex;
      justify-content: space-between;
    }
    .sandbox-watermark {
      text-align: center;
      margin-top: 8px;
      font-size: 9px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #888;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="btn" onclick="window.print()">🖨️ Print Shipping Label</button>
  </div>

  <div class="label-box">
    <div class="header">
      <div>
        <h1 class="brand-title">MUNAAZ</h1>
        <div class="brand-sub">Atelier Luxury Logistics</div>
      </div>
      <div class="courier-badge">
        <div class="courier-name">${courier}</div>
        <div class="mode-pill">${paymentMethod}</div>
      </div>
    </div>

    <div class="barcode-section">
      <!-- Simulated Code 128 Barcode -->
      <svg class="barcode-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
        <rect x="0" y="0" width="3" height="40" fill="#000" />
        <rect x="5" y="0" width="2" height="40" fill="#000" />
        <rect x="10" y="0" width="4" height="40" fill="#000" />
        <rect x="16" y="0" width="1" height="40" fill="#000" />
        <rect x="20" y="0" width="3" height="40" fill="#000" />
        <rect x="25" y="0" width="5" height="40" fill="#000" />
        <rect x="33" y="0" width="2" height="40" fill="#000" />
        <rect x="38" y="0" width="3" height="40" fill="#000" />
        <rect x="44" y="0" width="4" height="40" fill="#000" />
        <rect x="51" y="0" width="2" height="40" fill="#000" />
        <rect x="56" y="0" width="5" height="40" fill="#000" />
        <rect x="64" y="0" width="1" height="40" fill="#000" />
        <rect x="68" y="0" width="3" height="40" fill="#000" />
        <rect x="74" y="0" width="4" height="40" fill="#000" />
        <rect x="81" y="0" width="2" height="40" fill="#000" />
        <rect x="86" y="0" width="6" height="40" fill="#000" />
        <rect x="95" y="0" width="2" height="40" fill="#000" />
        <rect x="100" y="0" width="4" height="40" fill="#000" />
        <rect x="107" y="0" width="3" height="40" fill="#000" />
        <rect x="113" y="0" width="2" height="40" fill="#000" />
        <rect x="118" y="0" width="5" height="40" fill="#000" />
        <rect x="126" y="0" width="2" height="40" fill="#000" />
        <rect x="131" y="0" width="3" height="40" fill="#000" />
        <rect x="137" y="0" width="4" height="40" fill="#000" />
        <rect x="144" y="0" width="2" height="40" fill="#000" />
        <rect x="149" y="0" width="5" height="40" fill="#000" />
        <rect x="157" y="0" width="3" height="40" fill="#000" />
        <rect x="163" y="0" width="1" height="40" fill="#000" />
        <rect x="167" y="0" width="4" height="40" fill="#000" />
        <rect x="174" y="0" width="2" height="40" fill="#000" />
        <rect x="179" y="0" width="5" height="40" fill="#000" />
        <rect x="187" y="0" width="3" height="40" fill="#000" />
        <rect x="193" y="0" width="2" height="40" fill="#000" />
        <rect x="198" y="0" width="2" height="40" fill="#000" />
      </svg>
      <div class="awb-text">${awb}</div>
    </div>

    <div class="routing">
      <div><strong>ORIGIN:</strong> SML-171006</div>
      <div><strong>DEST:</strong> ${pincode}</div>
      <div><strong>WEIGHT:</strong> 0.50 KG</div>
    </div>

    <div class="address-section">
      <h4>DELIVER TO (CONSIGNEE):</h4>
      <div class="cust-name">${customerName}</div>
      <div>${street} ${apartment}</div>
      <div>${city}, ${state}</div>
      <div class="pincode-highlight">PIN: ${pincode}</div>
      <div style="margin-top: 4px;"><strong>Phone:</strong> ${phone}</div>
    </div>

    <div class="address-section">
      <h4>SHIP FROM (RETURN IF UNDELIVERED):</h4>
      <div><strong>MUNAAZ ATELIER WAREHOUSE</strong></div>
      <div>Primary Logistics Center, Mall Road</div>
      <div>Shimla, Himachal Pradesh - 171006</div>
      <div>Phone: +91 99999 88888</div>
    </div>

    <div class="routing">
      <div><strong>ORDER NO:</strong> #${orderNum}</div>
      <div><strong>COLLECTIBLE:</strong> ${paymentMethod === 'COD' ? currency + total : '₹0.00 (PREPAID)'}</div>
    </div>

    <div class="footer-section">
      <div>Standard Surface Delivery</div>
      <div>Shiprocket Verified Partner</div>
    </div>

    <div class="sandbox-watermark">
      [ MUNAAZ ATELIER • TEST / SANDBOX DISPATCH MANIFEST ]
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
