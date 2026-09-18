'use client';

import React from 'react';
import { BRAND_CONFIG } from '@/config/brand';
import { Truck, Globe, Clock, ShieldCheck } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block mb-1">
          FULFILLMENT & DELIVERIES
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#35251E]">
          SHIPPING POLICY
        </h1>
        <p className="text-xs sm:text-sm text-[#806B5D] mt-2">
          Complimentary express shipping across India and the United States on qualifying atelier orders.
        </p>
      </div>

      <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 sm:p-8 space-y-6 text-xs text-[#806B5D] leading-relaxed">
        
        <div>
          <h2 className="font-serif text-lg font-bold text-[#35251E] mb-2 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#A85F43]" />
            <span>1. INDIA SHIPPING DETAILS</span>
          </h2>
          <p>
            Standard express shipping within India is complimentary for all orders exceeding ₹2,999. Orders below ₹2,999 incur a flat nominal shipping fee of ₹199.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-[#35251E]">
            <li>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad): 2 – 4 business days</li>
            <li>Rest of India: 4 – 6 business days</li>
            <li>Carrier Partners: BlueDart, Delhivery, DTDC Express</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-[#35251E] mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#A85F43]" />
            <span>2. UNITED STATES SHIPPING DETAILS</span>
          </h2>
          <p>
            Complimentary standard shipping across all 50 US States on orders over $150. Orders under $150 incur a flat $15 shipping fee.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-[#35251E]">
            <li>Standard Air Shipping: 4 – 7 business days</li>
            <li>Priority Express Shipping: 2 – 3 business days</li>
            <li>Carrier Partners: FedEx, UPS, DHL Express</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-[#35251E] mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#A85F43]" />
            <span>3. ORDER PROCESSING & DISPATCH</span>
          </h2>
          <p>
            Orders placed before 12:00 PM IST / EST are processed and dispatched from our ateliers on the same business day. Orders placed on Sundays or public holidays are dispatched on the subsequent business day.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-[#35251E] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#A85F43]" />
            <span>4. SIGNATURE PACKAGING & DUSTBAGS</span>
          </h2>
          <p>
            Every AUREN piece is wrapped in unbleached tissue paper and packed inside a reusable organic cotton dustbag to protect delicate flax and silk fibers during transit.
          </p>
        </div>

      </div>

    </div>
  );
}
