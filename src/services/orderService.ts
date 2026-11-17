import { Order, TrackingEvent } from '@/types/order';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

const MOCK_ORDERS_KEY = 'munaaz_mock_orders';

const p0 = MOCK_PRODUCTS[0] || {
  id: 'm-linen-shirt-1',
  slug: 'essential-linen-shirt',
  name: 'The Essential French Linen Shirt',
  brand: 'MUNAAZ ATELIER',
  category: 'men',
  collections: ['new-arrivals'],
  shortDescription: '100% French Flax Linen Shirt',
  description: 'Handcrafted luxury linen shirt.',
  fabricCare: ['Dry clean'],
  features: ['Natural linen'],
  priceINR: 4800,
  priceUSD: 65,
  images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop'],
  colors: [{ name: 'Terracotta Slub', hex: '#C18A60', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop' }],
  sizes: ['S', 'M', 'L', 'XL'],
  variants: [],
  isNewArrival: true,
  isBestSeller: true,
  isSale: false,
  rating: 5,
  reviewCount: 1,
  createdAt: new Date().toISOString()
};

const p1 = MOCK_PRODUCTS[1] || p0;
const p2 = MOCK_PRODUCTS[2] || p0;

const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MNZ-892101',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      phone: '+91 98765 43210'
    },
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Aarav Mehta',
      street: '42 Marine Drive, Flat 8B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400020',
      country: 'IN',
      phone: '+91 98765 43210'
    },
    billingAddress: {
      id: 'addr-1',
      fullName: 'Aarav Mehta',
      street: '42 Marine Drive, Flat 8B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400020',
      country: 'IN',
      phone: '+91 98765 43210'
    },
    items: [
      {
        id: 'cart-1',
        productId: p0.id,
        product: p0,
        selectedColor: 'Terracotta Slub',
        selectedSize: 'L',
        quantity: 1,
        unitPriceINR: 4800,
        unitPriceUSD: 65
      }
    ],
    subtotal: 4800,
    discount: 0,
    shippingFee: 0,
    tax: 864,
    total: 5664,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    courierCarrier: 'BlueDart Express',
    trackingNumber: 'BLUEDART-88219401',
    trackingHistory: [
      {
        id: 'tr-1',
        status: 'Order Placed',
        location: 'MUNAAZ Online Atelier',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
        description: 'Customer order placed successfully.'
      },
      {
        id: 'tr-2',
        status: 'Dispatched via Carrier',
        location: 'BlueDart Hub, Mumbai North',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(),
        description: 'Package handed over to BlueDart courier team.'
      }
    ],
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
];

const getLocalOrders = (): Order[] => {
  if (typeof window === 'undefined') return SAMPLE_INITIAL_ORDERS;
  const saved = localStorage.getItem(MOCK_ORDERS_KEY);
  if (!saved) {
    localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(SAMPLE_INITIAL_ORDERS));
    return SAMPLE_INITIAL_ORDERS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return SAMPLE_INITIAL_ORDERS;
  }
};

const saveLocalOrders = (orders: Order[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(orders));
  }
};

