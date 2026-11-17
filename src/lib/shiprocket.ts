/**
 * Shiprocket Logistics Integration Helper
 * Official API Base: https://apiv2.shiprocket.in/v1/external
 */

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

interface CachedToken {
  token: string;
  expiresAt: number; // Unix timestamp in ms
}

let cachedAuth: CachedToken | null = null;

export function getShiprocketConfig() {
  const email = process.env.SHIPROCKET_EMAIL || '';
  const password = process.env.SHIPROCKET_PASSWORD || '';
  const pickupPincode = process.env.MY_PICKUP_PINCODE || '171006';
  const pickupLocationName = process.env.MY_PICKUP_LOCATION_NAME || 'Primary';

  return { email, password, pickupPincode, pickupLocationName };
}

export function isShiprocketConfigured(): boolean {
  const { email, password } = getShiprocketConfig();
  if (!email || !password) return false;
  if (email.includes('your_') || password.includes('your_')) return false;
  return true;
}

/**
 * Authenticates with Shiprocket API and caches the JWT token for up to 9 days.
 */
export async function getShiprocketToken(forceRefresh = false): Promise<string> {
  const config = getShiprocketConfig();

  if (!isShiprocketConfigured()) {
    throw new Error('Shiprocket credentials (SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD) are not configured.');
  }

  const now = Date.now();
  if (!forceRefresh && cachedAuth && cachedAuth.expiresAt > now) {
    return cachedAuth.token;
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.email,
      password: config.password
    })
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(data.message || 'Shiprocket authentication failed. Please verify credentials.');
  }

  // Token is valid for ~10 days in Shiprocket; cache for 9 days
  cachedAuth = {
    token: data.token,
    expiresAt: now + 9 * 24 * 60 * 60 * 1000
  };

  return data.token;
}

export interface CreateShiprocketOrderPayload {
  orderId: string;
  orderDate?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  items: Array<{
    name: string;
    sku?: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
  }>;
  paymentMethod: string; // 'Prepaid' or 'COD'
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  total: number;
  length?: number; // in cm
  breadth?: number; // in cm
  height?: number; // in cm
  weight?: number; // in kg (e.g. 0.5)
}

/**
 * Creates an ad-hoc custom order on Shiprocket
 */
export async function createShiprocketOrder(payload: CreateShiprocketOrderPayload) {
  const token = await getShiprocketToken();
  const config = getShiprocketConfig();

  // Split full name into first & last name
  const nameParts = (payload.customer.name || 'Customer').trim().split(' ');
  const firstName = nameParts[0] || 'Valued';
  const lastName = nameParts.slice(1).join(' ') || 'Customer';

  // Format order date: YYYY-MM-DD HH:MM
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // Sanitize phone (last 10 digits)
  const phone = payload.customer.phone.replace(/[^0-9]/g, '').slice(-10) || '9999999999';

  const body = {
    order_id: payload.orderId,
    order_date: payload.orderDate || formattedDate,
    pickup_location: config.pickupLocationName,
    channel_id: '',
    comment: `Order #${payload.orderId} from MUNAAZ Atelier`,
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: payload.shippingAddress.street,
    billing_address_2: payload.shippingAddress.apartment || '',
    billing_city: payload.shippingAddress.city,
    billing_pincode: payload.shippingAddress.postalCode.replace(/[^0-9]/g, '').slice(0, 6),
    billing_state: payload.shippingAddress.state,
    billing_country: payload.shippingAddress.country === 'US' ? 'United States' : 'India',
    billing_email: payload.customer.email,
    billing_phone: phone,
    shipping_is_billing: true,
    order_items: payload.items.map((item, idx) => ({
      name: item.name || 'MUNAAZ Piece',
      sku: item.sku || `SKU-${idx + 1}`,
      units: item.units || 1,
      selling_price: item.selling_price || 0,
      discount: item.discount || 0,
      tax: item.tax || 0,
      hsn: 6205 // Default apparel HSN code
    })),
    payment_method: payload.paymentMethod.toLowerCase() === 'cod' ? 'COD' : 'Prepaid',
    shipping_charges: payload.shippingFee || 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: payload.discount || 0,
    sub_total: payload.total,
    length: payload.length || 15,
    breadth: payload.breadth || 15,
    height: payload.height || 5,
    weight: payload.weight || 0.5
  };

  const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok || (data.status_code && data.status_code !== 200 && data.status_code !== 201)) {
    throw new Error(data.message || (data.errors ? JSON.stringify(data.errors) : 'Failed to create Shiprocket order'));
  }

  return data;
}

/**
 * Assigns courier & generates Airway Bill (AWB) for a shipment
 */
export async function generateShiprocketAwb(shipmentId: number | string, courierId?: number) {
  const token = await getShiprocketToken();

  const payload: any = { shipment_id: shipmentId };
  if (courierId) payload.courier_id = courierId;

  const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to assign courier & generate AWB on Shiprocket');
  }

  return data;
}

/**
 * Schedules doorstep pickup with the assigned courier
 */
export async function scheduleShiprocketPickup(shipmentId: number | string, pickupDate?: string) {
  const token = await getShiprocketToken();

  const body: any = {
    shipment_id: [Number(shipmentId)]
  };
  if (pickupDate) {
    body.pickup_date = [pickupDate];
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/pickup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to schedule courier pickup on Shiprocket');
  }

  return data;
}

/**
 * Generates official shipping label PDF for thermal or A4 printing
 */
export async function generateShiprocketLabel(shipmentId: number | string) {
  const token = await getShiprocketToken();

  const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/label`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      shipment_id: [Number(shipmentId)]
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to generate shipping label from Shiprocket');
  }

  return data;
}

/**
 * Retrieves live tracking and scan history for an AWB code or shipment ID
 */
export async function trackShiprocketShipment(awbOrShipmentId: string | number) {
  const token = await getShiprocketToken();

  const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/awb/${awbOrShipmentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch live tracking from Shiprocket');
  }

  return data;
}

/**
 * Cancels an order/shipment in Shiprocket
 */
export async function cancelShiprocketOrder(shiprocketOrderId: number | string) {
  const token = await getShiprocketToken();

  const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ids: [Number(shiprocketOrderId)]
    })
  });

  const data = await res.json();
  return data;
}
