'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block mb-1">
          TERMS OF SERVICE
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#35251E]">
          TERMS & CONDITIONS
        </h1>
        <p className="text-xs text-[#806B5D] mt-2">
          Last updated: August 2026. General terms governing purchases at AUREN Atelier.
        </p>
      </div>

      <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 sm:p-8 space-y-6 text-xs text-[#806B5D] leading-relaxed">
        <div>
          <h2 className="font-serif text-base font-bold text-[#35251E] mb-2">1. OVERVIEW</h2>
          <p>
            This website is operated by AUREN Atelier. Throughout the site, the terms "we", "us" and "our" refer to AUREN. By visiting our site or purchasing garments from us, you engage in our "Service" and agree to be bound by these terms.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-base font-bold text-[#35251E] mb-2">2. PRICING & REGIONAL CURRENCIES</h2>
          <p>
            Prices for our products are displayed in Indian Rupees (₹ INR) for India and US Dollars ($ USD) for the United States. We reserve the right to modify prices or discontinue items at any time without prior notice.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-base font-bold text-[#35251E] mb-2">3. INTELLECTUAL PROPERTY</h2>
          <p>
            All content on this website, including designs, photography, copy, and trademarks, is the exclusive property of AUREN Atelier.
          </p>
        </div>
      </div>

    </div>
  );
}
