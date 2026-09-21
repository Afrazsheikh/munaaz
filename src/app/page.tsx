'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Check, RefreshCw, Shirt } from 'lucide-react';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';
import { ShirtLoader } from '@/components/ui/ShirtLoader';
import { FragranceSection } from '@/components/fragrance/FragranceSection';
import { FragranceTeaserCard } from '@/components/fragrance/FragranceTeaserCard';
import { JewelrySection } from '@/components/jewelry/JewelrySection';
import { JewelleryScrollSequence } from '@/components/jewellery/JewelleryScrollSequence';

export default function HomePage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  // Interactive Shirt Fitting State
  const [fittedFabric, setFittedFabric] = useState<'linen' | 'pima' | 'wool'>('linen');
  const [isFittingAnim, setIsFittingAnim] = useState(false);

  // Scroll Reveal Observer
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Initial splash loader timer
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1200);

    productService.getProductsByCollection('new-arrivals').then((res) => setNewArrivals(res.slice(0, 4)));
    productService.getProductsByCollection('best-sellers').then((res) => setBestSellers(res.slice(0, 4)));

    return () => clearTimeout(timer);
  }, []);

  const handleFabricChange = (fabric: 'linen' | 'pima' | 'wool') => {
    setIsFittingAnim(true);
    setFittedFabric(fabric);
    setTimeout(() => {
      setIsFittingAnim(false);
    }, 500);
  };

  return (
    <>
      {/* 1. INITIAL HOMEPAGE SPLASH LOADER OVERLAY */}
      {pageLoading && (
        <div className="fixed inset-0 z-50 bg-[#FFF9F1] flex items-center justify-center transition-opacity duration-700">
          <ShirtLoader size="full" label="FITTING MUNAAZ ATELIER..." />
        </div>
      )}

      <div className="space-y-16 sm:space-y-24 pb-16">
        
        {/* C. HERO SECTION */}
        <section className="relative min-h-[85vh] bg-[#F3E5D0] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
              alt="MUNAAZ Luxury Editorial Fashion"
              fill
              priority
              className="object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A1D18]/70 via-[#2A1D18]/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-[#FFF9F1]">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF9F1]/10 backdrop-blur-md border border-[#FFF9F1]/20 text-xs font-semibold tracking-[0.2em] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#C18A60]" />
                <span>AUTUMN / WINTER ATELIER</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                EVERYDAY, <br />
                <span className="italic font-normal text-[#F3E5D0]">ELEVATED.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#DDCBB7] font-light leading-relaxed max-w-md">
                Thoughtfully designed clothing for a life well lived. Crafted from natural fabrics in muted earth tones for India & international closets.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                  href="/collections/men"
                  className="bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold px-7 py-3.5 tracking-[0.15em] uppercase transition-colors text-center shadow-lg"
                >
                  SHOP MEN
                </Link>
                <Link
                  href="/collections/women"
                  className="bg-[#FFF9F1] hover:bg-[#F3E5D0] text-[#35251E] text-xs font-semibold px-7 py-3.5 tracking-[0.15em] uppercase transition-colors text-center shadow-lg"
                >
                  SHOP WOMEN
                </Link>
                <Link
                  href="/fragrance"
                  className="bg-[#2A1D18] hover:bg-[#A85F43] text-[#FFF9F1] border border-[#C18A60]/50 text-xs font-bold px-7 py-3.5 tracking-[0.15em] uppercase transition-colors text-center shadow-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C18A60]" />
                  <span>EXPLORE FRAGRANCES</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* D. SHOP BY CATEGORY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#806B5D]">
              CURATED CATEGORIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#35251E] mt-1">
              SHOP BY SILHOUETTE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            
            {/* Men's Card */}
            <Link href="/collections/men" className="group relative aspect-[4/5] bg-[#F3E5D0] overflow-hidden border border-[#DDCBB7]">
              <Image
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop"
                alt="Men's Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1D18]/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-[#FFF9F1]">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#C18A60] uppercase mb-1">MENSWEAR</span>
                <h3 className="font-serif text-2xl font-bold tracking-wider">MEN</h3>
                <span className="text-xs font-semibold tracking-widest text-[#F3E5D0] mt-3 group-hover:text-[#C18A60] flex items-center gap-1">
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Women's Card */}
            <Link href="/collections/women" className="group relative aspect-[4/5] bg-[#F3E5D0] overflow-hidden border border-[#DDCBB7]">
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop"
                alt="Women's Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1D18]/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-[#FFF9F1]">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#C18A60] uppercase mb-1">WOMENSWEAR</span>
                <h3 className="font-serif text-2xl font-bold tracking-wider">WOMEN</h3>
                <span className="text-xs font-semibold tracking-widest text-[#F3E5D0] mt-3 group-hover:text-[#C18A60] flex items-center gap-1">
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Fragrance Card */}
            <Link href="/fragrance" className="group relative aspect-[4/5] bg-[#1C1412] overflow-hidden border border-[#C18A60]/50 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop"
                alt="MUNAAZ Essence Fragrances"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-black/30 to-transparent flex flex-col justify-end p-6 text-[#FFF9F1]">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#C18A60] uppercase mb-1">EAU DE PARFUM</span>
                <h3 className="font-serif text-2xl font-bold tracking-wider text-white">FRAGRANCE</h3>
                <span className="text-xs font-semibold tracking-widest text-[#C18A60] mt-3 group-hover:text-white flex items-center gap-1">
                  <span>ENTER ATELIER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* New Arrivals Card */}
            <Link href="/collections/new-arrivals" className="group relative aspect-[4/5] bg-[#F3E5D0] overflow-hidden border border-[#DDCBB7]">
              <Image
                src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop"
                alt="New Arrivals"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1D18]/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-[#FFF9F1]">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#C18A60] uppercase mb-1">THE EDIT</span>
                <h3 className="font-serif text-2xl font-bold tracking-wider">NEW ARRIVALS</h3>
                <span className="text-xs font-semibold tracking-widest text-[#F3E5D0] mt-3 group-hover:text-[#C18A60] flex items-center gap-1">
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* E. NEW ARRIVALS ("THE NEW EDIT") */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#DDCBB7]">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#806B5D]">
                FRESH SILHOUETTES
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#35251E] mt-1">
                THE NEW EDIT
              </h2>
            </div>
            <Link
              href="/collections/new-arrivals"
              className="text-xs font-semibold tracking-widest text-[#A85F43] hover:underline uppercase mt-2 sm:mt-0 flex items-center gap-1"
            >
              <span>VIEW ALL NEW ARRIVALS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* E2. MUNAAZ ESSENCE LUXURY FRAGRANCE TEASER BANNER */}
        <FragranceTeaserCard />

        {/* E3. MUNAAZ HAUTE JOAILLERIE FINE SILVER JEWELRY SECTION */}
        <JewelrySection />

        {/* E4. CINEMATIC JEWELLERY SCROLL SEQUENCE ENGINE (jewScene/1st -> 2nd -> 3rd -> 4th -> 5th...) */}
        <JewelleryScrollSequence />

        {/* NEW FEATURE: INTERACTIVE SHIRT WEARING & FABRIC FIT ADVISOR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2A1D18] text-[#F3E5D0] p-8 sm:p-12 border border-[#35251E] shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#35251E] text-[#C18A60] text-[10px] font-bold tracking-widest uppercase border border-[#806B5D]/40">
                <Shirt className="w-3.5 h-3.5" />
                <span>INTERACTIVE FABRIC & FIT EXPERIENCE</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFF9F1]">
                THE SHIRT WEARING & DRAPE LAB
              </h2>

              <p className="text-xs sm:text-sm text-[#806B5D] leading-relaxed">
                Experience how our 3 signature atelier fabrics drape when worn. Select a weave below to simulate the texture and weight:
              </p>

              {/* Fabric Picker Toggles */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleFabricChange('linen')}
                  className={`px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 border ${
                    fittedFabric === 'linen'
                      ? 'border-[#A85F43] bg-[#A85F43] text-white'
                      : 'border-[#806B5D]/40 text-[#F3E5D0] hover:border-[#C18A60]'
                  }`}
                >
                  <span>100% FRENCH FLAX LINEN</span>
                  {fittedFabric === 'linen' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleFabricChange('pima')}
                  className={`px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 border ${
                    fittedFabric === 'pima'
                      ? 'border-[#A85F43] bg-[#A85F43] text-white'
                      : 'border-[#806B5D]/40 text-[#F3E5D0] hover:border-[#C18A60]'
                  }`}
                >
                  <span>PERUVIAN PIMA COTTON</span>
                  {fittedFabric === 'pima' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleFabricChange('wool')}
                  className={`px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 border ${
                    fittedFabric === 'wool'
                      ? 'border-[#A85F43] bg-[#A85F43] text-white'
                      : 'border-[#806B5D]/40 text-[#F3E5D0] hover:border-[#C18A60]'
                  }`}
                >
                  <span>TROPICAL WOOL TWILL</span>
                  {fittedFabric === 'wool' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Specs */}
              <div className="pt-2 text-xs text-[#806B5D] space-y-1">
                <p>Weight: <strong>{fittedFabric === 'linen' ? '180 gsm' : fittedFabric === 'pima' ? '210 gsm' : '320 gsm'}</strong></p>
                <p>Feel: <strong>{fittedFabric === 'linen' ? 'Airy & Textured Slub' : fittedFabric === 'pima' ? 'Silky Smooth & Stretch' : 'Brushed Heavy Structure'}</strong></p>
              </div>
            </div>

            {/* Right Interactive Animated Shirt Box (5 Cols) */}
            <div className="lg:col-span-5 bg-[#35251E] p-8 border border-[#806B5D]/30 flex flex-col items-center justify-center min-h-[260px]">
              {isFittingAnim ? (
                <ShirtLoader size="lg" label="SIMULATING SHIRT FIT..." />
              ) : (
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-40 mx-auto bg-[#F3E5D0]/10 border border-[#C18A60]/40 overflow-hidden flex items-center justify-center p-4">
                    <Image
                      src={
                        fittedFabric === 'linen'
                          ? 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop'
                          : fittedFabric === 'pima'
                          ? 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop'
                          : 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop'
                      }
                      alt="Fitted Shirt Silhouette"
                      fill
                      className="object-cover transition-opacity duration-500 opacity-90"
                    />
                  </div>

                  <Link
                    href={`/products/${
                      fittedFabric === 'linen'
                        ? 'the-essential-linen-shirt'
                        : fittedFabric === 'pima'
                        ? 'the-soft-knit-polo'
                        : 'the-signature-overshirt'
                    }`}
                    className="inline-block bg-[#A85F43] hover:bg-[#C18A60] text-white text-xs font-semibold px-6 py-2.5 uppercase tracking-widest transition-colors"
                  >
                    VIEW THIS SHIRT PIECE →
                  </Link>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* F. BRAND STORY SECTION */}
        <section className="bg-[#F3E5D0]/60 border-y border-[#DDCBB7] py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-square bg-[#FFF9F1] border border-[#DDCBB7] shadow-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
                alt="MUNAAZ Atelier Craftsmanship"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#806B5D]">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#35251E] leading-tight">
                MADE FOR YOUR EVERYDAY.
              </h2>
              <p className="text-sm sm:text-base text-[#806B5D] leading-relaxed font-light">
                Thoughtful design, considered details, and effortless silhouettes come together in a collection made to move with you. From European flax linen to high-gauge Peruvian Pima cotton, every garment is built to age gracefully.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-[#35251E] hover:bg-[#A85F43] text-[#FFF9F1] text-xs font-semibold px-8 py-3.5 tracking-widest uppercase transition-colors"
                >
                  <span>DISCOVER OUR STORY</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* G. FEATURED COLLECTION BANNER ("THE EARTH TONES EDIT") */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#2A1D18] text-[#F3E5D0] overflow-hidden p-8 sm:p-16 border border-[#35251E] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4 text-center lg:text-left z-10">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#C18A60]">
                SEASONAL HIGHLIGHT
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FFF9F1]">
                THE EARTH TONES EDIT
              </h2>
              <p className="text-sm text-[#806B5D] leading-relaxed">
                Warm terracotta, desert sand, and deep espresso textures curated for modern, refined wardrobes.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections/earth-tones"
                  className="inline-block bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold px-8 py-3.5 tracking-widest uppercase transition-colors"
                >
                  EXPLORE COLLECTION
                </Link>
              </div>
            </div>

            <div className="relative w-full lg:w-96 aspect-[4/3] bg-[#35251E] border border-[#806B5D]/30 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop"
                alt="Earth Tones Banner"
                fill
                className="object-cover opacity-90"
              />
            </div>
          </div>
        </section>

        {/* H. BEST SELLERS GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#DDCBB7]">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#806B5D]">
                CUSTOMER FAVORITES
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#35251E] mt-1">
                BEST SELLERS
              </h2>
            </div>
            <Link
              href="/collections/best-sellers"
              className="text-xs font-semibold tracking-widest text-[#A85F43] hover:underline uppercase mt-2 sm:mt-0 flex items-center gap-1"
            >
              <span>VIEW ALL BEST SELLERS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