export const orderService = {
  async getOrdersAsync(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        saveLocalOrders(data.data);
        return data.data;
      }
    } catch {
      // Fallback
    }
    return getLocalOrders();
  },

  getOrders(): Order[] {
    return getLocalOrders();
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id || o.trackingNumber === id);
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentStatus' | 'estimatedDelivery'>): Promise<Order> {
    const newOrderNumber = `MNZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      courierCarrier: 'BlueDart Express',
      trackingNumber: `MNZ-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingHistory: [
        {
          id: `tr-${Date.now()}`,
          status: 'Order Placed',
          location: 'MUNAAZ Online Atelier',
          timestamp: new Date().toLocaleString(),
          description: 'Customer order placed successfully.'
        }
      ],
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const local = getLocalOrders();
        saveLocalOrders([data.data, ...local]);
        return data.data;
      }
    } catch {
      // Fallback
    }

    const orders = getLocalOrders();
    const updated = [newOrder, ...orders];
    saveLocalOrders(updated);
    return newOrder;
  },

  async updateOrderTracking(
    orderId: string,
    updates: {
      orderStatus?: Order['orderStatus'];
      paymentStatus?: Order['paymentStatus'];
      trackingNumber?: string;
      courierCarrier?: string;
      newTrackingEvent?: { status: string; location: string; description: string };
      adminNotes?: string;
      estimatedDelivery?: string;
    }
  ): Promise<Order | undefined> {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const orders = getLocalOrders();
        const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
        if (index !== -1) {
          orders[index] = data.data;
          saveLocalOrders(orders);
        }
        return data.data;
      }
    } catch {
      // Fallback
    }

    const orders = getLocalOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return undefined;

    const currentOrder = orders[index];
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

    const updatedOrder: Order = {
      ...currentOrder,
      ...(updates.orderStatus && { orderStatus: updates.orderStatus }),
      ...(updates.paymentStatus && { paymentStatus: updates.paymentStatus }),
      ...(updates.trackingNumber !== undefined && { trackingNumber: updates.trackingNumber }),
      ...(updates.courierCarrier !== undefined && { courierCarrier: updates.courierCarrier }),
      ...(updates.adminNotes !== undefined && { adminNotes: updates.adminNotes }),
      ...(updates.estimatedDelivery !== undefined && { estimatedDelivery: updates.estimatedDelivery }),
      trackingHistory: history
    };

    orders[index] = updatedOrder;
    saveLocalOrders(orders);
    return updatedOrder;
  },

  async createCashfreeSession(orderPayload: any): Promise<{
    success: boolean;
    orderId?: string;
    orderNumber?: string;
    cashfreeOrderId?: string;
    paymentSessionId?: string;
    mockMode?: boolean;
    message?: string;
    data?: Order;
  }> {
    try {
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const local = getLocalOrders();
        saveLocalOrders([data.data, ...local]);
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to initialize payment' };
    }
  },

  async verifyCashfreePayment(orderId: string, cfPaymentId?: string): Promise<{
    success: boolean;
    data?: Order;
    message?: string;
  }> {
    try {
      const res = await fetch('/api/cashfree/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, cfPaymentId })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const orders = getLocalOrders();
        const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
        if (index !== -1) {
          orders[index] = data.data;
          saveLocalOrders(orders);
        }
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Payment verification failed' };
    }
  },

  async cancelOrder(
    orderId: string,
    reason: string,
    initiatedBy: 'customer' | 'admin' = 'customer'
  ): Promise<{ success: boolean; data?: Order; message?: string }> {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, initiatedBy })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const orders = getLocalOrders();
        const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
        if (index !== -1) {
          orders[index] = data.data;
          saveLocalOrders(orders);
        }
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to cancel order' };
    }
  },

  async processRto(
    orderId: string,
    payload: {
      action: 'initiate' | 'delivered';
      rtoReason?: string;
      returnTrackingNumber?: string;
      returnCourier?: string;
      processRefund?: boolean;
      deductionAmount?: number;
      refundSpeed?: 'STANDARD' | 'INSTANT';
    }
  ): Promise<{ success: boolean; data?: Order; message?: string }> {
    try {
      const res = await fetch(`/api/orders/${orderId}/rto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const orders = getLocalOrders();
        const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
        if (index !== -1) {
          orders[index] = data.data;
          saveLocalOrders(orders);
        }
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update RTO status' };
    }
  },

  async createShiprocketShipment(
    orderId: string,
    dimensions?: { length?: number; breadth?: number; height?: number; weight?: number }
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const res = await fetch('/api/shiprocket/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...dimensions })
      });
      const data = await res.json();
      if (data.success && data.data?.order) {
        const orders = getLocalOrders();
        const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
        if (index !== -1) {
          orders[index] = data.data.order;
          saveLocalOrders(orders);
        }
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to manifest shipment with Shiprocket' };
    }
  },

  async trackShiprocketShipment(
    target: { orderId?: string; awb?: string }
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const params = new URLSearchParams();
      if (target.orderId) params.append('orderId', target.orderId);
      if (target.awb) params.append('awb', target.awb);

      const res = await fetch(`/api/shiprocket/track?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data?.order) {
        const orders = getLocalOrders();
        const index = orders.findIndex((o) => o.id === data.data.order.id || o.orderNumber === data.data.order.orderNumber);
        if (index !== -1) {
          orders[index] = data.data.order;
          saveLocalOrders(orders);
        }
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to fetch Shiprocket tracking' };
    }
  },

  async getShiprocketLabel(orderId: string): Promise<{ success: boolean; labelUrl?: string; message?: string }> {
    try {
      const res = await fetch('/api/shiprocket/label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to generate shipping label' };
    }
  },

  async scheduleShiprocketPickup(orderId: string, pickupDate?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/shiprocket/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, pickupDate })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to schedule pickup' };
    }
  },

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    const orders = getLocalOrders();
    const filtered = orders.filter((o) => o.id !== orderId);
    saveLocalOrders(filtered);
    return true;
  }
};
