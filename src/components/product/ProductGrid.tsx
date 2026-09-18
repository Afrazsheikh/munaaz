'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#F3E5D0]/40 animate-pulse aspect-[3/4] border border-[#DDCBB7]" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FFF9F1] border border-[#DDCBB7] p-8">
        <Sparkles className="w-10 h-10 text-[#806B5D] mx-auto mb-3 stroke-[1.2]" />
        <h3 className="font-serif text-xl font-bold text-[#35251E]">NO MATCHING PIECES FOUND</h3>
        <p className="text-xs text-[#806B5D] mt-1 max-w-sm mx-auto">
          Try resetting filters or searching with different terms to explore our atelier collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
