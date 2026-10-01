import { Coupon } from '@/types/coupon';

const MOCK_COUPONS_KEY = 'munaaz_coupons_db';

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'MUNAAZ10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmountINR: 2000,
    minOrderAmountUSD: 30,
    isActive: true,
    usageCount: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 'coup-2',
    code: 'ATELIER500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmountINR: 5000,
    minOrderAmountUSD: 75,
    isActive: true,
    usageCount: 18,
    createdAt: new Date().toISOString()
  }
];

const getLocalCoupons = (): Coupon[] => {
  if (typeof window === 'undefined') return DEFAULT_COUPONS;
  const saved = localStorage.getItem(MOCK_COUPONS_KEY);
  if (!saved) {
    localStorage.setItem(MOCK_COUPONS_KEY, JSON.stringify(DEFAULT_COUPONS));
    return DEFAULT_COUPONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_COUPONS;
  }
};

const saveLocalCoupons = (coupons: Coupon[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_COUPONS_KEY, JSON.stringify(coupons));
  }
};

export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    try {
      const res = await fetch('/api/coupons', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        saveLocalCoupons(data.data);
        return data.data;
      }
    } catch {
      // Fallback
    }
    return getLocalCoupons();
  },

  async createCoupon(couponData: Omit<Coupon, 'id' | 'createdAt' | 'usageCount'>): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      code: couponData.code.toUpperCase().trim(),
      usageCount: 0,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const local = getLocalCoupons();
        saveLocalCoupons([data.data, ...local]);
        return data.data;
      }
    } catch {
      // Fallback
    }

    const local = getLocalCoupons();
    const updated = [newCoupon, ...local];
    saveLocalCoupons(updated);
    return newCoupon;
  },

  async toggleCouponActive(id: string, isActive: boolean): Promise<Coupon | undefined> {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const local = getLocalCoupons();
        const index = local.findIndex((c) => c.id === id);
        if (index !== -1) {
          local[index] = data.data;
          saveLocalCoupons(local);
        }
        return data.data;
      }
    } catch {
      // Fallback
    }

    const local = getLocalCoupons();
    const index = local.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    local[index].isActive = isActive;
    saveLocalCoupons(local);
    return local[index];
  },

  async deleteCoupon(id: string): Promise<boolean> {
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    const local = getLocalCoupons();
    const filtered = local.filter((c) => c.id !== id);
    saveLocalCoupons(filtered);
    return true;
  }
};
