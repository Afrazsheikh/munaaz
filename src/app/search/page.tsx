'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Search, ChevronRight } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService.filterAndSortProducts({ searchQuery: query }).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-xs text-[#806B5D] mb-6">
        <Link href="/" className="hover:text-[#35251E]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#35251E]">Search</span>
      </nav>

      <div className="mb-8 pb-6 border-b border-[#DDCBB7]">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-[#A85F43]" />
          <h1 className="font-serif text-3xl font-bold text-[#35251E]">
            SEARCH RESULTS FOR "{query}"
          </h1>
        </div>
        <p className="text-xs text-[#806B5D] mt-2">
          Found <strong>{products.length}</strong> matching pieces in our atelier.
        </p>
      </div>

      <ProductGrid products={products} isLoading={loading} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#806B5D]">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}
