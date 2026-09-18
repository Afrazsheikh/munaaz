'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRegion } from '@/context/RegionContext';
import { orderService } from '@/services/orderService';
import { Order, PaymentMethodType } from '@/types/order';
import { CheckCircle2, ShieldCheck, Lock, Truck, CreditCard, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotalINR, subtotalUSD, discountINR, discountUSD, clearCart } = useCart();
  const { region, config, formatPrice } = useRegion();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Address & Contact, 2: Payment, 3: Review, 4: Confirmed Order

  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(region === 'IN' ? 'upi' : 'stripe');

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculations
  const shippingFeeINR = config.flatShippingRate;
  const shippingFeeUSD = config.flatShippingRate;
  const taxINR = Math.round((subtotalINR - discountINR) * config.taxRate);
  const taxUSD = Math.round((subtotalUSD - discountUSD) * config.taxRate);

  const totalINR = Math.max(0, subtotalINR - discountINR + shippingFeeINR + taxINR);
  const totalUSD = Math.max(0, subtotalUSD - discountUSD + shippingFeeUSD + taxUSD);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !street || !city || !state || !postalCode) {
      setErrorMsg('Please complete all required shipping & contact fields.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder = orderService.createOrder({
        customer: { name: fullName, email, phone },
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName,
          street,
          apartment,
          city,
          state,
          postalCode,
          country: region,
          phone
        },
        billingAddress: {
          id: `addr-${Date.now()}`,
          fullName,
          street,
          apartment,
          city,
          state,
          postalCode,
          country: region,
          phone
        },
        items,
        subtotal: region === 'IN' ? subtotalINR : subtotalUSD,
        discount: region === 'IN' ? discountINR : discountUSD,
        shippingFee: region === 'IN' ? shippingFeeINR : shippingFeeUSD,
        tax: region === 'IN' ? taxINR : taxUSD,
        total: region === 'IN' ? totalINR : totalUSD,
        currency: config.currency as any,
        paymentMethod
      });

      setCreatedOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      setStep(4);
    }, 1200);
  };

  // STEP 4: ORDER CONFIRMED VIEW
  if (step === 4 && createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-[#A85F43] text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block">
          THANK YOU FOR YOUR ORDER
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#35251E] mt-1 mb-2">
          ORDER #{createdOrder.orderNumber}
        </h1>
        <p className="text-xs text-[#806B5D] max-w-md mx-auto mb-8">
          We have sent an order confirmation summary to <strong>{createdOrder.customer.email}</strong>. Estimated delivery: <strong>{createdOrder.estimatedDelivery}</strong>.
        </p>

        {/* Order Details Summary Card */}
        <div className="bg-[#FFF9F1] border border-[#DDCBB7] text-left p-6 sm:p-8 space-y-6 mb-8">
          <div className="flex justify-between items-center pb-4 border-b border-[#DDCBB7]">
            <span className="text-xs font-bold text-[#35251E] uppercase tracking-wider">
              SHIPPING TO:
            </span>
            <span className="text-xs text-[#806B5D]">
              {createdOrder.shippingAddress.fullName} • {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.country}
            </span>
          </div>

          <div className="space-y-3">
            {createdOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="text-[#35251E] font-medium">
                  {item.product.name} x {item.quantity} ({item.selectedColor}, {item.selectedSize})
                </span>
                <span className="font-bold text-[#35251E]">
                  {formatPrice(item.unitPriceINR * item.quantity, item.unitPriceUSD * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#DDCBB7] flex justify-between text-sm font-bold text-[#35251E]">
            <span>TOTAL PAID</span>
            <span>{config.symbol}{createdOrder.total.toLocaleString()} {createdOrder.currency}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account/orders"
            className="bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold px-8 py-3.5 tracking-widest uppercase transition-colors"
          >
            VIEW MY ORDERS
          </Link>
          <Link
            href="/shop"
            className="bg-[#35251E] hover:bg-[#2A1D18] text-[#FFF9F1] text-xs font-semibold px-8 py-3.5 tracking-widest uppercase transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step !== 4) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#35251E]">YOUR BAG IS EMPTY</h1>
        <p className="text-xs text-[#806B5D] mt-2 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="bg-[#A85F43] text-white text-xs font-semibold px-6 py-3 uppercase">
          EXPLORE CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Checkout Steps Indicator */}
      <div className="flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider mb-10 pb-4 border-b border-[#DDCBB7]">
        <span className={step === 1 ? 'text-[#A85F43] underline' : 'text-[#806B5D]'}>1. SHIPPING</span>
        <span className="text-[#DDCBB7]">•</span>
        <span className={step === 2 ? 'text-[#A85F43] underline' : 'text-[#806B5D]'}>2. PAYMENT</span>
        <span className="text-[#DDCBB7]">•</span>
        <span className={step === 3 ? 'text-[#A85F43] underline' : 'text-[#806B5D]'}>3. REVIEW</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column Form Steps (7 Cols) */}
        <div className="lg:col-span-7 bg-[#FFF9F1] border border-[#DDCBB7] p-6 sm:p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: CONTACT & SHIPPING ADDRESS */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#35251E] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#A85F43]" />
                <span>SHIPPING & CONTACT INFORMATION</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#35251E] mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#35251E] mb-1">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                    placeholder={region === 'IN' ? '+91 98765 43210' : '+1 (555) 000-0000'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#35251E] mb-1">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                  placeholder="Aria Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#35251E] mb-1">STREET ADDRESS *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                  placeholder="House / Street / Colony"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#35251E] mb-1">CITY *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#35251E] mb-1">STATE / PROVINCE *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#35251E] mb-1">
                    {region === 'IN' ? 'PIN CODE *' : 'ZIP CODE *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#FFF9F1] border border-[#DDCBB7] text-xs p-3 focus:outline-none focus:border-[#A85F43]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold py-4 uppercase tracking-[0.15em] transition-colors"
              >
                CONTINUE TO PAYMENT
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#35251E] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#A85F43]" />
                <span>PAYMENT METHOD ({config.name})</span>
              </h2>

              <div className="space-y-3">
                {region === 'IN' ? (
                  <>
                    <label className="flex items-center justify-between p-4 border border-[#DDCBB7] cursor-pointer hover:border-[#A85F43]">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pm"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="accent-[#A85F43]"
                        />
                        <span className="font-semibold text-xs text-[#35251E]">UPI (GPay / PhonePe / Paytm)</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#A85F43]">INSTANT</span>
                    </label>

                    <label className="flex items-center justify-between p-4 border border-[#DDCBB7] cursor-pointer hover:border-[#A85F43]">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pm"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="accent-[#A85F43]"
                        />
                        <span className="font-semibold text-xs text-[#35251E]">Credit / Debit Cards (Razorpay)</span>
                      </div>
                      <span className="text-[10px] text-[#806B5D]">VISA / Mastercard</span>
                    </label>

                    <label className="flex items-center justify-between p-4 border border-[#DDCBB7] cursor-pointer hover:border-[#A85F43]">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pm"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-[#A85F43]"
                        />
                        <span className="font-semibold text-xs text-[#35251E]">Cash on Delivery (COD)</span>
                      </div>
                    </label>
                  </>
                ) : (
                  <>
                    <label className="flex items-center justify-between p-4 border border-[#DDCBB7] cursor-pointer hover:border-[#A85F43]">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pm"
                          checked={paymentMethod === 'stripe'}
                          onChange={() => setPaymentMethod('stripe')}
                          className="accent-[#A85F43]"
                        />
                        <span className="font-semibold text-xs text-[#35251E]">Credit / Debit Card (Stripe)</span>
                      </div>
                      <span className="text-[10px] text-[#806B5D]">SECURE</span>
                    </label>

                    <label className="flex items-center justify-between p-4 border border-[#DDCBB7] cursor-pointer hover:border-[#A85F43]">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pm"
                          checked={paymentMethod === 'apple_pay'}
                          onChange={() => setPaymentMethod('apple_pay')}
                          className="accent-[#A85F43]"
                        />
                        <span className="font-semibold text-xs text-[#35251E]">Apple Pay / Google Pay</span>
                      </div>
                    </label>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-[#35251E] text-[#35251E] text-xs font-semibold py-3.5 uppercase"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-[#A85F43] hover:bg-[#C18A60] text-white text-xs font-semibold py-3.5 uppercase tracking-widest"
                >
                  REVIEW ORDER
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER REVIEW */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#35251E]">
                FINAL ORDER REVIEW
              </h2>

              <div className="p-4 bg-[#F3E5D0]/50 border border-[#DDCBB7] text-xs space-y-2">
                <p><strong>Deliver To:</strong> {fullName} ({phone})</p>
                <p><strong>Address:</strong> {street}, {city}, {state} {postalCode}, {region}</p>
                <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-[#35251E] text-[#35251E] text-xs font-semibold py-4 uppercase"
                >
                  BACK
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-2/3 bg-[#A85F43] hover:bg-[#C18A60] text-white text-xs font-semibold py-4 uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'PLACING ORDER...' : 'CONFIRM & PLACE ORDER'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-[#F3E5D0]/40 border border-[#DDCBB7] p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#35251E] pb-3 border-b border-[#DDCBB7]">
            BAG SUMMARY ({items.length})
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs">
                <div className="relative w-12 h-16 bg-[#F3E5D0] flex-shrink-0">
                  <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#35251E] truncate">{item.product.name}</h4>
                  <p className="text-[#806B5D] text-[11px]">Qty: {item.quantity} | {item.selectedSize}</p>
                  <span className="font-bold text-[#35251E] block mt-1">
                    {formatPrice(item.unitPriceINR * item.quantity, item.unitPriceUSD * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#DDCBB7] space-y-2 text-xs text-[#806B5D]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#35251E]">{formatPrice(subtotalINR, subtotalUSD)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{formatPrice(shippingFeeINR, shippingFeeUSD)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>{formatPrice(taxINR, taxUSD)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#35251E] pt-2 border-t border-[#DDCBB7]">
              <span>TOTAL DUE</span>
              <span>{formatPrice(totalINR, totalUSD)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
