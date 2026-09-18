'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { useRegion } from '@/context/RegionContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Linen Shirt', 'Tailored Trouser', 'Knit Polo', 'Terracotta', 'Overshirt', 'Dress'];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { formatPrice } = useRegion();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.trim().length > 1) {
      productService
        .filterAndSortProducts({ searchQuery: query })
        .then((res) => setResults(res.slice(0, 4)));
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FFF9F1] w-full border-b border-[#DDCBB7] shadow-2xl p-6 sm:p-10 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-6">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#806B5D]">
              CATALOG SEARCH
            </span>
            <button
              onClick={onClose}
              className="p-1 text-[#35251E] hover:text-[#A85F43] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#A85F43]" />
            <input
              type="text"
              placeholder="Search by keyword, product name, fabric, or color..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#F3E5D0]/50 border-2 border-[#DDCBB7] text-[#35251E] font-serif text-lg sm:text-xl pl-14 pr-12 py-4 focus:outline-none focus:border-[#A85F43] placeholder-[#806B5D]/70"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#806B5D] hover:text-[#35251E]"
              >
                CLEAR
              </button>
            )}
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs text-[#806B5D] mr-2">SUGGESTIONS:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="text-xs text-[#35251E] bg-[#F3E5D0] hover:bg-[#A85F43] hover:text-[#FFF9F1] px-3 py-1.5 transition-colors border border-[#DDCBB7]"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Dynamic Live Matching Results */}
          {results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-[#806B5D]">
                  TOP MATCHES ({results.length})
                </h4>
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-semibold text-[#A85F43] hover:underline flex items-center gap-1"
                >
                  <span>SEE ALL RESULTS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      router.push(`/products/${product.slug}`);
                      onClose();
                    }}
                    className="cursor-pointer group border border-[#DDCBB7] bg-[#FFF9F1] p-2 hover:border-[#A85F43] transition-all"
                  >
                    <div className="relative aspect-[3/4] bg-[#F3E5D0] mb-2 overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h5 className="font-serif text-xs font-semibold text-[#35251E] group-hover:text-[#A85F43] truncate">
                      {product.name}
                    </h5>
                    <p className="text-xs font-semibold text-[#806B5D] mt-0.5">
                      {formatPrice(product.priceINR, product.priceUSD)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
