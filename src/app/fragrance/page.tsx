'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowLeft, Droplet, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { FragranceSection } from '@/components/fragrance/FragranceSection';

export default function FragrancePage() {
  return (
    <main className="min-h-screen bg-[#1C1412] text-[#FFF9F1] selection:bg-[#A85F43] selection:text-white">
      {/* Top Editorial Breadcrumbs Bar */}
      <div className="bg-[#150F0D] border-b border-[#35251E] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#DDCBB7]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-[#C18A60] transition-colors font-semibold tracking-wider uppercase text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO HOMEPAGE</span>
          </Link>

          <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] font-mono uppercase text-[#C18A60]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MUNAAZ ESSENCE · HAUTE PARFUMERIE</span>
          </div>
        </div>
      </div>

      {/* Main Cinematic Visual & Fragrance Collection Section */}
      <FragranceSection />

      {/* Editorial Craftsmanship & Scent Heritage Block */}
      <section className="bg-[#150F0D] border-t border-[#35251E] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#C18A60]">
                THE GRASSE ATELIER HERITAGE
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide text-[#FFF9F1] leading-tight">
                DISTILLED IN FRANCE, FORMULATED FOR MUNAAZ.
              </h2>

              <p className="text-sm text-[#DDCBB7] font-light leading-relaxed">
                Created in collaboration with master perfumers in Grasse, France—the cradle of world haute perfumery. Each fragrance is macerated for 6 weeks to achieve unmatched depth, sillage, and longevity on skin and fabric.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#35251E]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#C18A60]">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">20%+ CONCENTRATE</span>
                  </div>
                  <p className="text-[11px] text-[#806B5D]">High concentration Eau de Parfum & Extrait strength.</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#C18A60]">
                    <Droplet className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">NATURAL ESSENCES</span>
                  </div>
                  <p className="text-[11px] text-[#806B5D]">Ethically harvested rose, saffron, agarwood, & amber.</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#C18A60]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">SAMPLE SET</span>
                  </div>
                  <p className="text-[11px] text-[#806B5D]">Every 100ml includes a complimentary 2ml sample.</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-[#2A1D18] border border-[#C18A60]/40 overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1000&auto=format&fit=crop"
                alt="Grasse Perfumery Atelier"
                fill
                className="object-cover filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150F0D] via-transparent to-transparent opacity-60" />
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
