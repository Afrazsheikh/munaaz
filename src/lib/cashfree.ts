import crypto from 'crypto';

/**
 * Cashfree Payment Gateway Integration Helper
 * Compliant with Cashfree PG API Version: 2023-08-01 / 2022-09-01
 */

export interface CashfreeConfig {
  appId: string;
  secretKey: string;
  env: 'sandbox' | 'production';
  apiVersion: string;
  baseUrl: string;
}

export function getCashfreeConfig(): CashfreeConfig {
  const appId = process.env.CASHFREE_APP_ID || '';
  const secretKey = process.env.CASHFREE_SECRET_KEY || '';
  const env = (process.env.CASHFREE_ENV?.toLowerCase() === 'production') ? 'production' : 'sandbox';
  const apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01';
  const baseUrl = env === 'production' 
    ? 'https://api.cashfree.com/pg' 
    : 'https://sandbox.cashfree.com/pg';

  return { appId, secretKey, env, apiVersion, baseUrl };
}

export function isCashfreeConfigured(): boolean {
  const { appId, secretKey } = getCashfreeConfig();
  if (!appId || !secretKey) return false;
  if (appId.includes('your_cashfree_') || secretKey.includes('your_cashfree_')) return false;
  return true;
}

export interface CreateOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customer: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  returnUrl?: string;
  notifyUrl?: string;
  orderNote?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string | number;
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
  payment_session_id: string;
  mock?: boolean;
}

/**
 * Creates an order on Cashfree PG and returns the payment_session_id
 */
export async function createCashfreeOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
  const config = getCashfreeConfig();

  // If keys are not configured yet, provide a mock response for seamless local testing
  if (!isCashfreeConfigured()) {
    console.warn('[Cashfree] API keys missing or using placeholders in .env.local. Operating in Mock Development Mode.');
    return {
      cf_order_id: `cf_mock_${Date.now()}`,
      order_id: params.orderId,
      order_amount: params.orderAmount,
      order_currency: params.orderCurrency || 'INR',
      order_status: 'ACTIVE',
      payment_session_id: `session_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      mock: true
    };
  }

  // Format and sanitize customer phone (remove spaces, symbols)
  const sanitizedPhone = params.customer.customerPhone.replace(/[^0-9]/g, '').slice(-10) || '9999999999';
  const sanitizedCustomerId = (params.customer.customerId || `cust_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');

  const payload = {
    order_id: params.orderId,
    order_amount: Number(params.orderAmount.toFixed(2)),
    order_currency: params.orderCurrency || 'INR',
    customer_details: {
      customer_id: sanitizedCustomerId,
      customer_name: params.customer.customerName.trim() || 'Customer',
      customer_email: params.customer.customerEmail.trim() || 'customer@example.com',
      customer_phone: sanitizedPhone
    },
    order_meta: {
      return_url: params.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/verify?order_id={order_id}`,
      notify_url: params.notifyUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cashfree/webhook`,
      payment_methods: 'cc,dc,upi,nb,app'
    },
    order_note: params.orderNote || `Order ${params.orderId}`
  };

  const response = await fetch(`${config.baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Cashfree Order Creation Failed (HTTP ${response.status})`);
  }

  return data;
}

/**
 * Retrieves Cashfree order details by order_id
 */
export async function getCashfreeOrder(orderId: string) {
  const config = getCashfreeConfig();

  if (!isCashfreeConfigured()) {
    return {
      order_id: orderId,
      order_status: 'PAID',
      order_amount: 1000,
      mock: true
    };
  }

  const response = await fetch(`${config.baseUrl}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Failed to fetch Cashfree order (${response.status})`);
  }
  return data;
}

/**
 * Retrieves payment attempts for an order
 */
export async function getCashfreeOrderPayments(orderId: string) {
  const config = getCashfreeConfig();

  if (!isCashfreeConfigured()) {
    return [
      {
        cf_payment_id: `cf_pay_mock_${Date.now()}`,
        order_id: orderId,
        payment_status: 'SUCCESS',
        payment_amount: 1000,
        payment_currency: 'INR',
        payment_message: 'Mock payment success',
        mock: true
      }
    ];
  }

  const response = await fetch(`${config.baseUrl}/orders/${orderId}/payments`, {
    method: 'GET',
    headers: {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Failed to fetch Cashfree payments (${response.status})`);
  }
  return data;
}

export interface CreateRefundParams {
  orderId: string;
  refundId: string;
  refundAmount: number;
  refundNote?: string;
  refundSpeed?: 'STANDARD' | 'INSTANT';
}

export interface CashfreeRefundResponse {
  cf_refund_id: string | number;
  refund_id: string;
  order_id: string;
  refund_amount: number;
  refund_currency?: string;
  refund_status: 'SUCCESS' | 'PENDING' | 'FAILED';
  refund_arn?: string;
  created_at?: string;
  mock?: boolean;
}

/**
 * Initiates a full or partial refund for a paid Cashfree order
 */
export async function createCashfreeRefund(params: CreateRefundParams): Promise<CashfreeRefundResponse> {
  const config = getCashfreeConfig();

  if (!isCashfreeConfigured()) {
    console.warn('[Cashfree Refund] In mock mode. Simulating successful refund for order:', params.orderId);
    return {
      cf_refund_id: `cf_ref_mock_${Date.now()}`,
      refund_id: params.refundId,
      order_id: params.orderId,
      refund_amount: params.refundAmount,
      refund_currency: 'INR',
      refund_status: 'SUCCESS',
      refund_arn: `ARN_MOCK_${Math.floor(10000000 + Math.random() * 90000000)}`,
      created_at: new Date().toISOString(),
      mock: true
    };
  }

  const payload = {
    refund_amount: Number(params.refundAmount.toFixed(2)),
    refund_id: params.refundId,
    refund_note: params.refundNote || 'Refund requested',
    refund_speed: params.refundSpeed || 'STANDARD'
  };

  const response = await fetch(`${config.baseUrl}/orders/${params.orderId}/refunds`, {
    method: 'POST',
    headers: {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Failed to initiate Cashfree refund (${response.status})`);
  }

  return data;
}

/**
 * Checks status of a previously requested refund
 */
export async function getCashfreeRefund(orderId: string, refundId: string) {
  const config = getCashfreeConfig();

  if (!isCashfreeConfigured()) {
    return {
      refund_id: refundId,
      order_id: orderId,
      refund_status: 'SUCCESS',
      mock: true
    };
  }

  const response = await fetch(`${config.baseUrl}/orders/${orderId}/refunds/${refundId}`, {
    method: 'GET',
    headers: {
      'x-client-id': config.appId,
      'x-client-secret': config.secretKey,
      'x-api-version': config.apiVersion,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Failed to get Cashfree refund details (${response.status})`);
  }
  return data;
}

/**
 * Verifies webhook signature received from Cashfree
 * Computes HMAC-SHA256 of (timestamp + rawBody) using CASHFREE_SECRET_KEY
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  signature: string,
  timestamp: string
): boolean {
  const { secretKey } = getCashfreeConfig();
  if (!secretKey) return false;

  try {
    const signatureData = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(signatureData)
      .digest('base64');

    return signature === expectedSignature;
  } catch (err) {
    console.error('[Cashfree Webhook] Error calculating signature verification:', err);
    return false;
  }
}
