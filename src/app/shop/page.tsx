'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FilterOptions, SortOption, Product } from '@/types/product';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilterSidebar } from '@/components/product/ProductFilterSidebar';
import { ProductSortDropdown } from '@/components/product/ProductSortDropdown';
import { Filter, ChevronRight } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = (searchParams.get('sort') as SortOption) || 'featured';

  const [filters, setFilters] = useState<FilterOptions>({
    category: categoryParam as any,
    sizes: [],
    colors: [],
    onSaleOnly: false
  });
  const [sort, setSort] = useState<SortOption>(sortParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    productService.filterAndSortProducts(filters, sort).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, [filters, sort]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      sizes: [],
      colors: [],
      onSaleOnly: false
    });
    setSort('featured');
    router.push('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#806B5D] mb-6">
        <Link href="/" className="hover:text-[#35251E]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#35251E]">Shop All</span>
      </nav>

      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-[#DDCBB7]">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#35251E]">
          ALL PIECES
        </h1>
        <p className="text-xs sm:text-sm text-[#806B5D] mt-2 max-w-xl">
          Explore our complete collection of luxury everyday clothing crafted from French flax linen, Peruvian Pima cotton, and fine wool blends.
        </p>
      </div>

      {/* Toolbar (Mobile Filter Button, Count, Sort) */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#DDCBB7]/60">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 text-xs font-semibold text-[#35251E] bg-[#F3E5D0] px-4 py-2 border border-[#DDCBB7]"
          >
            <Filter className="w-4 h-4 text-[#A85F43]" />
            <span>FILTER</span>
          </button>
          <span className="text-xs text-[#806B5D] font-medium">
            SHOWING <strong className="text-[#35251E] font-bold">{products.length}</strong> PIECES
          </span>
        </div>

        <ProductSortDropdown currentSort={sort} onSortChange={setSort} />
      </div>

      {/* Main Layout (Sidebar + Product Grid) */}
      <div className="flex gap-8 items-start">
        <ProductFilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        <div className="flex-1">
          <ProductGrid products={products} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#806B5D]">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
