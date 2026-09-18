'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useRegion } from '@/context/RegionContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Tag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
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

  const currentSubtotal = region === 'IN' ? subtotalINR : subtotalUSD;
  const freeThreshold = config.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeThreshold - currentSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((currentSubtotal / freeThreshold) * 100));

  const shippingFeeINR = remainingForFreeShipping === 0 ? 0 : config.flatShippingRate;
  const shippingFeeUSD = remainingForFreeShipping === 0 ? 0 : config.flatShippingRate;

  const taxINR = Math.round((subtotalINR - discountINR) * config.taxRate);
  const taxUSD = Math.round((subtotalUSD - discountUSD) * config.taxRate);

  const finalTotalINR = Math.max(0, subtotalINR - discountINR + shippingFeeINR + taxINR);
  const finalTotalUSD = Math.max(0, subtotalUSD - discountUSD + shippingFeeUSD + taxUSD);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-[#806B5D] mx-auto mb-4 stroke-[1.2]" />
        <h1 className="font-serif text-3xl font-bold text-[#35251E]">YOUR SHOPPING BAG IS EMPTY</h1>
        <p className="text-xs text-[#806B5D] mt-2 mb-8 max-w-sm mx-auto">
          Explore our everyday elevated silhouettes and curate your personal luxury closet.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold px-8 py-4 tracking-widest uppercase transition-colors"
        >
          EXPLORE COLLECTION
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#35251E] mb-6">
        SHOPPING BAG ({totalItems})
      </h1>

      {/* Free shipping bar */}
      <div className="bg-[#2A1D18] text-[#F3E5D0] p-4 mb-8 border border-[#35251E]">
        <div className="flex items-center gap-2 mb-2 text-xs">
          <Truck className="w-4 h-4 text-[#C18A60]" />
          {remainingForFreeShipping === 0 ? (
            <span className="font-semibold text-[#FFF9F1]">You qualify for free express shipping!</span>
          ) : (
            <span>
              Add <strong className="text-[#C18A60]">{config.symbol}{remainingForFreeShipping.toLocaleString()}</strong> more to qualify for free shipping in {config.name}.
            </span>
          )}
        </div>
        <div className="w-full bg-[#35251E] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#A85F43] h-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-6 p-4 bg-[#FFF9F1] border border-[#DDCBB7] items-center justify-between"
            >
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative w-24 h-32 bg-[#F3E5D0] flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#806B5D] uppercase">
                      {item.product.brand}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#35251E]">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-[#806B5D] mt-1">
                      Color: <strong>{item.selectedColor}</strong> | Size: <strong>{item.selectedSize}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-700 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>REMOVE</span>
                  </button>
                </div>
              </div>

              {/* Quantity & Item Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#DDCBB7]">
                <div className="flex items-center border border-[#DDCBB7] bg-[#FFF9F1]">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1.5 text-[#35251E] hover:bg-[#F3E5D0]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#35251E]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 text-[#35251E] hover:bg-[#F3E5D0]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-bold text-sm text-[#35251E] min-w-24 text-right">
                  {formatPrice(
                    item.unitPriceINR * item.quantity,
                    item.unitPriceUSD * item.quantity
                  )}
                </span>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-between items-center text-xs text-[#806B5D]">
            <Link href="/shop" className="hover:text-[#35251E] underline">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary (4 Cols) */}
        <div className="lg:col-span-4 bg-[#F3E5D0]/40 border border-[#DDCBB7] p-6 space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#35251E] pb-3 border-b border-[#DDCBB7]">
            ORDER SUMMARY
          </h2>

          {/* Promo code */}
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-[#A85F43]/10 border border-[#A85F43] p-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#A85F43] font-semibold">
                <Tag className="w-4 h-4" />
                Code {appliedCoupon.code} applied ({appliedCoupon.value}% OFF)
              </span>
              <button onClick={removeCoupon} className="text-[10px] text-[#806B5D] underline">
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
                className="bg-[#FFF9F1] border border-[#DDCBB7] text-xs px-3 py-2.5 flex-1 focus:outline-none focus:border-[#A85F43]"
              />
              <button
                type="submit"
                className="bg-[#35251E] text-[#FFF9F1] hover:bg-[#A85F43] text-xs px-4 py-2.5 font-semibold transition-colors uppercase"
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

          {/* Breakdown */}
          <div className="space-y-3 text-xs text-[#806B5D]">
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
              <span>Shipping Fee ({config.name})</span>
              <span>{remainingForFreeShipping === 0 ? 'FREE' : formatPrice(config.flatShippingRate, config.flatShippingRate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax ({Math.round(config.taxRate * 100)}%)</span>
              <span>{formatPrice(taxINR, taxUSD)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#35251E] pt-3 border-t border-[#DDCBB7]">
              <span>Estimated Total</span>
              <span>{formatPrice(finalTotalINR, finalTotalUSD)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold py-4 uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#806B5D] pt-2">
            <ShieldCheck className="w-4 h-4 text-[#A85F43]" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
}
