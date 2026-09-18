import { Order } from '@/types/order';

const MOCK_ORDERS_KEY = 'auren_mock_orders';

export const orderService = {
  getOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(MOCK_ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentStatus' | 'estimatedDelivery'>): Order {
    const orders = this.getOrders();
    const newOrderNumber = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    const updated = [newOrder, ...orders];
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(updated));
    }
    return newOrder;
  }
};
