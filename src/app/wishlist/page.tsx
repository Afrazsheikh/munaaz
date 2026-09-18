'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 pb-6 border-b border-[#DDCBB7] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#A85F43] fill-[#A85F43]" />
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#35251E]">
              MY WISHLIST ({wishlistItems.length})
            </h1>
          </div>
          <p className="text-xs text-[#806B5D] mt-1">
            Your saved timeless pieces. Highlighting items you love across devices.
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#A85F43] hover:underline flex items-center gap-1"
          >
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="py-20 text-center bg-[#FFF9F1] border border-[#DDCBB7] p-8">
          <Heart className="w-12 h-12 text-[#806B5D] mx-auto mb-4 stroke-[1.2]" />
          <h3 className="font-serif text-xl font-bold text-[#35251E]">YOUR WISHLIST IS EMPTY</h3>
          <p className="text-xs text-[#806B5D] mt-1 mb-6 max-w-sm mx-auto">
            Click the heart icon on any piece while exploring our collection to save your favorite silhouettes here.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold px-8 py-3.5 tracking-widest uppercase transition-colors"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      ) : (
        <ProductGrid products={wishlistItems} />
      )}
    </div>
  );
}
