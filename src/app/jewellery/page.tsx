'use client';

import React from 'react';
import Link from 'next/link';
import { JewelleryScrollSequence } from '@/components/jewellery/JewelleryScrollSequence';
import { ProductGrid } from '@/components/product/ProductGrid';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { Gem, ShieldCheck, Sparkles, ArrowRight, RefreshCw, Award } from 'lucide-react';

export default function JewelleryPage() {
  const jewelryProducts = MOCK_PRODUCTS.filter((p) => p.category === 'jewelry');

  return (
    <div className="bg-[#050505] text-[#F5F1E8] min-h-screen">
      
      {/* 1. HERO HEADER */}
      <section className="relative py-16 sm:py-24 border-b border-[#C0C0C0]/20 bg-[radial-gradient(ellipse_at_top,#17120E_0%,#050505_80%)] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 text-[#E2E8F0] text-[10px] font-mono tracking-[0.3em] uppercase">
            <Gem className="w-3.5 h-3.5 text-[#C0C0C0] animate-pulse" />
            <span>MUNAAZ HAUTE JOAILLERIE ATELIER</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#F5F1E8] via-[#E2E8F0] to-[#94A3B8]">
            FINE SILVER JEWELLERY
          </h1>

          <p className="text-xs sm:text-sm text-[#D8C7AD]/70 font-light tracking-widest max-w-xl mx-auto uppercase leading-relaxed">
            Solid 925 Sterling Silver Forged into Fluid Architectural Art & Hand-Set with Certified Moissanite & Lab Diamonds
          </p>
        </div>
      </section>

      {/* 2. CINEMATIC SCROLL SEQUENCE ENGINE (jewScene/1st -> 2nd -> 3rd -> 4th -> 5th...) */}
      <JewelleryScrollSequence />

      {/* 3. CURATED CREATIONS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#C0C0C0]/20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-[#C0C0C0]/20 gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#C0C0C0] uppercase block mb-1">
              BOUTIQUE CATALOG
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-[0.15em] text-[#F5F1E8]">
              HAUTE JOAILLERIE CREATIONS
            </h2>
          </div>

          <p className="text-xs text-[#D8C7AD]/70 font-light tracking-wide max-w-xs">
            Handcrafted in limited seasonal batches. Certified 925 sterling silver with rhodium anti-tarnish finish.
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={jewelryProducts} />
      </section>

      {/* 4. ATELIER CRAFTSMANSHIP GUARANTEE */}
      <section className="bg-[#17120E] border-t border-[#C0C0C0]/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#C0C0C0] uppercase block">
              OUR STANDARDS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.15em] text-[#F5F1E8]">
              THE JOAILLERIE PROMISE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#050505] border border-[#C0C0C0]/20 space-y-4 text-center">
              <div className="w-12 h-12 bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 rounded-full flex items-center justify-center mx-auto text-[#E2E8F0]">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#F5F1E8] font-light tracking-wider">SOLID 925 HALLMARK</h3>
              <p className="text-xs text-[#D8C7AD]/70 font-light leading-relaxed">
                Forged strictly from 92.5% pure silver alloy, laser-engraved with official hallmarking stamps for complete authenticity.
              </p>
            </div>

            <div className="p-8 bg-[#050505] border border-[#C0C0C0]/20 space-y-4 text-center">
              <div className="w-12 h-12 bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 rounded-full flex items-center justify-center mx-auto text-[#E2E8F0]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#F5F1E8] font-light tracking-wider">RHODIUM PROTECTIVE SHIELD</h3>
              <p className="text-xs text-[#D8C7AD]/70 font-light leading-relaxed">
                Electroplated in triple-layer pure rhodium for zero discoloration, hypoallergenic safety, and lasting mirror-grade sheen.
              </p>
            </div>

            <div className="p-8 bg-[#050505] border border-[#C0C0C0]/20 space-y-4 text-center">
              <div className="w-12 h-12 bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 rounded-full flex items-center justify-center mx-auto text-[#E2E8F0]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#F5F1E8] font-light tracking-wider">LIFETIME WARRANTY & CASE</h3>
              <p className="text-xs text-[#D8C7AD]/70 font-light leading-relaxed">
                Delivered inside a custom velvet jewelry box with anti-tarnish suede polish cloth and lifetime craftsmanship coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
