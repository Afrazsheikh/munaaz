'use client';

import React from 'react';
import Image from 'next/image';
import { X, Sparkles, ShoppingBag, Check, Star } from 'lucide-react';
import { FragranceProduct } from '@/types/fragrance';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';

interface FragranceNotesModalProps {
  fragrance: FragranceProduct | null;
  onClose: () => void;
}

export const FragranceNotesModal: React.FC<FragranceNotesModalProps> = ({ fragrance, onClose }) => {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  if (!fragrance) return null;

  const handleAddToCart = () => {
    const cartAdapterProduct: Product = {
      id: fragrance.id,
      slug: fragrance.slug,
      name: fragrance.name,
      brand: 'MUNAAZ Essence',
      category: 'accessories',
      collections: ['everyday-essentials'],
      shortDescription: fragrance.description,
      description: fragrance.story,
      fabricCare: [`Size: ${fragrance.size}`, `Concentration: ${fragrance.subtitle}`],
      features: [
        `Top Notes: ${fragrance.notes.top.join(', ')}`,
        `Heart Notes: ${fragrance.notes.heart.join(', ')}`,
        `Base Notes: ${fragrance.notes.base.join(', ')}`
      ],
      priceINR: fragrance.priceINR,
      compareAtPriceINR: fragrance.compareAtPriceINR,
      priceUSD: fragrance.priceUSD,
      compareAtPriceUSD: fragrance.compareAtPriceUSD,
      images: fragrance.images,
      colors: [{ name: fragrance.name, hex: fragrance.accentColor, image: fragrance.images[0] }],
      sizes: [fragrance.size],
      variants: [{ id: `v-${fragrance.id}`, color: fragrance.name, size: fragrance.size, sku: `FRAG-${fragrance.slug}`, stock: 50 }],
      isNewArrival: true,
      isBestSeller: !!fragrance.isBestseller,
      isSale: false,
      rating: fragrance.rating,
      reviewCount: fragrance.reviewCount,
      createdAt: '2026-09-01'
    };

    addItem(cartAdapterProduct, fragrance.name, fragrance.size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl bg-[#2A1D18] text-[#FFF9F1] border border-[#C18A60]/40 shadow-2xl overflow-hidden rounded-none my-8 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-[#A85F43] text-[#FFF9F1] transition-colors border border-white/10"
          aria-label="Close notes modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Visual Image (40%) */}
        <div className="relative w-full md:w-5/12 aspect-[3/4] md:aspect-auto bg-[#1A1210]">
          <Image
            src={fragrance.images[0]}
            alt={fragrance.name}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1D18] via-transparent to-black/30 md:bg-gradient-to-r md:from-transparent md:to-[#2A1D18]" />
          
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#2A1D18]/80 backdrop-blur-md border border-[#C18A60]/30 md:hidden">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-[#C18A60] uppercase block">{fragrance.subtitle}</span>
            <h3 className="font-serif text-2xl font-bold tracking-wider">{fragrance.name}</h3>
          </div>
        </div>

        {/* Right Details (60%) */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
          <div>
            <div className="hidden md:block border-b border-[#806B5D]/30 pb-4">
              <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] font-bold text-[#C18A60] uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{fragrance.badge || 'MUNAAZ ESSENCE ATELIER'}</span>
              </div>
              <h2 className="font-serif text-3xl font-bold tracking-wide text-[#FFF9F1]">
                {fragrance.name}
              </h2>
              <div className="flex items-center justify-between mt-1 text-xs text-[#DDCBB7]">
                <span>{fragrance.subtitle} · {fragrance.size}</span>
                <div className="flex items-center gap-1 text-[#C18A60]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold text-white">{fragrance.rating}</span>
                  <span className="text-gray-400">({fragrance.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Olfactory Notes Pyramid */}
            <div className="mt-4 space-y-4">
              <h4 className="text-xs font-bold tracking-[0.25em] text-[#C18A60] uppercase">
                OLFACTORY PYRAMID
              </h4>

              <div className="space-y-3 bg-[#35251E]/70 p-4 border border-[#806B5D]/30">
                {/* Top Notes */}
                <div>
                  <span className="text-[10px] font-semibold tracking-widest text-[#DDCBB7] uppercase block mb-1">
                    TOP NOTES (FIRST IMPRESSION)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {fragrance.notes.top.map((note) => (
                      <span key={note} className="px-2.5 py-1 bg-[#2A1D18] text-[#FFF9F1] text-xs font-light border border-[#C18A60]/30">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heart Notes */}
                <div>
                  <span className="text-[10px] font-semibold tracking-widest text-[#C18A60] uppercase block mb-1">
                    HEART NOTES (THE IDENTITY)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {fragrance.notes.heart.map((note) => (
                      <span key={note} className="px-2.5 py-1 bg-[#A85F43]/30 text-[#FFF9F1] text-xs font-light border border-[#A85F43]">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Notes */}
                <div>
                  <span className="text-[10px] font-semibold tracking-widest text-[#DDCBB7] uppercase block mb-1">
                    BASE NOTES (THE LINGERING TRAIL)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {fragrance.notes.base.map((note) => (
                      <span key={note} className="px-2.5 py-1 bg-[#2A1D18] text-[#F3E5D0] text-xs font-light border border-[#806B5D]/40">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Story */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold tracking-widest text-[#806B5D] uppercase block">
                  THE ESSENCE STORY
                </span>
                <p className="text-xs sm:text-sm text-[#DDCBB7] font-light leading-relaxed">
                  {fragrance.story}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Cart Action */}
          <div className="pt-4 border-t border-[#806B5D]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xl font-bold font-serif text-[#FFF9F1]">
                ₹{fragrance.priceINR.toLocaleString()} <span className="text-xs font-sans text-[#806B5D]">/ ${fragrance.priceUSD}</span>
              </div>
              <p className="text-[10px] text-[#806B5D]">Complimentary Express Shipping & Sample Set Included</p>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full sm:w-auto px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase transition-all flex items-center justify-center gap-2 ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#A85F43] hover:bg-[#C18A60] text-white shadow-lg'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
