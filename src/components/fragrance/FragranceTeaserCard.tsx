'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Droplet } from 'lucide-react';
import { getStoredFragranceData } from '@/data/fragranceData';

export const FragranceTeaserCard: React.FC = () => {
  const [heroData, setHeroData] = React.useState({
    title: 'MUNAAZ ESSENCE',
    tagline: '"THE SCENT OF YOUR PRESENCE"',
    subtitle: 'Discover a signature fragrance crafted to become part of your identity.',
    bottleImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop'
  });

  React.useEffect(() => {
    const data = getStoredFragranceData();
    if (data && data.hero) {
      setHeroData({
        title: data.hero.title || 'MUNAAZ ESSENCE',
        tagline: data.hero.tagline || '"THE SCENT OF YOUR PRESENCE"',
        subtitle: data.hero.subtitle || 'Discover a signature fragrance crafted to become part of your identity.',
        bottleImage: data.hero.bottleImage || 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop'
      });
    }
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="relative bg-[#1C1412] text-[#FFF9F1] overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#C18A60]/40 shadow-2xl group">
        
        {/* Background Ambient Glow & Texture */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#C18A60]/25 rounded-full blur-3xl group-hover:bg-[#C18A60]/35 transition-colors duration-700" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#A85F43]/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#1C1412]/50 to-[#120C0A]" />
        </div>

        {/* Floating Ambient Sparkles/Droplets overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(#C18A60_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Content (8 Cols) */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#35251E]/90 backdrop-blur-md border border-[#C18A60]/40 text-[10px] font-bold tracking-[0.25em] text-[#C18A60] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C18A60]" />
              <span>THE FRAGRANCE ATELIER</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[0.18em] uppercase text-[#FFF9F1] leading-tight">
              {heroData.title}
            </h2>

            <p className="font-serif italic text-lg sm:text-xl text-[#F3E5D0] font-light">
              {heroData.tagline}
            </p>

            <p className="text-xs sm:text-sm text-[#DDCBB7] font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
              {heroData.subtitle}
            </p>

            {/* Quick Scent Family Pills */}
            <div className="pt-1 flex flex-wrap justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 bg-[#2A1D18] border border-[#806B5D]/40 text-[10px] font-mono text-[#F3E5D0] uppercase">
                NOIR · WOOD & ROSE
              </span>
              <span className="px-3 py-1 bg-[#2A1D18] border border-[#C18A60]/40 text-[10px] font-mono text-[#C18A60] uppercase">
                OUD · ROYAL AGARWOOD
              </span>
              <span className="px-3 py-1 bg-[#2A1D18] border border-[#806B5D]/40 text-[10px] font-mono text-[#F3E5D0] uppercase">
                AMBER · WARM VANILLA
              </span>
              <span className="px-3 py-1 bg-[#2A1D18] border border-[#806B5D]/40 text-[10px] font-mono text-[#F3E5D0] uppercase">
                BLANC · WHITE FLORAL
              </span>
            </div>

            {/* CTA Button linking to /fragrance */}
            <div className="pt-4">
              <Link
                href="/fragrance"
                className="inline-flex items-center justify-center gap-3 bg-[#A85F43] hover:bg-[#C18A60] text-white text-xs font-semibold px-8 py-4 tracking-[0.2em] uppercase transition-all duration-300 shadow-2xl border border-[#C18A60]/30 hover:scale-102"
              >
                <span>ENTER FRAGRANCE ATELIER</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Perfume Visual Thumbnail (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-56 sm:w-64 aspect-[3/4] bg-[#2A1D18]/80 border border-[#C18A60]/30 overflow-hidden shadow-2xl p-4 group-hover:border-[#C18A60] transition-colors duration-500">
              <Image
                src={heroData.bottleImage}
                alt="MUNAAZ Eau de Parfum Visual"
                fill
                className="object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-[#2A1D18]/95 backdrop-blur-md border border-[#C18A60]/40 text-center">
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C18A60] uppercase block">
                  EAU DE PARFUM · 100ML
                </span>
                <span className="font-serif text-sm font-bold text-white tracking-wider uppercase block">
                  MUNAAZ ESSENCE
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
