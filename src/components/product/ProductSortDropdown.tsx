'use client';

import React from 'react';
import { SortOption } from '@/types/product';
import { ChevronDown } from 'lucide-react';

interface ProductSortDropdownProps {
  currentSort: SortOption;
  onSortChange: (newSort: SortOption) => void;
}

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'featured', label: 'Featured Edit' },
  { id: 'newest', label: 'Newest Additions' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'name-asc', label: 'Alphabetical: A–Z' },
];

export const ProductSortDropdown: React.FC<ProductSortDropdownProps> = ({
  currentSort,
  onSortChange
}) => {
  return (
    <div className="relative flex items-center gap-2">
      <span className="text-xs text-[#806B5D] uppercase tracking-wider hidden sm:inline">
        SORT BY:
      </span>
      <div className="relative inline-block">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-[#FFF9F1] border border-[#DDCBB7] hover:border-[#A85F43] text-xs font-semibold text-[#35251E] py-2 pl-3 pr-8 focus:outline-none cursor-pointer rounded-none transition-colors"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#35251E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
