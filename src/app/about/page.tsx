'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Banner */}
      <section className="relative min-h-[50vh] bg-[#F3E5D0] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1600&auto=format&fit=crop"
            alt="AUREN Atelier Brand Story"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#A85F43] block mb-2">
            THE HOUSE OF MUNAAZ
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#35251E]">
            EVERYDAY, ELEVATED.
          </h1>
          <p className="text-sm sm:text-base text-[#806B5D] mt-4 font-light leading-relaxed">
            Founded on the belief that everyday clothing should possess the sartorial dignity of bespoke tailoring and the effortless comfort of natural fabrics.
          </p>
        </div>
      </section>

      {/* Story Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-[#806B5D] uppercase">
            CRAFTSMANSHIP & INTEGRITY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#35251E]">
            THOUGHTFUL SILHOUETTES, ETHICAL FABRICS.
          </h2>
          <p className="text-xs sm:text-sm text-[#806B5D] leading-relaxed">
            At MUNAAZ, we reject fast-fashion trends in favor of timeless silhouettes. Our garments are crafted from ethically grown European flax linen, long-staple Peruvian Pima cotton, and lightweight tropical wool blends.
          </p>
          <p className="text-xs sm:text-sm text-[#806B5D] leading-relaxed">
            Each pattern is engineered for fluid movement and tailored drape, bridging modern aesthetics between Mumbai, New York, and global fashion capitals.
          </p>
        </div>

        <div className="relative aspect-[4/3] bg-[#F3E5D0] border border-[#DDCBB7] overflow-hidden shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop"
            alt="Atelier Craft"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Three Pillars */}
      <section className="bg-[#F3E5D0]/50 border-y border-[#DDCBB7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#35251E] mb-12">
            OUR THREE PILLARS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#FFF9F1] border border-[#DDCBB7]">
              <span className="font-serif text-3xl text-[#A85F43] font-bold block mb-3">01</span>
              <h3 className="font-serif text-lg font-bold text-[#35251E] mb-2">TIMELESS DESIGN</h3>
              <p className="text-xs text-[#806B5D] leading-relaxed">
                Silhouettes designed to transcend seasons and pair effortlessly across your entire wardrobe.
              </p>
            </div>

            <div className="p-8 bg-[#FFF9F1] border border-[#DDCBB7]">
              <span className="font-serif text-3xl text-[#A85F43] font-bold block mb-3">02</span>
              <h3 className="font-serif text-lg font-bold text-[#35251E] mb-2">CONSIDERED FABRICS</h3>
              <p className="text-xs text-[#806B5D] leading-relaxed">
                100% natural organic flax, Pima cottons, and silk weaves that breathe and age with grace.
              </p>
            </div>

            <div className="p-8 bg-[#FFF9F1] border border-[#DDCBB7]">
              <span className="font-serif text-3xl text-[#A85F43] font-bold block mb-3">03</span>
              <h3 className="font-serif text-lg font-bold text-[#35251E] mb-2">GLOBAL TRANSPARENCY</h3>
              <p className="text-xs text-[#806B5D] leading-relaxed">
                Dedicated client advisory, door-to-door express delivery, and fair pricing for India and US audiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#35251E] mb-4">
          DISCOVER THE AUTUMN COLLECTION
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#A85F43] hover:bg-[#C18A60] text-white text-xs font-semibold px-8 py-4 tracking-widest uppercase transition-colors"
        >
          <span>EXPLORE CATALOG</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  );
}
