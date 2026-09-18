'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRegion } from '@/context/RegionContext';

export const MiniBagDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotalINR,
    subtotalUSD,
    discountINR,
    discountUSD,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    totalItems
  } = useCart();
  const { region, config, formatPrice } = useRegion();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const currentSubtotal = region === 'IN' ? subtotalINR : subtotalUSD;
  const freeThreshold = config.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeThreshold - currentSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((currentSubtotal / freeThreshold) * 100));

  const finalTotalINR = Math.max(0, subtotalINR - discountINR);
  const finalTotalUSD = Math.max(0, subtotalUSD - discountUSD);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-out Drawer */}
      <div className="relative bg-[#FFF9F1] w-full max-w-md h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#DDCBB7]">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#DDCBB7] bg-[#F3E5D0]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#A85F43]" />
            <h3 className="font-serif text-lg font-bold text-[#35251E] tracking-wider uppercase">
              YOUR BAG ({totalItems})
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#35251E] hover:text-[#A85F43] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#2A1D18] text-[#F3E5D0] px-5 py-3 text-xs border-b border-[#35251E]">
          <div className="flex items-center gap-2 mb-1.5">
            <Truck className="w-4 h-4 text-[#C18A60]" />
            {remainingForFreeShipping === 0 ? (
              <span className="font-medium text-[#FFF9F1]">You qualify for free express shipping!</span>
            ) : (
              <span>
                Add <strong className="text-[#C18A60]">{config.symbol}{remainingForFreeShipping.toLocaleString()}</strong> more to unlock free shipping
              </span>
            )}
          </div>
          <div className="w-full bg-[#35251E] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#A85F43] h-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List / Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#806B5D] mb-4 stroke-[1.2]" />
              <h4 className="font-serif text-lg font-bold text-[#35251E]">YOUR BAG IS EMPTY</h4>
              <p className="text-xs text-[#806B5D] mt-1 mb-6 max-w-xs">
                Explore our everyday elevated essentials and find timeless silhouettes.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/shop');
                }}
                className="bg-[#A85F43] text-[#FFF9F1] hover:bg-[#C18A60] text-xs font-semibold px-6 py-3 tracking-widest uppercase transition-colors"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-[#FFF9F1] border border-[#DDCBB7] hover:border-[#C18A60] transition-colors"
              >
                <div className="relative w-20 h-24 bg-[#F3E5D0] flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-semibold text-[#35251E] leading-tight">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#806B5D] hover:text-red-700 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#806B5D] mt-0.5">
                      Color: {item.selectedColor} | Size: {item.selectedSize}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#DDCBB7] bg-[#FFF9F1]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#35251E] hover:bg-[#F3E5D0]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-[#35251E]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#35251E] hover:bg-[#F3E5D0]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-semibold text-xs text-[#35251E]">
                      {formatPrice(
                        item.unitPriceINR * item.quantity,
                        item.unitPriceUSD * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Buttons */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#DDCBB7] bg-[#F3E5D0]/30 space-y-3">
            
            {/* Coupon Code Section */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-[#A85F43]/10 border border-[#A85F43] px-3 py-2 text-xs">
                <span className="flex items-center gap-1.5 text-[#A85F43] font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  Code {appliedCoupon.code} applied ({appliedCoupon.value}% OFF)
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-[10px] text-[#806B5D] underline hover:text-[#35251E]"
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. MUNAAZ10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="bg-[#FFF9F1] border border-[#DDCBB7] text-xs px-3 py-2 flex-1 focus:outline-none focus:border-[#A85F43]"
                />
                <button
                  type="submit"
                  className="bg-[#35251E] text-[#FFF9F1] hover:bg-[#A85F43] text-xs px-3 py-2 font-semibold transition-colors uppercase"
                >
                  APPLY
                </button>
              </form>
            )}

            {couponMsg && !appliedCoupon && (
              <p className={`text-[11px] ${couponMsg.success ? 'text-green-700' : 'text-red-600'}`}>
                {couponMsg.text}
              </p>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 pt-2 text-xs text-[#806B5D]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#35251E]">{formatPrice(subtotalINR, subtotalUSD)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-[#A85F43]">
                  <span>Discount</span>
                  <span>-{formatPrice(discountINR, discountUSD)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{remainingForFreeShipping === 0 ? 'FREE' : formatPrice(config.flatShippingRate, config.flatShippingRate)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#35251E] pt-2 border-t border-[#DDCBB7]">
                <span>Total</span>
                <span>{formatPrice(finalTotalINR, finalTotalUSD)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="block text-center bg-[#FFF9F1] border border-[#35251E] text-[#35251E] hover:bg-[#35251E] hover:text-[#FFF9F1] text-xs font-semibold py-3 uppercase tracking-wider transition-colors"
              >
                VIEW CART
              </Link>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/checkout');
                }}
                className="bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold py-3 uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
              >
                <span>CHECKOUT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
