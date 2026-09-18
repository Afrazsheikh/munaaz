'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { useRegion } from '@/context/RegionContext';
import { Globe, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface FooterProps {
  onOpenRegionModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegionModal }) => {
  const { config } = useRegion();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    }, 800);
  };

  return (
    <footer className="bg-[#2A1D18] text-[#F3E5D0] pt-16 pb-12 border-t border-[#35251E]">
      
      {/* Brand Value Props Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#35251E] grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="p-3 bg-[#35251E] text-[#C18A60] rounded-none">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#FFF9F1]">COMPLIMENTARY EXPRESS SHIPPING</h4>
            <p className="text-xs text-[#806B5D] mt-0.5">On orders over {config.symbol}{config.freeShippingThreshold.toLocaleString()} across {config.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="p-3 bg-[#35251E] text-[#C18A60] rounded-none">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#FFF9F1]">14-DAY EDITORIAL RETURNS</h4>
            <p className="text-xs text-[#806B5D] mt-0.5">Hassle-free doorstep pickup & exchange</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="p-3 bg-[#35251E] text-[#C18A60] rounded-none">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#FFF9F1]">AUTHENTIC CRAFTSMANSHIP</h4>
            <p className="text-xs text-[#806B5D] mt-0.5">Ethically sourced materials & fine tailoring</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#35251E]">
          
          {/* Brand Info & Country Switcher */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.2em] font-bold text-[#FFF9F1]">
                {BRAND_CONFIG.name}
              </span>
            </Link>
            <p className="text-xs text-[#806B5D] mt-3 leading-relaxed max-w-sm">
              {BRAND_CONFIG.subheading} Designed for modern closets across India and the United States.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#FFF9F1] mb-2">
                JOIN THE EDIT
              </h5>
              <p className="text-xs text-[#806B5D] mb-3">
                Be the first to discover new collections, exclusive releases, and style notes.
              </p>

              {newsletterStatus === 'success' ? (
                <div className="bg-[#A85F43]/20 text-[#FFF9F1] text-xs p-3 border border-[#A85F43]">
                  Thank you for subscribing to the MUNAAZ Edit.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-[#35251E] border border-[#806B5D]/40 text-[#FFF9F1] text-xs px-3.5 py-2.5 flex-1 focus:outline-none focus:border-[#C18A60] placeholder-[#806B5D]"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold px-5 py-2.5 tracking-wider uppercase transition-colors flex items-center justify-center gap-1"
                  >
                    <span>{newsletterStatus === 'loading' ? 'JOINING...' : 'SUBSCRIBE'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
              {newsletterStatus === 'error' && (
                <p className="text-red-400 text-[11px] mt-1">Please enter a valid email address.</p>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#FFF9F1] mb-4">SHOP</h5>
            <ul className="space-y-2.5 text-xs text-[#806B5D]">
              <li><Link href="/collections/new-arrivals" className="hover:text-[#F3E5D0] transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/men" className="hover:text-[#F3E5D0] transition-colors">Men's Edit</Link></li>
              <li><Link href="/collections/women" className="hover:text-[#F3E5D0] transition-colors">Women's Edit</Link></li>
              <li><Link href="/collections/linen-edit" className="hover:text-[#F3E5D0] transition-colors">The Linen Collection</Link></li>
              <li><Link href="/collections/best-sellers" className="hover:text-[#F3E5D0] transition-colors">Best Sellers</Link></li>
              <li><Link href="/collections/sale" className="hover:text-[#F3E5D0] transition-colors text-[#C18A60]">Seasonal Sale</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#FFF9F1] mb-4">CUSTOMER CARE</h5>
            <ul className="space-y-2.5 text-xs text-[#806B5D]">
              <li><Link href="/contact" className="hover:text-[#F3E5D0] transition-colors">Contact Us</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#F3E5D0] transition-colors">Size Guide & Fit</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#F3E5D0] transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns-policy" className="hover:text-[#F3E5D0] transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/account" className="hover:text-[#F3E5D0] transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h5 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#FFF9F1] mb-4">THE HOUSE</h5>
            <ul className="space-y-2.5 text-xs text-[#806B5D]">
              <li><Link href="/about" className="hover:text-[#F3E5D0] transition-colors">About MUNAAZ</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#F3E5D0] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#F3E5D0] transition-colors">Terms of Service</Link></li>
            </ul>

            <div className="mt-6">
              <button
                onClick={onOpenRegionModal}
                className="flex items-center gap-2 text-xs text-[#F3E5D0] bg-[#35251E] px-3 py-2 border border-[#806B5D]/30 hover:border-[#C18A60] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#C18A60]" />
                <span>{config.flag} {config.name} ({config.currency} {config.symbol})</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright & region payment notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#806B5D] gap-4">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name} Atelier. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Secured Checkout via {config.code === 'IN' ? 'Razorpay / UPI / Cards' : 'Stripe / Cards / Apple Pay'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
