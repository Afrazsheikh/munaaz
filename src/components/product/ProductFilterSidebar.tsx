'use client';

import React from 'react';
import { FilterOptions } from '@/types/product';
import { X, Check } from 'lucide-react';

interface ProductFilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onResetFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORIES = [
  { id: 'all', name: 'All Pieces' },
  { id: 'men', name: "Men's Edit" },
  { id: 'women', name: "Women's Edit" },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];

const COLORS = [
  { name: 'Sand Beige', hex: '#D6C5B3' },
  { name: 'Terracotta', hex: '#A85F43' },
  { name: 'Off-White', hex: '#FAF9F6' },
  { name: 'Espresso', hex: '#2A1D18' },
  { name: 'Warm Taupe', hex: '#806B5D' },
  { name: 'Caramel Brown', hex: '#C18A60' }
];

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile,
  onCloseMobile
}) => {
  const handleCategorySelect = (cat: string) => {
    onFilterChange({ ...filters, category: cat as any });
  };

  const handleSizeToggle = (sz: string) => {
    const current = filters.sizes || [];
    const updated = current.includes(sz)
      ? current.filter((s) => s !== sz)
      : [...current, sz];
    onFilterChange({ ...filters, sizes: updated });
  };

  const handleColorToggle = (col: string) => {
    const current = filters.colors || [];
    const updated = current.includes(col)
      ? current.filter((c) => c !== col)
      : [...current, col];
    onFilterChange({ ...filters, colors: updated });
  };

  const content = (
    <div className="space-y-8 text-[#35251E]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDCBB7]">
        <h3 className="font-serif text-lg font-bold tracking-wider uppercase">FILTERS</h3>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-[#A85F43] hover:underline"
        >
          CLEAR ALL
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[#806B5D] mb-3">
          CATEGORY
        </h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`block text-xs text-left w-full transition-colors ${
                (filters.category || 'all') === cat.id
                  ? 'font-bold text-[#A85F43] pl-2 border-l-2 border-[#A85F43]'
                  : 'text-[#35251E] hover:text-[#A85F43]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[#806B5D] mb-3">
          SIZES
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((sz) => {
            const selected = filters.sizes?.includes(sz);
            return (
              <button
                key={sz}
                onClick={() => handleSizeToggle(sz)}
                className={`w-9 h-9 border text-xs font-semibold transition-all ${
                  selected
                    ? 'border-[#A85F43] bg-[#A85F43] text-white'
                    : 'border-[#DDCBB7] text-[#35251E] hover:border-[#C18A60]'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[#806B5D] mb-3">
          PALETTE
        </h4>
        <div className="space-y-2">
          {COLORS.map((c) => {
            const selected = filters.colors?.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => handleColorToggle(c.name)}
                className={`flex items-center gap-2.5 text-xs text-left w-full p-1.5 border transition-all ${
                  selected
                    ? 'border-[#A85F43] bg-[#F3E5D0]/60 font-semibold'
                    : 'border-transparent hover:bg-[#F3E5D0]/30'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
                {selected && <Check className="w-3.5 h-3.5 text-[#A85F43] ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* On Sale Toggle */}
      <div className="pt-4 border-t border-[#DDCBB7]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.onSaleOnly}
            onChange={(e) => onFilterChange({ ...filters, onSaleOnly: e.target.checked })}
            className="accent-[#A85F43] w-4 h-4"
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#35251E]">
            ON SALE ONLY
          </span>
        </label>
      </div>

    </div>
  );

  // Mobile Bottom Sheet / Drawer wrapper
  if (isOpenMobile) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
        <div className="relative bg-[#FFF9F1] w-4/5 max-w-xs h-full p-6 shadow-2xl overflow-y-auto z-10 border-l border-[#DDCBB7]">
          <div className="flex justify-end mb-4">
            <button onClick={onCloseMobile} className="p-1 text-[#35251E]">
              <X className="w-6 h-6" />
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  // Desktop Static Sidebar
  return <aside className="hidden lg:block w-64 flex-shrink-0 pr-8">{content}</aside>;
};
