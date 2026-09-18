'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-[0.25em] text-[#806B5D] uppercase block mb-1">
          LEGAL & DATA
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#35251E]">
          PRIVACY POLICY
        </h1>
        <p className="text-xs text-[#806B5D] mt-2">
          Effective Date: August 2026. How AUREN Atelier safeguards your personal data.
        </p>
      </div>

      <div className="bg-[#FFF9F1] border border-[#DDCBB7] p-6 sm:p-8 space-y-6 text-xs text-[#806B5D] leading-relaxed">
        <div>
          <h2 className="font-serif text-base font-bold text-[#35251E] mb-2">1. INFORMATION WE COLLECT</h2>
          <p>
            When you visit or make a purchase from AUREN Atelier, we collect personal information such as your name, billing address, shipping address, email address, phone number, and payment preferences.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-base font-bold text-[#35251E] mb-2">2. HOW WE USE YOUR INFORMATION</h2>
          <p>
            We utilize collected order data exclusively to fulfill purchases, process payments, arrange shipping through partner logistics, and communicate order tracking status.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-base font-bold text-[#35251E] mb-2">3. PAYMENT SECURITY</h2>
          <p>
            We do not store or process raw credit card or bank account details on our servers. All financial transactions are securely processed via PCI-DSS compliant payment gateways (Razorpay in India and Stripe in the USA).
          </p>
        </div>

        <div>
          <h2 className="font-serif text-base font-bold text-[#35251E] mb-2">4. CONTACT OUR DATA CONCIERGE</h2>
          <p>
            If you have questions regarding your data privacy rights, please write to us at concierge@aurenfashion.com.
          </p>
        </div>
      </div>

    </div>
  );
}
