'use client';

import React from 'react';
import { RefreshCw, RotateCcw, ShieldAlert, Check } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block mb-1">
          CLIENT GUARANTEE
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#35251E]">
          RETURNS & REFUNDS POLICY
        </h1>
        <p className="text-xs sm:text-sm text-[#806B5D] mt-2">
          Complimentary 14-day doorstep exchange and return pickup for India and the United States.
        </p>
      </div>

      <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 sm:p-8 space-y-6 text-xs text-[#806B5D] leading-relaxed">
        
        <div>
          <h2 className="font-serif text-lg font-bold text-[#35251E] mb-2 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#A85F43]" />
            <span>1. 14-DAY EDITORIAL RETURN WINDOW</span>
          </h2>
          <p>
            If a garment does not meet your fit expectations, you may request a return or size exchange within 14 calendar days from the date of delivery.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-[#35251E] mb-2 flex items-center gap-2">
            <Check className="w-5 h-5 text-[#A85F43]" />
            <span>2. ITEM ELIGIBILITY CONDITIONS</span>
          </h2>
          <p>To qualify for a full refund or exchange:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-[#35251E]">
            <li>Garments must be unworn, unwashed, and undamaged</li>
            <li>Original AUREN fabric security tags and brand labels must remain intact</li>
            <li>Must be returned in original protective cotton dustbag</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-[#35251E] mb-2 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#A85F43]" />
            <span>3. REFUND TIMELINE & METHOD</span>
          </h2>
          <p>
            Once our quality control team inspects the returned garment at our atelier (usually within 48 hours of receipt), refunds are processed to your original payment method (Razorpay/UPI/Cards/Stripe) within 3 – 5 business days.
          </p>
        </div>

      </div>

    </div>
  );
}
