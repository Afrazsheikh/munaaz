'use client';

import React from 'react';
import Link from 'next/link';
import { X, Globe, User, Heart, ShoppingBag } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { useRegion } from '@/context/RegionContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegionModal: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenRegionModal }) => {
  const { config } = useRegion();
  const { wishlistCount } = useWishlist();
  const { totalItems, openCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative bg-[#FFF9F1] w-4/5 max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-r border-[#DDCBB7]">
        <div>
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-[#DDCBB7]">
            <Link href="/" onClick={onClose} className="font-serif text-2xl font-bold tracking-[0.2em] text-[#35251E]">
              {BRAND_CONFIG.name}
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 text-[#35251E] hover:text-[#A85F43] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-6 space-y-4">
            <Link
              href="/collections/new-arrivals"
              onClick={onClose}
              className="block text-sm font-semibold tracking-widest text-[#35251E] hover:text-[#A85F43]"
            >
              NEW ARRIVALS
            </Link>
            <Link
              href="/collections/men"
              onClick={onClose}
              className="block text-sm font-semibold tracking-widest text-[#35251E] hover:text-[#A85F43]"
            >
              MEN
            </Link>
            <Link
              href="/collections/women"
              onClick={onClose}
              className="block text-sm font-semibold tracking-widest text-[#35251E] hover:text-[#A85F43]"
            >
              WOMEN
            </Link>
            <Link
              href="/fragrance"
              onClick={onClose}
              className="block text-sm font-bold tracking-widest text-[#2A1D18] bg-[#F3E5D0] border border-[#C18A60]/40 p-3 rounded-none flex items-center justify-between"
            >
              <span>MUNAAZ ESSENCE FRAGRANCE</span>
              <span className="text-[9px] bg-[#A85F43] text-white px-2 py-0.5 font-mono uppercase">EXPLORE</span>
            </Link>
            <Link
              href="/shop"
              onClick={onClose}
              className="block text-sm font-semibold tracking-widest text-[#35251E] hover:text-[#A85F43]"
            >
              SHOP ALL COLLECTIONS
            </Link>
            <Link
              href="/collections/best-sellers"
              onClick={onClose}
              className="block text-sm font-semibold tracking-widest text-[#35251E] hover:text-[#A85F43]"
            >
              BEST SELLERS
            </Link>
            <Link
              href="/collections/sale"
              onClick={onClose}
              className="block text-sm font-semibold tracking-widest text-[#A85F43]"
            >
              SEASONAL SALE
            </Link>

            <div className="pt-4 border-t border-[#DDCBB7] space-y-3">
              <Link
                href="/about"
                onClick={onClose}
                className="block text-xs text-[#806B5D] hover:text-[#35251E]"
              >
                About Our Atelier
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="block text-xs text-[#806B5D] hover:text-[#35251E]"
              >
                Customer Service
              </Link>
              <Link
                href="/size-guide"
                onClick={onClose}
                className="block text-xs text-[#806B5D] hover:text-[#35251E]"
              >
                Size Guide
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#F3E5D0] border-t border-[#DDCBB7] space-y-4">
          <button
            onClick={() => {
              onClose();
              onOpenRegionModal();
            }}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#35251E] bg-[#FFF9F1] px-4 py-3 border border-[#DDCBB7]"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#A85F43]" />
              <span>{config.flag} {config.name} ({config.currency})</span>
            </span>
            <span className="text-[#A85F43] text-[10px]">CHANGE</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-center gap-2 text-xs font-semibold bg-[#FFF9F1] py-2.5 border border-[#DDCBB7] text-[#35251E]"
            >
              <Heart className="w-4 h-4 text-[#A85F43]" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
            <button
              onClick={() => {
                onClose();
                openCart();
              }}
              className="flex items-center justify-center gap-2 text-xs font-semibold bg-[#A85F43] text-[#FFF9F1] py-2.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag ({totalItems})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
