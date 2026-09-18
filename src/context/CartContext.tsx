'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CouponCode } from '@/types/cart';
import { Product } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, selectedColor: string, selectedSize: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotalINR: number;
  subtotalUSD: number;
  appliedCoupon: CouponCode | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountINR: number;
  discountUSD: number;
}

const CART_STORAGE_KEY = 'auren_user_cart';

const VALID_COUPONS: CouponCode[] = [
  { code: 'MUNAAZ10', discountType: 'percentage', value: 10, minSubtotalINR: 2000, minSubtotalUSD: 50 },
  { code: 'ELEVATE15', discountType: 'percentage', value: 15, minSubtotalINR: 5000, minSubtotalUSD: 100 }
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  };

  const addItem = (product: Product, selectedColor: string, selectedSize: string, quantity = 1) => {
    const itemId = `${product.id}-${selectedColor}-${selectedSize}`;
    const existingIndex = items.findIndex((item) => item.id === itemId);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [
        ...items,
        {
          id: itemId,
          productId: product.id,
          product,
          selectedColor,
          selectedSize,
          quantity,
          unitPriceINR: product.priceINR,
          unitPriceUSD: product.priceUSD
        }
      ];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updated = items.map((item) => (item.id === id ? { ...item, quantity } : item));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalINR = items.reduce((sum, item) => sum + item.unitPriceINR * item.quantity, 0);
  const subtotalUSD = items.reduce((sum, item) => sum + item.unitPriceUSD * item.quantity, 0);

  const discountINR = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round((subtotalINR * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const discountUSD = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round((subtotalUSD * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const applyCoupon = (code: string) => {
    const coupon = VALID_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { success: false, message: 'Invalid promo code' };
    }
    if (subtotalINR < coupon.minSubtotalINR) {
      return {
        success: false,
        message: `Code requires minimum order of ₹${coupon.minSubtotalINR.toLocaleString()} / $${coupon.minSubtotalUSD}`
      };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `Promo code ${coupon.code} applied (${coupon.value}% OFF)` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart,
        totalItems,
        subtotalINR,
        subtotalUSD,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountINR,
        discountUSD
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
