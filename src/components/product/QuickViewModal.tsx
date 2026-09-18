'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { useRegion } from '@/context/RegionContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { formatPrice } = useRegion();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedSize, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FFF9F1] w-full max-w-3xl border border-[#DDCBB7] shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 z-20 text-[#35251E] bg-[#FFF9F1]/80 hover:bg-[#FFF9F1] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column Left */}
        <div className="p-4 bg-[#F3E5D0]/30 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full bg-[#F3E5D0] mb-3">
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex gap-2 justify-center">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`relative w-12 h-16 border ${
                  activeImageIndex === i ? 'border-[#A85F43]' : 'border-transparent opacity-70'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details Column Right */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#806B5D] uppercase block">
              {product.brand}
            </span>
            <h3 className="font-serif text-xl font-bold text-[#35251E] mt-1">
              {product.name}
            </h3>

            <div className="mt-2 flex items-center gap-3">
              <span className="font-bold text-lg text-[#35251E]">
                {formatPrice(product.priceINR, product.priceUSD)}
              </span>
              {product.compareAtPriceINR && (
                <span className="text-xs text-[#806B5D] line-through">
                  {formatPrice(product.compareAtPriceINR, product.compareAtPriceUSD || 0)}
                </span>
              )}
            </div>

            <p className="text-xs text-[#806B5D] mt-3 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color Selector */}
            <div className="mt-5">
              <label className="block text-xs font-semibold text-[#35251E] mb-2 uppercase tracking-wider">
                COLOR: <span className="font-normal text-[#806B5D]">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs transition-all ${
                      selectedColor === c.name
                        ? 'border-[#A85F43] bg-[#F3E5D0] font-semibold text-[#35251E]'
                        : 'border-[#DDCBB7] hover:border-[#C18A60] text-[#806B5D]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-5">
              <label className="block text-xs font-semibold text-[#35251E] mb-2 uppercase tracking-wider">
                SIZE: <span className="font-normal text-[#806B5D]">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 border text-xs font-semibold transition-all flex items-center justify-center ${
                      selectedSize === sz
                        ? 'border-[#A85F43] bg-[#A85F43] text-white'
                        : 'border-[#DDCBB7] text-[#35251E] hover:border-[#C18A60]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-4 border-t border-[#DDCBB7] space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#A85F43] hover:bg-[#C18A60] text-[#FFF9F1] text-xs font-semibold py-3 uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 border border-[#DDCBB7] hover:border-[#A85F43] text-[#35251E] transition-colors"
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#A85F43] text-[#A85F43]' : ''}`} />
              </button>
            </div>

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs font-semibold text-[#806B5D] hover:text-[#35251E] pt-1 transition-colors"
            >
              VIEW FULL PRODUCT DETAILS →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
