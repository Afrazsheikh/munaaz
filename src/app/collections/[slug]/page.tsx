'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { FilterOptions, SortOption, Product } from '@/types/product';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilterSidebar } from '@/components/product/ProductFilterSidebar';
import { ProductSortDropdown } from '@/components/product/ProductSortDropdown';
import { Filter, ChevronRight } from 'lucide-react';

const COLLECTION_TITLES: Record<string, { title: string; subtitle: string }> = {
  men: {
    title: "MEN'S EDIT",
    subtitle: "Effortless tailored shirts, relaxed trousers, and fine knits crafted for modern luxury."
  },
  women: {
    title: "WOMEN'S EDIT",
    subtitle: "Timeless midi dresses, silk blouses, and wide-leg trousers cut in natural textures."
  },
  'new-arrivals': {
    title: "NEW ARRIVALS",
    subtitle: "Fresh silhouettes and considered details for the autumn atelier."
  },
  'best-sellers': {
    title: "BEST SELLERS",
    subtitle: "Our most coveted, timeless pieces loved by customers across India and the United States."
  },
  sale: {
    title: "SEASONAL SALE",
    subtitle: "Exclusive limited reductions on signature AUREN pieces."
  },
  'linen-edit': {
    title: "THE LINEN EDIT",
    subtitle: "100% European flax linen garments offering unparalleled summer drape and breathability."
  },
  'earth-tones': {
    title: "EARTH TONES EDIT",
    subtitle: "Muted terracotta, desert sand, and deep espresso tones."
  },
  'everyday-essentials': {
    title: "EVERYDAY ESSENTIALS",
    subtitle: "Core wardrobe foundations built for daily versatility."
  }
};

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const collectionInfo = COLLECTION_TITLES[slug] || {
    title: slug.toUpperCase().replace('-', ' '),
    subtitle: "Thoughtfully curated fashion collection."
  };

  const [filters, setFilters] = useState<FilterOptions>({
    collection: slug === 'men' || slug === 'women' ? undefined : slug,
    category: slug === 'men' ? 'men' : slug === 'women' ? 'women' : 'all',
    sizes: [],
    colors: [],
    onSaleOnly: slug === 'sale'
  });
  const [sort, setSort] = useState<SortOption>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    productService.filterAndSortProducts(filters, sort).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, [filters, sort, slug]);

  const handleResetFilters = () => {
    setFilters({
      collection: slug === 'men' || slug === 'women' ? undefined : slug,
      category: slug === 'men' ? 'men' : slug === 'women' ? 'women' : 'all',
      sizes: [],
      colors: [],
      onSaleOnly: slug === 'sale'
    });
    setSort('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#806B5D] mb-6">
        <Link href="/" className="hover:text-[#35251E]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#35251E]">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#35251E] capitalize">{collectionInfo.title}</span>
      </nav>

      {/* Collection Header */}
      <div className="mb-8 pb-6 border-b border-[#DDCBB7]">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#35251E]">
          {collectionInfo.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#806B5D] mt-2 max-w-xl">
          {collectionInfo.subtitle}
        </p>
      </div>

      {/* Toolbar */}
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

      {/* Main Layout */}
      <div className="flex gap-8 items-start">
        <ProductFilterSidebar
          filters={filters}
          onFilterChange={setFilters}
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
