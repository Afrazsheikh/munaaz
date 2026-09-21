'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Eye, Heart, ShieldCheck, Gem } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { useRegion } from '@/context/RegionContext';
import { useWishlist } from '@/context/WishlistContext';

export const JewelrySection: React.FC = () => {
  const { formatPrice } = useRegion();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'all' | 'pendant' | 'ring' | 'cuff' | 'earring'>('all');

  const jewelryProducts = MOCK_PRODUCTS.filter((p) => p.category === 'jewelry');

  const filteredProducts = jewelryProducts.filter((product) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pendant') return product.slug.includes('pendant');
    if (activeTab === 'ring') return product.slug.includes('signet') || product.slug.includes('ring');
    if (activeTab === 'cuff') return product.slug.includes('cuff');
    if (activeTab === 'earring') return product.slug.includes('earrings');
    return true;
  });

  return (
    <section className="relative bg-[#050505] text-[#F5F1E8] py-24 sm:py-32 overflow-hidden border-t border-[#C0C0C0]/20">
      {/* Background Metallic & Shimmer Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C0C0C0]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#E2E8F0]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 text-[#E2E8F0] text-[10px] font-medium tracking-[0.3em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C0C0C0] animate-pulse" />
            <span>MUNAAZ HAUTE JOAILLERIE</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#F5F1E8] via-[#E2E8F0] to-[#94A3B8]">
            SILVER, REDEFINED.
          </h2>

          <p className="text-xs sm:text-sm text-[#D8C7AD]/70 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Architectural 925 Sterling Silver hand-sculpted into fluid metal art, electroplated with pure rhodium and handset with moissanite & lab diamonds.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            {[
              { id: 'all', label: 'ALL CREATIONS' },
              { id: 'pendant', label: 'PENDANTS' },
              { id: 'ring', label: 'SIGNETS & RINGS' },
              { id: 'cuff', label: 'SCULPTED CUFFS' },
              { id: 'earring', label: 'DROP EARRINGS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs px-5 py-2.5 tracking-[0.2em] font-medium transition-all border ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#E2E8F0] to-[#CBD5E1] text-[#050505] border-[#E2E8F0] shadow-lg shadow-[#CBD5E1]/10'
                    : 'bg-[#17120E]/80 text-[#D8C7AD]/70 border-[#C0C0C0]/20 hover:border-[#C0C0C0]/50 hover:text-[#F5F1E8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const isWishlisted = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group relative bg-[#17120E] border border-[#C0C0C0]/20 hover:border-[#C0C0C0]/60 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Product Image Container */}
                <div className="relative aspect-[3/4] bg-[#050505] overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.images[1] && (
                    <Image
                      src={product.images[1]}
                      alt={product.name}
                      fill
                      className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  )}

                  {/* Silver Hallmark Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#050505]/80 backdrop-blur-md border border-[#C0C0C0]/30 text-[9px] font-mono text-[#E2E8F0] tracking-widest uppercase">
                    <Gem className="w-3 h-3 text-[#C0C0C0]" />
                    <span>925 STERLING</span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2 bg-[#050505]/80 backdrop-blur-md border border-[#C0C0C0]/30 text-[#F5F1E8] hover:text-[#C0C0C0] transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C0C0C0] text-[#C0C0C0]' : ''}`} />
                  </button>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="w-full bg-[#E2E8F0] hover:bg-white text-[#050505] text-[11px] font-semibold py-3 text-center uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    >
                      <span>DISCOVER PIECE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Details Container */}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#C0C0C0] uppercase block">
                    {product.brand}
                  </span>
                  <h3 className="font-serif text-base text-[#F5F1E8] font-light truncate group-hover:text-[#E2E8F0] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#D8C7AD]/60 line-clamp-1 font-light">
                    {product.shortDescription}
                  </p>

                  <div className="pt-3 border-t border-[#C0C0C0]/15 flex items-center justify-between">
                    <span className="font-mono text-sm text-[#E2E8F0]">
                      {formatPrice(product.priceINR, product.priceUSD)}
                    </span>
                    <span className="text-[10px] text-[#D8C7AD]/50 tracking-wider">
                      {product.sizes[0]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote Banner */}
        <div className="mt-16 p-6 bg-gradient-to-r from-[#17120E] via-[#0D0A08] to-[#17120E] border border-[#C0C0C0]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[#D8C7AD]/80">
            <ShieldCheck className="w-5 h-5 text-[#C0C0C0] flex-shrink-0" />
            <p className="font-light tracking-wide">
              Every MUNAAZ Joaillerie piece comes with a lifetime authenticity guarantee, anti-tarnish warranty, and bespoke velvet jewelry case.
            </p>
          </div>
          <Link
            href="/collections/haute-joaillerie"
            className="flex-shrink-0 text-xs font-semibold tracking-[0.2em] text-[#E2E8F0] hover:text-white uppercase flex items-center gap-2 border-b border-[#C0C0C0] pb-1"
          >
            <span>VIEW HAUTE JOAILLERIE EDIT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
